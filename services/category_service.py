from sqlalchemy.orm import Session
import models
import schemas

import os
import shutil
from fastapi import UploadFile

from services.image_service import save_upload_to_db, delete_image_from_db

# UPLOAD_DIR = "uploads/categorias" - Obsoleto

def save_upload_file(db: Session, upload_file: UploadFile, custom_name: str) -> str:
    return save_upload_to_db(db, upload_file, custom_name)

def delete_old_file(db: Session, file_path: str):
    delete_image_from_db(db, file_path)


def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Category).order_by(models.Category.id).offset(skip).limit(limit).all()

def get_category(db: Session, category_id: int):
    return db.query(models.Category).filter(models.Category.id == category_id).first()

def create_category(
    db: Session, 
    category_data: dict, 
    logo_file: UploadFile = None, 
    color_vaquitas_file: UploadFile = None
):
    cat_id = category_data.get("id")
    if logo_file and cat_id:
        category_data["logo"] = save_upload_file(db, logo_file, f"cat-{cat_id}-logo")
    
    if color_vaquitas_file and cat_id:
        category_data["color_vaquitas"] = save_upload_file(db, color_vaquitas_file, f"cat-{cat_id}-vaca")
    
    db_category = models.Category(**category_data)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def update_category(
    db: Session, 
    category_id: int, 
    category_data: dict, 
    logo_file: UploadFile = None, 
    color_vaquitas_file: UploadFile = None
):
    db_category = get_category(db, category_id)
    if not db_category:
        return None
    
    for key, value in category_data.items():
        if value is not None:
            # Explicit clear signal
            if value in ["", "null", "NULL"] and key in ["logo", "color_vaquitas"]:
                delete_old_file(db, getattr(db_category, key))
                setattr(db_category, key, None)
            else:
                setattr(db_category, key, value)
            
    if logo_file:
        # Save will overwrite if filename is same, but we delete to be sure of cleanup
        delete_old_file(db, db_category.logo)
        db_category.logo = save_upload_file(db, logo_file, f"cat-{category_id}-logo")
    
    if color_vaquitas_file:
        delete_old_file(db, db_category.color_vaquitas)
        db_category.color_vaquitas = save_upload_file(db, color_vaquitas_file, f"cat-{category_id}-vaca")
        
    db.commit()
    db.refresh(db_category)
    return db_category

def delete_category(db: Session, category_id: int):
    db_category = get_category(db, category_id)
    if not db_category:
        return False
    
    # Delete associated files
    delete_old_file(db, db_category.logo)
    delete_old_file(db, db_category.color_vaquitas)
    
    db.delete(db_category)
    db.commit()
    return True
