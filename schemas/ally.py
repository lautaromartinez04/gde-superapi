from pydantic import BaseModel
from typing import Optional

class AllyBase(BaseModel):
    name: str
    brands: str
    website_url: Optional[str] = None

class AllyCreate(AllyBase):
    pass

class Ally(AllyBase):
    id: int
    image_url: Optional[str] = None

    class Config:
        from_attributes = True
