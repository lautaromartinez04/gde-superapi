"""
Migration: Add thumb_url column to wmh.comment_photos table
Run once: python migrations/add_thumb_url_to_comment_photos.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    try:
        conn.execute(text("""
            ALTER TABLE wmh.comment_photos
            ADD thumb_url NVARCHAR(500) NULL
        """))
        conn.commit()
        print("✅ Columna 'thumb_url' agregada correctamente a wmh.comment_photos")
    except Exception as e:
        if "already an object" in str(e) or "Column names in each table must be unique" in str(e):
            print("ℹ️  La columna 'thumb_url' ya existe.")
        else:
            print(f"❌ Error: {e}")
