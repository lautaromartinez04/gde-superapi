from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MharnesStatsBase(BaseModel):
    energy_generated: float = 0.0
    trees_planted: int = 0
    visitors: int = 0
    stored_water: float = 0.0

class MharnesStatsCreate(MharnesStatsBase):
    pass

class MharnesStatsUpdate(BaseModel):
    energy_generated: Optional[float] = None
    trees_planted: Optional[int] = None
    visitors: Optional[int] = None
    stored_water: Optional[float] = None

class MharnesStats(MharnesStatsBase):
    id: int
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class MharnesCommentPhotoBase(BaseModel):
    photo_url: str
    thumb_url: Optional[str] = None

class MharnesCommentPhoto(MharnesCommentPhotoBase):
    id: int
    comment_id: int

    class Config:
        from_attributes = True

class MharnesCommentBase(BaseModel):
    author_name: str
    institution: Optional[str] = None
    content: str
    rating: int = 5

class MharnesCommentCreate(MharnesCommentBase):
    pass

class MharnesCommentUpdate(BaseModel):
    is_verified: Optional[bool] = None

class MharnesComment(MharnesCommentBase):
    id: int
    is_verified: bool
    created_at: datetime
    photos: List[MharnesCommentPhoto] = []

    class Config:
        from_attributes = True
