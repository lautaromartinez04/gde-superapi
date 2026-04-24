from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from database import get_db
from models.image_store import ImageStore

router = APIRouter(
    prefix="/images",
    tags=["Images"]
)

@router.get("/{image_id}")
def get_image(image_id: int, db: Session = Depends(get_db)):
    """
    Sirve una imagen binaria desde la base de datos SQL.
    """
    db_image = db.query(ImageStore).filter(ImageStore.id == image_id).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Image not found")
        
    return Response(content=db_image.file_data, media_type=db_image.content_type)
