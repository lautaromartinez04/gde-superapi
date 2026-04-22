from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import schemas
from database import get_db
from services import contact_service
from middlewares.api_key_auth import verify_api_key
from middlewares.jwt_bearer import JWTBearer

auth_jwt = JWTBearer()

router = APIRouter(
    prefix="/contact",
    tags=["General: Contact"]
)

@router.post("/", response_model=schemas.ContactMessage, dependencies=[Depends(auth_jwt)])
def create_contact(message: schemas.ContactMessageCreate, db: Session = Depends(get_db)):
    return contact_service.create_contact_message(db, message.model_dump())

@router.get("/", response_model=List[schemas.ContactMessage], dependencies=[Depends(verify_api_key)])
def read_contacts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return contact_service.get_contact_messages(db, skip=skip, limit=limit)

@router.patch("/{id}", response_model=schemas.ContactMessage, dependencies=[Depends(auth_jwt)])
def update_contact(id: int, message_update: schemas.ContactMessageUpdate, db: Session = Depends(get_db)):
    updated = contact_service.update_contact_message(db, id, message_update.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Message not found")
    return updated

@router.delete("/{id}", dependencies=[Depends(auth_jwt)])
def delete_contact(id: int, db: Session = Depends(get_db)):
    success = contact_service.delete_contact_message(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"status": "success", "id": id}
