"""
Migration: Add start_date and display_order columns to wda.sellers table
Run once: python migrations/add_fields_to_sellers.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    try:
        conn.execute(text("""
            ALTER TABLE wda.sellers
            ADD start_date DATE NULL,
                display_order INT DEFAULT 0 NULL
        """))
        conn.commit()
        print("✅ Columnas 'start_date' y 'display_order' agregadas correctamente a wda.sellers")
    except Exception as e:
        if "already an object" in str(e) or "Column names in each table must be unique" in str(e):
            print("ℹ️  Las columnas ya existen — no se requiere migración.")
        else:
            print(f"❌ Error: {e}")
