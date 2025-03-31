from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn")

app = FastAPI()

# Enable CORS middleware (you can adjust the origins list based on your needs)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, change to specific origins for security
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

pn = tf.keras.models.load_model("models/pneumonia_detection.h5", compile=False)
# sc_d = tf.keras.models.load_model("models/skincancer_prediction.keras")
sd_c = tf.keras.models.load_model("models/skininfection_classification.h5", compile=False)
# sl_c = tf.keras.models.load_model("models/c_model.h5", compile=False)
bt = tf.keras.models.load_model("models/braintumor_detection.h5", compile=False)

# Define Pydantic model for the prediction response
class PredictionResponse(BaseModel):
    predicted_class: str
    confidence: float

def preprocess_image(image: UploadFile, target_size):
    image_data = image.file.read()
    image = Image.open(io.BytesIO(image_data))
    image = image.resize(target_size)
    image_array = np.array(image)
    if len(image_array.shape) == 2:
        image_array = np.stack([image_array] * 3, axis=-1)
    image_array = image_array / 255.0
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response: {response.status_code}")
    return response

@app.post("/pneumonia_detection")
async def pneumonia_detection(file: UploadFile = File(...)):
    try:
        image_array_pneumonia = preprocess_image(file, target_size=(300, 300))
        prediction_pneumonia = pn.predict(image_array_pneumonia)
        predicted_class_pneumonia = np.argmax(prediction_pneumonia, axis=1)[0]
        confidence_pneumonia = float(np.max(prediction_pneumonia, axis=1)[0])
        class_labels_pneumonia = ["Normal", "Pneumonia"]
        predicted_class_label_pneumonia = class_labels_pneumonia[predicted_class_pneumonia]

        return JSONResponse(content={
                "predicted_class": str(predicted_class_label_pneumonia),
                "confidence": confidence_pneumonia
            }
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})

@app.post("/braintumor_detection", response_model=PredictionResponse)
async def braintumor_detection(file: UploadFile = File(...)):
    try:
        image_array_bt = preprocess_image(file, target_size=(224, 224))
        prediction_bt = bt.predict(image_array_bt)
        predicted_class_bt = np.argmax(prediction_bt, axis=1)[0]
        confidence_bt = float(np.max(prediction_bt, axis=1)[0])
        class_labels_bt = ["glioma", "meningioma", "no tumor", "pituitary"]
        predicted_class_label_bt = class_labels_bt[predicted_class_bt]

        return JSONResponse(content={
                "predicted_class": str(predicted_class_label_bt),
                "confidence": confidence_bt
            }
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})
    
@app.post("/skincancer_detection", response_model=PredictionResponse)
async def skincancer_detection(file: UploadFile = File(...)):
    try:
        image_array_cancer = preprocess_image(file, target_size=(256, 256))
        prediction_cancer = sc_d.predict(image_array_cancer)
        predicted_class_cancer = np.argmax(prediction_cancer, axis=1)[0]
        confidence_cancer = float(np.max(prediction_cancer, axis=1)[0])
        class_labels_cancer = ["Benign", "Malignant"]
        predicted_class_label_cancer = class_labels_cancer[predicted_class_cancer]

        return JSONResponse(content={
                "predicted_class": str(predicted_class_label_cancer),
                "confidence": confidence_cancer 
            }
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})

@app.post("/skindisease_classification", response_model=PredictionResponse)
async def skindisease_classification(file: UploadFile = File(...)):
    try:
        image_array_disease = preprocess_image(file, target_size=(224, 224))
        prediction_disease = sd_c.predict(image_array_disease)
        predicted_class_disease = np.argmax(prediction_disease, axis=1)[0]
        confidence_disease = float(np.max(prediction_disease, axis=1)[0])
        class_labels_disease = ["Cellulitis", "Athlete-Foot", "Impetigo", "Chickenpox", "Cutaneous Larva Migrans", "Nail-Fungus", "Ringworm", "Shingles"]
        predicted_class_label_disease = class_labels_disease[predicted_class_disease]

        return JSONResponse(content={
                "predicted_class": str(predicted_class_label_disease),
                "confidence": confidence_disease
            }
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})
'''    
@app.post("/skinlesion_classification", response_model=PredictionResponse)
async def skinlesion_classification(file: UploadFile = File(...)):
    try:
        image_array_disease = preprocess_image(file, target_size=(224, 224))
        prediction_disease = sl_c.predict(image_array_disease)
        predicted_class_disease = np.argmax(prediction_disease, axis=1)[0]
        confidence_disease = float(np.max(prediction_disease, axis=1)[0])
        class_labels_disease = ["actinic keratosis", "abasal cell carcinoma", "pigmented benign keratosis", "dermatofibroma", "nevus", "melanoma", "vascular lesion"]
        predicted_class_label_disease = class_labels_disease[predicted_class_disease]

        return JSONResponse(content={
                "predicted_class": str(predicted_class_label_disease),
                "confidence": confidence_disease
            }
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})
'''