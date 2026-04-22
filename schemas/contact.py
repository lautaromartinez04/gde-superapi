from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class ContactMessageBase(BaseModel):
    name: str
    lastName: Optional[str] = None
    email: str # Using str instead of EmailStr to avoid extra dependency if not present, but can be changed
    phone: Optional[str] = None
    message: str
    service: str # 'DonEmilio', 'DuyAmis', 'Mharnes'

class ContactMessageCreate(ContactMessageBase):
    pass

class ContactMessageUpdate(BaseModel):
    is_read: Optional[bool] = None
    notes: Optional[str] = None

class ContactMessage(ContactMessageBase):
    id: int
    is_read: bool = False
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
