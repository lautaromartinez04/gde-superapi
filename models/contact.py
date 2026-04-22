from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.sql import func
from database import Base

class ContactMessage(Base):
    __tablename__ = "contact_messages"
    __table_args__ = {"schema": "wmh"}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    lastName = Column(String(100), nullable=True)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    message = Column(Text, nullable=False)
    service = Column(String(50), nullable=False) # 'DonEmilio', 'DuyAmis', 'Mharnes'
    is_read = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
