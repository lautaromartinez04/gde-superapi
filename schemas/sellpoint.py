from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class SellerBase(BaseModel):
    name: str
    address: Optional[str] = None
    maps_url: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    start_date: Optional[date] = None
    display_order: Optional[int] = 0
    city_id: int

class SellerCreate(SellerBase):
    pass

class Seller(SellerBase):
    id: int

    class Config:
        from_attributes = True

class CityBase(BaseModel):
    name: str

class CityCreate(CityBase):
    pass

class City(CityBase):
    id: int
    sellers: List[Seller] = []

    class Config:
        from_attributes = True
