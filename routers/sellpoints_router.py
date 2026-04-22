from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.sellpoint import City, Seller
from schemas.sellpoint import City as CitySchema, CityCreate, Seller as SellerSchema, SellerCreate
from middlewares.api_key_auth import verify_api_key
from middlewares.jwt_bearer import JWTBearer

auth_jwt = JWTBearer()

router = APIRouter(prefix="/sellpoints", tags=["Sellpoints"])

# City Endpoints
@router.post("/cities", response_model=CitySchema, dependencies=[Depends(auth_jwt)])
def create_city(city: CityCreate, db: Session = Depends(get_db)):
    db_city = City(name=city.name)
    db.add(db_city)
    db.commit()
    db.refresh(db_city)
    return db_city

@router.get("/cities", response_model=List[CitySchema], dependencies=[Depends(verify_api_key)])
def read_cities(db: Session = Depends(get_db)):
    return db.query(City).all()

@router.delete("/cities/{city_id}", dependencies=[Depends(auth_jwt)])
def delete_city(city_id: int, db: Session = Depends(get_db)):
    db_city = db.query(City).filter(City.id == city_id).first()
    if not db_city:
        raise HTTPException(status_code=404, detail="City not found")
    db.delete(db_city)
    db.commit()
    return {"message": "City deleted"}

# Seller Endpoints
@router.post("/sellers", response_model=SellerSchema, dependencies=[Depends(auth_jwt)])
def create_seller(seller: SellerCreate, db: Session = Depends(get_db)):
    db_seller = Seller(**seller.dict())
    db.add(db_seller)
    db.commit()
    db.refresh(db_seller)
    return db_seller

@router.get("/sellers", response_model=List[SellerSchema], dependencies=[Depends(verify_api_key)])
def read_sellers(db: Session = Depends(get_db)):
    return db.query(Seller).all()

@router.put("/sellers/{seller_id}", response_model=SellerSchema, dependencies=[Depends(auth_jwt)])
def update_seller(seller_id: int, seller: SellerCreate, db: Session = Depends(get_db)):
    db_seller = db.query(Seller).filter(Seller.id == seller_id).first()
    if not db_seller:
        raise HTTPException(status_code=404, detail="Seller not found")
    for key, value in seller.dict().items():
        setattr(db_seller, key, value)
    db.commit()
    db.refresh(db_seller)
    return db_seller

@router.delete("/sellers/{seller_id}", dependencies=[Depends(auth_jwt)])
def delete_seller(seller_id: int, db: Session = Depends(get_db)):
    db_seller = db.query(Seller).filter(Seller.id == seller_id).first()
    if not db_seller:
        raise HTTPException(status_code=404, detail="Seller not found")
    db.delete(db_seller)
    db.commit()
    return {"message": "Seller deleted"}
