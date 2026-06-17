from fastapi import APIRouter, HTTPException
from app.database.db import get_db
from app.utils.auth_utils import (
    hash_password,
    verify_password,
    create_access_token
)
from app.schemas.schemas import UserCreate, UserLogin

router = APIRouter()


@router.post("/signup")
async def signup(user: UserCreate):
    db = get_db()

    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password)
    }

    result = await db.users.insert_one(new_user)

    token = create_access_token({"sub": str(result.inserted_id)})

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.post("/login")
async def login(user: UserLogin):
    db = get_db()

    db_user = await db.users.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(db_user["_id"])})

    return {
        "access_token": token,
        "token_type": "bearer"
    }