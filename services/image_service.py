import os
from sqlalchemy.orm import Session
from fastapi import UploadFile
from models.image_store import ImageStore

def save_upload_to_db(db: Session, upload_file: UploadFile, custom_name: str) -> str:
    """
    Lee un archivo subido, lo guarda en la tabla ImageStore como binario
    y retorna la URL para acceder a él (/api/images/{id}).
    """
    file_data = upload_file.file.read()
    _, ext = os.path.splitext(upload_file.filename)
    file_name = f"{custom_name}{ext}"
    
    db_image = ImageStore(
        file_name=file_name,
        content_type=upload_file.content_type or "application/octet-stream",
        file_data=file_data
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    
    return f"/api/images/{db_image.id}"

def delete_image_from_db(db: Session, file_path: str):
    """
    Recibe la ruta guardada (ej. /api/images/25) e intenta eliminarla de ImageStore.
    Si la ruta es de uploads antiguo, intenta borrarla físicamente.
    """
    if not file_path:
        return
    
    if file_path.startswith("/api/images/"):
        # Extraer el ID
        try:
            image_id = int(file_path.split("/")[-1])
            db_image = db.query(ImageStore).filter(ImageStore.id == image_id).first()
            if db_image:
                db.delete(db_image)
                db.commit()
        except ValueError:
            pass
    elif "/api/uploads/" in file_path or "uploads/" in file_path:
        # Lógica de eliminación antigua por si quedan rutas físicas viejas
        relative_path = file_path.replace("/api/", "")
        if os.path.exists(relative_path):
            try:
                os.remove(relative_path)
            except Exception as e:
                print(f"Error deleting old file {relative_path}: {e}")
