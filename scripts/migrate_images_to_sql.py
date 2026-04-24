import sys
import os
import mimetypes

# Add the api folder to sys.path so we can import from models, database, etc.
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal, engine
import models
from models.category import Category
from models.product import Product
from models.ally import Ally
from models.mharnes import MharnesCommentPhoto
from models.image_store import ImageStore

# Ensure tables are created (specifically ImageStore)
models.Base.metadata.create_all(bind=engine)

def get_mime_type(file_path):
    mime, _ = mimetypes.guess_type(file_path)
    return mime or "application/octet-stream"

def migrate_file(db, model_instance, field_name):
    file_path = getattr(model_instance, field_name)
    if not file_path:
        return False
        
    # Check if it looks like an old upload path
    if "uploads/" not in file_path and "/api/uploads/" not in file_path:
        return False
        
    # Get physical relative path
    relative_path = file_path.replace("/api/", "").replace("/", os.sep)
    
    if not os.path.exists(relative_path):
        print(f"Warning: File not found on disk: {relative_path}")
        return False
        
    print(f"Migrating {relative_path}...")
    try:
        with open(relative_path, "rb") as f:
            file_data = f.read()
            
        file_name = os.path.basename(relative_path)
        content_type = get_mime_type(relative_path)
        
        image = ImageStore(
            file_name=file_name,
            content_type=content_type,
            file_data=file_data
        )
        db.add(image)
        db.flush() # Flush to get the ID without committing the whole transaction yet
        
        new_url = f"/api/images/{image.id}"
        setattr(model_instance, field_name, new_url)
        return True
    except Exception as e:
        print(f"Error migrating {relative_path}: {e}")
        return False

def main():
    db = SessionLocal()
    print("Starting migration of images from disk to SQL...")
    
    migrated_count = 0
    
    try:
        # Migrate Categories
        categories = db.query(Category).all()
        for cat in categories:
            if migrate_file(db, cat, "logo"): migrated_count += 1
            if migrate_file(db, cat, "color_vaquitas"): migrated_count += 1
            
        # Migrate Products
        products = db.query(Product).all()
        for prod in products:
            if migrate_file(db, prod, "logo"): migrated_count += 1
            if migrate_file(db, prod, "image"): migrated_count += 1
            if migrate_file(db, prod, "color_vaquitas"): migrated_count += 1
            
        # Migrate Allies
        allies = db.query(Ally).all()
        for ally in allies:
            if migrate_file(db, ally, "image_url"): migrated_count += 1
            
        # Migrate Mharnes Comment Photos
        photos = db.query(MharnesCommentPhoto).all()
        for photo in photos:
            if migrate_file(db, photo, "photo_url"): migrated_count += 1
            if migrate_file(db, photo, "thumb_url"): migrated_count += 1
            
        print(f"Migration completed successfully. {migrated_count} files migrated.")
        db.commit()
        print("Database transaction committed.")
        
    except Exception as e:
        db.rollback()
        print(f"Migration failed and rolled back. Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    main()
