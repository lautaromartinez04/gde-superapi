from sqlalchemy.orm import Session
import models
import schemas

import os
import shutil
from fastapi import UploadFile

UPLOAD_DIR = "uploads/categorias"

def save_upload_file(upload_file: UploadFile, custom_name: str) -> str:
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)
    
    # Extract extension
    _, ext = os.path.splitext(upload_file.filename)
    file_name = f"{custom_name}{ext}"
    
    file_path = os.path.join(UPLOAD_DIR, file_name)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    return f"/api/{file_path.replace('\\\\', '/')}"

def delete_old_file(file_path: str):
    if not file_path:
        return
    # Remove /api/ prefix
    relative_path = file_path.replace("/api/", "")
    if os.path.exists(relative_path):
        try:
            os.remove(relative_path)
        except Exception as e:
            print(f"Error deleting file {relative_path}: {e}")

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
        category_data["logo"] = save_upload_file(logo_file, f"cat-{cat_id}-logo")
    
    if color_vaquitas_file and cat_id:
        category_data["color_vaquitas"] = save_upload_file(color_vaquitas_file, f"cat-{cat_id}-vaca")
    
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
                delete_old_file(getattr(db_category, key))
                setattr(db_category, key, None)
            else:
                setattr(db_category, key, value)
            
    if logo_file:
        # Save will overwrite if filename is same, but we delete to be sure of cleanup
        delete_old_file(db_category.logo)
        db_category.logo = save_upload_file(logo_file, f"cat-{category_id}-logo")
    
    if color_vaquitas_file:
        delete_old_file(db_category.color_vaquitas)
        db_category.color_vaquitas = save_upload_file(color_vaquitas_file, f"cat-{category_id}-vaca")
        
    db.commit()
    db.refresh(db_category)
    return db_category

def delete_category(db: Session, category_id: int):
    db_category = get_category(db, category_id)
    if not db_category:
        return False
    
    # Delete associated files
    delete_old_file(db_category.logo)
    delete_old_file(db_category.color_vaquitas)
    
    db.delete(db_category)
    db.commit()
    return True
