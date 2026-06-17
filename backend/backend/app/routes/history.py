from fastapi import APIRouter, Depends, HTTPException
from app.database.db import get_db
from app.utils.auth_utils import get_current_user
from bson import ObjectId
from typing import List

router = APIRouter()


def serialize_prediction(p: dict) -> dict:
    return {
        "id": str(p["_id"]),
        "user_id": p.get("user_id"),
        "predicted_class": p.get("predicted_class"),
        "full_name": p.get("full_name"),
        "confidence": p.get("confidence"),
        "risk": p.get("risk"),
        "description": p.get("description"),
        "next_steps": p.get("next_steps"),
        "top3": p.get("top3", []),
        "image_filename": p.get("image_filename"),
        "created_at": p.get("created_at").isoformat() if p.get("created_at") else None,
    }


@router.get("/")
async def get_history(current_user: dict = Depends(get_current_user)):
    db = get_db()
    user_id = str(current_user["_id"])
    cursor = db.predictions.find({"user_id": user_id}).sort("created_at", -1).limit(50)
    results = []
    async for doc in cursor:
        results.append(serialize_prediction(doc))
    return results


@router.get("/{prediction_id}")
async def get_single_prediction(
    prediction_id: str,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    try:
        oid = ObjectId(prediction_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid prediction ID")

    doc = await db.predictions.find_one({
        "_id": oid,
        "user_id": str(current_user["_id"])
    })
    if not doc:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return serialize_prediction(doc)


@router.delete("/{prediction_id}")
async def delete_prediction(
    prediction_id: str,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    try:
        oid = ObjectId(prediction_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid prediction ID")

    result = await db.predictions.delete_one({
        "_id": oid,
        "user_id": str(current_user["_id"])
    })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return {"message": "Prediction deleted successfully"}
