from flask import Blueprint, request, jsonify
import cv2
import numpy as np
from tensorflow.keras.models import load_model
import base64
import os
import requests

emotion_bp = Blueprint("emotion", __name__)

MODEL_PATH = "emotion_model.h5"

# 🔥 PUT YOUR GOOGLE DRIVE DIRECT LINK HERE
MODEL_URL = "https://drive.google.com/uc?export=download&id=1l2d9B1LeGDXlia1NwONu5TzGGDIIK3Wv"

emotion_labels = ['Angry', 'Disgust', 'Happy', 'Neutral', 'Sad', 'Surprise']

# ✅ Download model if not exists
import requests

def download_model():
    if os.path.exists(MODEL_PATH):
        return

    print("⬇️ Downloading model from Google Drive...")

    session = requests.Session()

    response = session.get(MODEL_URL, stream=True)
    
    # Handle large file confirmation
    for key, value in response.cookies.items():
        if key.startswith("download_warning"):
            confirm_token = value
            params = {"id": MODEL_URL.split("id=")[-1], "confirm": confirm_token}
            response = session.get("https://drive.google.com/uc?export=download", params=params, stream=True)
            break

    with open(MODEL_PATH, "wb") as f:
        for chunk in response.iter_content(1024 * 1024):
            if chunk:
                f.write(chunk)

    print("✅ Model downloaded successfully")

# ✅ Lazy loading
model = None

def get_model():
    global model
    if model is None:
        download_model()
        model = load_model(MODEL_PATH, compile=False)
        print("✅ Model loaded")
    return model


@emotion_bp.route("/detect-emotion", methods=["POST"])
def detect_emotion():
    data = request.get_json()

    if not data or "image" not in data:
        return jsonify({"error": "Missing 'image' key"}), 400

    try:
        img_b64 = data["image"]

        if "," in img_b64:
            img_b64 = img_b64.split(",")[1]

        img_bytes = base64.b64decode(img_b64)
        npimg = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        detector = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        )
        faces = detector.detectMultiScale(gray, 1.3, 5)

        if len(faces) == 0:
            return jsonify({"emotion": "No Face Detected", "confidence": 0})

        (x, y, w, h) = faces[0]
        face = frame[y:y+h, x:x+w]

        face = cv2.resize(face, (224, 224))
        face = face.astype("float32") / 255.0
        face = np.expand_dims(face, axis=0)

        pred = get_model().predict(face, verbose=0)[0]
        idx = np.argmax(pred)

        return jsonify({
            "emotion": emotion_labels[idx],
            "confidence": float(pred[idx] * 100)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500