from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# --- Auth Schemas ---
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    name: str
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# --- Prediction Schemas ---
class TopPrediction(BaseModel):
    class_name: str
    full_name: str
    probability: float

class PredictionOut(BaseModel):
    id: str
    user_id: str
    predicted_class: str
    full_name: str
    confidence: float
    risk: str
    description: str
    next_steps: str
    top3: List[dict]
    image_filename: str
    created_at: datetime
