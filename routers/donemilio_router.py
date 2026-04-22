from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import schemas
from database import get_db
from models.donemilio import Branch, BranchSchedule
from middlewares.api_key_auth import verify_api_key
from middlewares.jwt_bearer import JWTBearer

auth_jwt = JWTBearer()

router = APIRouter(
    prefix="/donemilio",
    tags=["Don Emilio: Branches"]
)


# --- BRANCHES ---

@router.get("/branches", response_model=List[schemas.Branch], dependencies=[Depends(verify_api_key)])
def get_branches(db: Session = Depends(get_db)):
    return db.query(Branch).order_by(Branch.order).all()


@router.post("/branches", response_model=schemas.Branch, dependencies=[Depends(auth_jwt)])
def create_branch(branch: schemas.BranchCreate, db: Session = Depends(get_db)):
    db_branch = Branch(**branch.model_dump())
    db.add(db_branch)
    db.commit()
    db.refresh(db_branch)
    return db_branch


@router.put("/branches/{branch_id}", response_model=schemas.Branch, dependencies=[Depends(auth_jwt)])
def update_branch(branch_id: int, branch: schemas.BranchUpdate, db: Session = Depends(get_db)):
    db_branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not db_branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    update_data = branch.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_branch, key, value)
    db.commit()
    db.refresh(db_branch)
    return db_branch


@router.delete("/branches/{branch_id}", dependencies=[Depends(auth_jwt)])
def delete_branch(branch_id: int, db: Session = Depends(get_db)):
    db_branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not db_branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    db.delete(db_branch)
    db.commit()
    return {"status": "success", "id": branch_id}


# --- BRANCH SCHEDULES ---

@router.post("/branches/{branch_id}/schedules", response_model=schemas.BranchSchedule, dependencies=[Depends(auth_jwt)])
def create_schedule(branch_id: int, schedule: schemas.BranchScheduleCreate, db: Session = Depends(get_db)):
    db_branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not db_branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    db_schedule = BranchSchedule(**schedule.model_dump(), branch_id=branch_id)
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule


@router.put("/schedules/{schedule_id}", response_model=schemas.BranchSchedule, dependencies=[Depends(auth_jwt)])
def update_schedule(schedule_id: int, schedule: schemas.BranchScheduleUpdate, db: Session = Depends(get_db)):
    db_schedule = db.query(BranchSchedule).filter(BranchSchedule.id == schedule_id).first()
    if not db_schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    update_data = schedule.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_schedule, key, value)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule


@router.delete("/schedules/{schedule_id}", dependencies=[Depends(auth_jwt)])
def delete_schedule(schedule_id: int, db: Session = Depends(get_db)):
    db_schedule = db.query(BranchSchedule).filter(BranchSchedule.id == schedule_id).first()
    if not db_schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    db.delete(db_schedule)
    db.commit()
    return {"status": "success", "id": schedule_id}
