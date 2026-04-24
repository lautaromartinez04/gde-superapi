import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import engine
from sqlalchemy import text

def main():
    print("Moviendo la tabla image_store al esquema wde y renombrandola a images_storage...")
    try:
        with engine.begin() as conn:
            # Transfer the table from dbo to wde
            conn.execute(text("ALTER SCHEMA wde TRANSFER dbo.image_store"))
            # Rename the table
            conn.execute(text("EXEC sp_rename 'wde.image_store', 'images_storage'"))
            
        print("Tabla movida y renombrada con éxito.")
    except Exception as e:
        print(f"Error al mover/renombrar la tabla: {e}")
        print("Puede que ya haya sido renombrada o no exista.")

if __name__ == "__main__":
    main()
