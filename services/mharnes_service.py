from sqlalchemy.orm import Session
import models
import schemas
import os
import shutil
from fastapi import UploadFile
from typing import List, Optional
from PIL import Image
import io

UPLOAD_DIR_COMMENTS = "uploads/mharnes/comments"

import uuid

THUMB_SIZE = 300  # max px on longest side

def save_comment_photo(upload_file: UploadFile, comment_id: int) -> tuple:
    """Save original + generate 300px thumbnail. Returns (original_url, thumb_url)."""
    if not os.path.exists(UPLOAD_DIR_COMMENTS):
        os.makedirs(UPLOAD_DIR_COMMENTS)
    
    _, ext = os.path.splitext(upload_file.filename)
    uid = uuid.uuid4().hex[:8]
    base_name = f"comment-{comment_id}-{uid}"
    orig_name = f"{base_name}{ext}"
    thumb_name = f"{base_name}_thumb.jpg"

    orig_path = os.path.join(UPLOAD_DIR_COMMENTS, orig_name)
    thumb_path = os.path.join(UPLOAD_DIR_COMMENTS, thumb_name)

    # Read bytes once
    file_bytes = upload_file.file.read()

    # Save original
    with open(orig_path, "wb") as f:
        f.write(file_bytes)

    # Generate thumbnail
    try:
        img = Image.open(io.BytesIO(file_bytes))
        img = img.convert("RGB")
        img.thumbnail((THUMB_SIZE, THUMB_SIZE), Image.LANCZOS)
        img.save(thumb_path, "JPEG", quality=80, optimize=True)
    except Exception as e:
        print(f"Warning: could not generate thumbnail for {orig_name}: {e}")
        shutil.copy(orig_path, thumb_path)

    orig_url = f"/api/{orig_path.replace(chr(92), '/')}"
    thumb_url = f"/api/{thumb_path.replace(chr(92), '/')}"
    return orig_url, thumb_url

def delete_photo(file_path: str):
    if not file_path:
        return
    # Standardize path for comparison
    relative_path = file_path.replace("/api/", "").replace("/", os.sep)
    if os.path.exists(relative_path):
        try:
            os.remove(relative_path)
        except Exception as e:
            print(f"Error deleting photo {relative_path}: {e}")

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
            
            orig_url, thumb_url = save_comment_photo(photo_file, db_comment.id)
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
    
    # Delete all associated photos from disk
    for photo in db_comment.photos:
        delete_photo(photo.photo_url)
    
    db.delete(db_comment)
    db.commit()
    return True

def delete_comment_photo_by_id(db: Session, photo_id: int):
    db_photo = db.query(models.MharnesCommentPhoto).filter(models.MharnesCommentPhoto.id == photo_id).first()
    if not db_photo:
        return False
    
    delete_photo(db_photo.photo_url)
    db.delete(db_photo)
    db.commit()
    return True
