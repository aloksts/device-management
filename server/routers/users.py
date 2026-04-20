from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, Device
from schemas import UserOut, UserCreate, LoginData
from typing import List

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    result = []
    for u in users:
        count = db.query(Device).filter(Device.current_owner_id == u.id).count()
        result.append(UserOut(
            id=u.id, name=u.name, email=u.email,
            department=u.department, role=u.role, device_count=count
        ))
    return result


@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    count = db.query(Device).filter(Device.current_owner_id == user.id).count()
    return UserOut(
        id=user.id, name=user.name, email=user.email,
        department=user.department, role=user.role, device_count=count
    )


@router.post("", response_model=UserOut, status_code=201)
def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
    user = User(**user_in.model_dump())
    db.add(user)
    db.commit()
    db.refresh(user)
    return UserOut(
        id=user.id, name=user.name, email=user.email,
        department=user.department, role=user.role, device_count=0
    )

@router.post("/login", response_model=UserOut)
def login(data: LoginData, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email, User.password == data.password).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    count = db.query(Device).filter(Device.current_owner_id == user.id).count()
    return UserOut(
        id=user.id, name=user.name, email=user.email,
        department=user.department, role=user.role, device_count=count
    )
