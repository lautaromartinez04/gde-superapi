from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import schemas
from database import get_db
from services import mharnes_service
from middlewares.api_key_auth import verify_api_key
from middlewares.jwt_bearer import JWTBearer

auth_jwt = JWTBearer()

router = APIRouter(
    prefix="/mharnes",
    tags=["Mharnes: Stats & Comments"]
)

# Stats Endpoints
@router.get("/stats", response_model=schemas.MharnesStats, dependencies=[Depends(verify_api_key)])
def read_stats(db: Session = Depends(get_db)):
    return mharnes_service.get_stats(db)

@router.put("/stats", response_model=schemas.MharnesStats, dependencies=[Depends(auth_jwt)])
def update_stats(stats_update: schemas.MharnesStatsUpdate, db: Session = Depends(get_db)):
    return mharnes_service.update_stats(db, stats_update.model_dump(exclude_unset=True))

# Comments Endpoints (Public)
@router.get("/comments", response_model=List[schemas.MharnesComment], dependencies=[Depends(verify_api_key)])
def read_verified_comments(db: Session = Depends(get_db)):
    return mharnes_service.get_comments(db, only_verified=True)

@router.post("/comments", response_model=schemas.MharnesComment, dependencies=[Depends(auth_jwt)])
def create_comment(
    author_name: str = Form(...),
    institution: Optional[str] = Form(None),
    content: str = Form(...),
    rating: int = Form(5),
    photo_files: List[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    return mharnes_service.create_comment(
        db, 
        author_name=author_name, 
        institution=institution,
        content=content, 
        rating=rating, 
        photo_files=photo_files
    )

# Comments Endpoints (Admin)
@router.get("/comments/admin", response_model=List[schemas.MharnesComment], dependencies=[Depends(verify_api_key)])
def read_all_comments(db: Session = Depends(get_db)):
    return mharnes_service.get_comments(db, only_verified=False)

@router.put("/comments/{comment_id}/verify", response_model=schemas.MharnesComment, dependencies=[Depends(auth_jwt)])
def verify_comment(comment_id: int, is_verified: bool = Form(...), db: Session = Depends(get_db)):
    db_comment = mharnes_service.update_comment(db, comment_id, is_verified=is_verified)
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    return db_comment

@router.delete("/comments/{comment_id}", dependencies=[Depends(auth_jwt)])
def delete_comment(comment_id: int, db: Session = Depends(get_db)):
    if not mharnes_service.delete_comment(db, comment_id):
        raise HTTPException(status_code=404, detail="Comment not found")
    return {"message": "Comment deleted successfully"}

@router.delete("/comments/photos/{photo_id}", dependencies=[Depends(auth_jwt)])
def delete_comment_photo(photo_id: int, db: Session = Depends(get_db)):
    if not mharnes_service.delete_comment_photo_by_id(db, photo_id):
        raise HTTPException(status_code=404, detail="Photo not found")
    return {"message": "Photo deleted successfully"}
