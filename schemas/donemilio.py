from pydantic import BaseModel
from typing import List, Optional


class BranchScheduleBase(BaseModel):
    days: str
    hours: str
    order: Optional[int] = 0


class BranchScheduleCreate(BranchScheduleBase):
    pass


class BranchScheduleUpdate(BaseModel):
    days: Optional[str] = None
    hours: Optional[str] = None
    order: Optional[int] = None


class BranchSchedule(BranchScheduleBase):
    id: int
    branch_id: int

    class Config:
        from_attributes = True


class BranchBase(BaseModel):
    name: str
    address: Optional[str] = None
    maps_url: Optional[str] = None
    maps_embed_url: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    order: Optional[int] = 0


class BranchCreate(BranchBase):
    pass


class BranchUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    maps_url: Optional[str] = None
    maps_embed_url: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    order: Optional[int] = None


class Branch(BranchBase):
    id: int
    schedules: List[BranchSchedule] = []

    class Config:
        from_attributes = True
