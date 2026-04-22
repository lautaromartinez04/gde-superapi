from sqlalchemy.orm import Session
import models
import schemas

import os
import shutil
from fastapi import UploadFile

UPLOAD_DIR = "uploads/products"

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

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).order_by(models.Product.id).offset(skip).limit(limit).all()

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def create_product(
    db: Session, 
    product_data: dict, 
    logo_file: UploadFile = None, 
    image_file: UploadFile = None, 
    color_vaquitas_file: UploadFile = None
):
    # Initial creation to get product ID
    db_product = models.Product(**product_data)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    save_needed = False
    cat_id = db_product.category_id
    prod_id = db_product.id
    
    if logo_file:
        db_product.logo = save_upload_file(logo_file, f"cat-{cat_id}-prod-{prod_id}-logo")
        save_needed = True
    
    if image_file:
        db_product.image = save_upload_file(image_file, f"cat-{cat_id}-prod-{prod_id}")
        save_needed = True
    
    if color_vaquitas_file:
        db_product.color_vaquitas = save_upload_file(color_vaquitas_file, f"cat-{cat_id}-prod-{prod_id}-vaca")
        save_needed = True

    if save_needed:
        db.commit()
        db.refresh(db_product)
        
    return db_product

def update_product(
    db: Session, 
    product_id: int, 
    product_data: dict, 
    logo_file: UploadFile = None, 
    image_file: UploadFile = None, 
    color_vaquitas_file: UploadFile = None
):
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    
    for key, value in product_data.items():
        if value is not None:
            # Explicit clear signal
            if value in ["", "null", "NULL"] and key in ["logo", "color_vaquitas", "image"]:
                delete_old_file(getattr(db_product, key))
                setattr(db_product, key, None)
            else:
                setattr(db_product, key, value)
            
    cat_id = db_product.category_id
    
    if logo_file:
        delete_old_file(db_product.logo)
        db_product.logo = save_upload_file(logo_file, f"cat-{cat_id}-prod-{product_id}-logo")
    
    if image_file:
        delete_old_file(db_product.image)
        db_product.image = save_upload_file(image_file, f"cat-{cat_id}-prod-{product_id}")
    
    if color_vaquitas_file:
        delete_old_file(db_product.color_vaquitas)
        db_product.color_vaquitas = save_upload_file(color_vaquitas_file, f"cat-{cat_id}-prod-{product_id}-vaca")
        
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = get_product(db, product_id)
    if not db_product:
        return False
    
    # Delete associated files
    delete_old_file(db_product.logo)
    delete_old_file(db_product.image)
    delete_old_file(db_product.color_vaquitas)
    
    db.delete(db_product)
    db.commit()
    return True

def get_products_by_category(db: Session, category_id: int):
    return db.query(models.Product).filter(models.Product.category_id == category_id).all()
