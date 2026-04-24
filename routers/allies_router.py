from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
import time

from database import get_db
import models.ally as models
import schemas.ally as schemas
from middlewares.api_key_auth import verify_api_key
from middlewares.jwt_bearer import JWTBearer

auth_jwt = JWTBearer()

router = APIRouter(
    prefix="/allies",
    tags=["Corporate Allies"]
)

from services.image_service import save_upload_to_db, delete_image_from_db

# UPLOAD_DIR = "uploads/allies" - Obsoleto

def save_upload(db: Session, upload_file: UploadFile, custom_name: str) -> str:
    return save_upload_to_db(db, upload_file, custom_name)

def delete_upload(db: Session, file_path: str):
    delete_image_from_db(db, file_path)

@router.get("", response_model=List[schemas.Ally], dependencies=[Depends(verify_api_key)])
def get_allies(brand: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Ally)
    if brand:
        # Simple LIKE query for SQLite comma separated values
        query = query.filter(models.Ally.brands.like(f"%{brand}%"))
    return query.all()

@router.post("", response_model=schemas.Ally, dependencies=[Depends(auth_jwt)])
def create_ally(
    name: str = Form(...),
    brands: str = Form(...),
    website_url: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    db_ally = models.Ally(name=name, brands=brands, website_url=website_url)
    db.add(db_ally)
    db.commit()
    db.refresh(db_ally)
    
    if image:
        db_ally.image_url = save_upload(db, image, f"ally_{db_ally.id}")
        db.commit()
        db.refresh(db_ally)
        
    return db_ally

@router.put("/{ally_id}", response_model=schemas.Ally, dependencies=[Depends(auth_jwt)])
def update_ally(
    ally_id: int,
    name: Optional[str] = Form(None),
    brands: Optional[str] = Form(None),
    website_url: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    db_ally = db.query(models.Ally).filter(models.Ally.id == ally_id).first()
    if not db_ally:
        raise HTTPException(status_code=404, detail="Ally not found")
        
    if name is not None:
        db_ally.name = name
    if brands is not None:
        db_ally.brands = brands
    # Allow clearing website_url by passing empty string
    db_ally.website_url = website_url if website_url else None
        
    if image:
        delete_upload(db, db_ally.image_url)
        db_ally.image_url = save_upload(db, image, f"ally_{db_ally.id}")
        
    db.commit()
    db.refresh(db_ally)
    return db_ally

@router.delete("/{ally_id}", dependencies=[Depends(auth_jwt)])
def delete_ally(ally_id: int, db: Session = Depends(get_db)):
    db_ally = db.query(models.Ally).filter(models.Ally.id == ally_id).first()
    if not db_ally:
        raise HTTPException(status_code=404, detail="Ally not found")
        
    delete_upload(db, db_ally.image_url)
    db.delete(db_ally)
    db.commit()
    return {"message": "Ally deleted"}
