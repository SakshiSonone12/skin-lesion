import torch
import timm
from torchvision import transforms
from PIL import Image
import io
import logging
import os
from huggingface_hub import hf_hub_download

logger = logging.getLogger(__name__)

CLASS_NAMES = ['akiec', 'bcc', 'bkl', 'df', 'mel', 'nv', 'vasc']

CLASS_INFO = {
    "akiec": {
        "full_name": "Actinic Keratoses & Intraepithelial Carcinoma",
        "risk": "cancerous",
        "description": "A rough, scaly patch caused by years of sun exposure. Can develop into skin cancer if untreated.",
        "next_steps": "Consult a dermatologist immediately. Treatment options include cryotherapy, topical medications, or photodynamic therapy."
    },
    "bcc": {
        "full_name": "Basal Cell Carcinoma",
        "risk": "cancerous",
        "description": "The most common type of skin cancer. Grows slowly and rarely spreads, but must be treated.",
        "next_steps": "Schedule an urgent appointment with a dermatologist or oncologist. Early treatment has excellent outcomes."
    },
    "bkl": {
        "full_name": "Benign Keratosis",
        "risk": "non-cancerous",
        "description": "A harmless skin growth that can look like a wart or mole. Very common in older adults.",
        "next_steps": "Generally no treatment needed. Monitor for changes. Consult a dermatologist if it grows or changes."
    },
    "df": {
        "full_name": "Dermatofibroma",
        "risk": "non-cancerous",
        "description": "A common, harmless skin growth that often appears on the legs. Usually firm to the touch.",
        "next_steps": "No treatment required unless it bothers you. Can be removed surgically if desired."
    },
    "mel": {
        "full_name": "Melanoma",
        "risk": "cancerous",
        "description": "The most serious type of skin cancer. Develops from pigment-producing cells. Early detection is critical.",
        "next_steps": "Seek immediate medical attention. Contact a dermatologist or oncologist today."
    },
    "nv": {
        "full_name": "Melanocytic Nevi (Mole)",
        "risk": "non-cancerous",
        "description": "A common mole. Most are harmless, but monitor for changes using the ABCDE rule.",
        "next_steps": "Regular self-monitoring recommended. See a dermatologist if you notice changes in size, shape, or color."
    },
    "vasc": {
        "full_name": "Vascular Lesion",
        "risk": "non-cancerous",
        "description": "Skin lesions caused by abnormal blood vessels. Includes angiomas and pyogenic granulomas.",
        "next_steps": "Consult a dermatologist for evaluation. Most are benign but can be removed for cosmetic reasons."
    }
}

MEAN = [0.485, 0.456, 0.406]
STD = [0.229, 0.224, 0.225]

_model = None

def load_model(model_path: str = "final_model.pth"):
    global _model
    if _model is not None:
        return _model

    # Download model from Hugging Face if not found locally
    if not os.path.exists(model_path):
        logger.info("Downloading model from Hugging Face...")
        model_path = hf_hub_download(
            repo_id="sakshi10s/final_model.pth",
            filename="final_model.pth"
        )

    logger.info("Loading ViT model...")
    try:
        model = timm.create_model(
            "vit_base_patch16_224",
            pretrained=False,
            num_classes=7
        )

        checkpoint = torch.load(model_path, map_location="cpu")

        # Handle both raw state_dict and wrapped checkpoints
        if isinstance(checkpoint, dict):
            if "model_state_dict" in checkpoint:
                state_dict = checkpoint["model_state_dict"]
            elif "state_dict" in checkpoint:
                state_dict = checkpoint["state_dict"]
            else:
                state_dict = checkpoint
        else:
            state_dict = checkpoint

        model.load_state_dict(state_dict, strict=False)
        model.eval()

        _model = model
        logger.info("Model loaded successfully.")
        return _model

    except FileNotFoundError:
        logger.error(f"Model file not found at {model_path}")
        raise

    except Exception as e:
        logger.error(f"Error loading model: {e}")
        raise

def get_transform():
    return transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=MEAN, std=STD),
    ])

def preprocess_image(image_bytes: bytes) -> torch.Tensor:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    transform = get_transform()
    tensor = transform(image).unsqueeze(0)  # Add batch dim
    return tensor

def predict_image(image_bytes: bytes, model_path: str = "final_model.pth") -> dict:
    model = load_model(model_path)
    tensor = preprocess_image(image_bytes)

    with torch.no_grad():
        outputs = model(tensor)
        probabilities = torch.softmax(outputs, dim=1)[0]

    probs_list = probabilities.tolist()
    top3_indices = sorted(range(len(probs_list)), key=lambda i: probs_list[i], reverse=True)[:3]

    predicted_idx = top3_indices[0]
    predicted_class = CLASS_NAMES[predicted_idx]
    confidence = probs_list[predicted_idx]

    top3 = [
        {
            "class": CLASS_NAMES[i],
            "full_name": CLASS_INFO[CLASS_NAMES[i]]["full_name"],
            "probability": round(probs_list[i] * 100, 2)
        }
        for i in top3_indices
    ]

    class_info = CLASS_INFO[predicted_class]

    return {
        "predicted_class": predicted_class,
        "full_name": class_info["full_name"],
        "confidence": round(confidence * 100, 2),
        "risk": class_info["risk"],
        "description": class_info["description"],
        "next_steps": class_info["next_steps"],
        "top3": top3
    }
