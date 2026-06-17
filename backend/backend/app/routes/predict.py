from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.model_loader import predict_image
from app.database.db import get_db
from app.utils.auth_utils import get_current_user
from app.config import settings
from datetime import datetime
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/jpg", "image/webp"}
MAX_SIZE_MB = 10


@router.post("/")
async def predict(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload a JPEG, PNG, or WebP image."
        )

    image_bytes = await file.read()

    if len(image_bytes) > MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {MAX_SIZE_MB}MB."
        )

    try:
        result = predict_image(image_bytes, model_path=settings.MODEL_PATH)
    except FileNotFoundError:
        raise HTTPException(
            status_code=500,
            detail="Model file not found. Please ensure final_model.pth is in the backend directory."
        )
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed. Please try again.")

    db = get_db()
    record = {
        "user_id": str(current_user["_id"]),
        "predicted_class": result["predicted_class"],
        "full_name": result["full_name"],
        "confidence": result["confidence"],
        "risk": result["risk"],
        "description": result["description"],
        "next_steps": result["next_steps"],
        "top3": result["top3"],
        "image_filename": file.filename,
        "created_at": datetime.utcnow()
    }
    inserted = await db.predictions.insert_one(record)
    result["id"] = str(inserted.inserted_id)
    result["image_filename"] = file.filename
    result["created_at"] = record["created_at"].isoformat()

    return result
