from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Text, ForeignKey, func
from database import Base

class MharnesStats(Base):
    __tablename__ = "stats"
    __table_args__ = {"schema": "wmh"}

    id = Column(Integer, primary_key=True, index=True)
    energy_generated = Column(Float, default=0.0)
    trees_planted = Column(Integer, default=0)
    visitors = Column(Integer, default=0)
    stored_water = Column(Float, default=0.0)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class MharnesComment(Base):
    __tablename__ = "comments"
    __table_args__ = {"schema": "wmh"}

    id = Column(Integer, primary_key=True, index=True)
    author_name = Column(String(255), nullable=False)
    institution = Column(String(255), nullable=True)
    content = Column(Text, nullable=False)
    rating = Column(Integer, nullable=False, default=5)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship to photos
    photos = relationship("MharnesCommentPhoto", back_populates="comment", cascade="all, delete-orphan")

class MharnesCommentPhoto(Base):
    __tablename__ = "comment_photos"
    __table_args__ = {"schema": "wmh"}

    id = Column(Integer, primary_key=True, index=True)
    comment_id = Column(Integer, ForeignKey("wmh.comments.id"), nullable=False)
    photo_url = Column(String(500), nullable=False)
    thumb_url = Column(String(500), nullable=True)
    
    # Relationship to comment
    comment = relationship("MharnesComment", back_populates="photos")
