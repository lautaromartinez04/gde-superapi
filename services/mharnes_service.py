from sqlalchemy.orm import Session
import models
import schemas
import os
import shutil
from fastapi import UploadFile
from typing import List, Optional
from PIL import Image
import io

import io
from services.image_service import save_upload_to_db, delete_image_from_db
from models.image_store import ImageStore
import uuid

import uuid

THUMB_SIZE = 300  # max px on longest side

def save_comment_photo(db: Session, upload_file: UploadFile, comment_id: int) -> tuple:
    """Save original + generate 300px thumbnail in DB. Returns (original_url, thumb_url)."""
    file_bytes = upload_file.file.read()
    
    uid = uuid.uuid4().hex[:8]
    _, ext = os.path.splitext(upload_file.filename)
    base_name = f"comment-{comment_id}-{uid}"
    
    # Save original to DB
    orig_image = ImageStore(
        file_name=f"{base_name}{ext}",
        content_type=upload_file.content_type or "image/jpeg",
        file_data=file_bytes
    )
    db.add(orig_image)
    
    # Generate thumbnail
    thumb_bytes = file_bytes
    try:
        img = Image.open(io.BytesIO(file_bytes))
        img = img.convert("RGB")
        img.thumbnail((THUMB_SIZE, THUMB_SIZE), Image.LANCZOS)
        
        thumb_io = io.BytesIO()
        img.save(thumb_io, "JPEG", quality=80, optimize=True)
        thumb_bytes = thumb_io.getvalue()
    except Exception as e:
        print(f"Warning: could not generate thumbnail for {base_name}: {e}")
        
    # Save thumb to DB
    thumb_image = ImageStore(
        file_name=f"{base_name}_thumb.jpg",
        content_type="image/jpeg",
        file_data=thumb_bytes
    )
    db.add(thumb_image)
    
    db.commit()
    db.refresh(orig_image)
    db.refresh(thumb_image)
    
    return f"/api/images/{orig_image.id}", f"/api/images/{thumb_image.id}"

def delete_photo(db: Session, file_path: str):
    delete_image_from_db(db, file_path)

# Stats Services
def get_stats(db: Session):
    stats = db.query(models.MharnesStats).first()
    if not stats:
        # Initialize stats if they don't exist
        stats = models.MharnesStats(energy_generated=0.0, trees_planted=0, visitors=0, stored_water=0.0)
        db.add(stats)
        db.commit()
        db.refresh(stats)
    return stats

def update_stats(db: Session, stats_data: dict):
    db_stats = get_stats(db)
    for key, value in stats_data.items():
        if value is not None:
            setattr(db_stats, key, value)
    db.commit()
    db.refresh(db_stats)
    return db_stats

# Comments Services
def get_comments(db: Session, only_verified: bool = True):
    query = db.query(models.MharnesComment)
    if only_verified:
        query = query.filter(models.MharnesComment.is_verified == True)
    return query.order_by(models.MharnesComment.created_at.desc()).all()

from services.contact_service import send_email, CONTACT_RECEIVER

def create_comment(db: Session, author_name: str, content: str, institution: str = None, rating: int = 5, photo_files: List[UploadFile] = None):
    db_comment = models.MharnesComment(
        author_name=author_name, 
        institution=institution,
        content=content, 
        rating=rating, 
        is_verified=False
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    
    if photo_files:
        for photo_file in photo_files:
            # Skip if photo_file is None or has no filename (empty upload)
            if photo_file is None or not getattr(photo_file, 'filename', None):
                continue
            
            orig_url, thumb_url = save_comment_photo(db, photo_file, db_comment.id)
            db_photo = models.MharnesCommentPhoto(
                comment_id=db_comment.id,
                photo_url=orig_url,
                thumb_url=thumb_url
            )
            db.add(db_photo)
        db.commit()
        db.refresh(db_comment)

    # Notificar por mail
    try:
        subject = f"Nuevo comentario para moderar: {author_name}"
        if institution:
            subject = f"Nuevo comentario: {author_name} ({institution})"
            
        body = f"""
        Has recibido un nuevo comentario en Mharnes que requiere moderación.
        
        Autor: {author_name}
        Institución: {institution or 'No proporcionada'}
        Calificación: {rating} estrellas
        
        Comentario:
        {content}
        
        Podés moderar este comentario desde el panel de administración.
        """
        send_email(CONTACT_RECEIVER, subject, body)
    except Exception as e:
        print(f"Error enviando notificación de comentario: {e}")
    
    return db_comment

def update_comment(db: Session, comment_id: int, is_verified: Optional[bool] = None):
    db_comment = db.query(models.MharnesComment).filter(models.MharnesComment.id == comment_id).first()
    if not db_comment:
        return None
    if is_verified is not None:
        db_comment.is_verified = is_verified
    db.commit()
    db.refresh(db_comment)
    return db_comment

def delete_comment(db: Session, comment_id: int):
    db_comment = db.query(models.MharnesComment).filter(models.MharnesComment.id == comment_id).first()
    if not db_comment:
        return False
    
    # Delete all associated photos from disk/db
    for photo in db_comment.photos:
        delete_photo(db, photo.photo_url)
        delete_photo(db, photo.thumb_url)
    
    db.delete(db_comment)
    db.commit()
    return True

def delete_comment_photo_by_id(db: Session, photo_id: int):
    db_photo = db.query(models.MharnesCommentPhoto).filter(models.MharnesCommentPhoto.id == photo_id).first()
    if not db_photo:
        return False
    
    delete_photo(db, db_photo.photo_url)
    delete_photo(db, db_photo.thumb_url)
    db.delete(db_photo)
    db.commit()
    return True
