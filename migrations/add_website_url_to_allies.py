"""
Migration: Add website_url column to wde.allies table
Run once: python migrations/add_website_url_to_allies.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    try:
        conn.execute(text("""
            ALTER TABLE wde.allies
            ADD website_url NVARCHAR(500) NULL
        """))
        conn.commit()
        print("✅ Columna 'website_url' agregada correctamente a wde.allies")
    except Exception as e:
        if "already an object" in str(e) or "Column names in each table must be unique" in str(e):
            print("ℹ️  La columna 'website_url' ya existe — no se requiere migración.")
        else:
            print(f"❌ Error: {e}")
