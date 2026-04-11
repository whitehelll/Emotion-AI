from flask import Blueprint, request, jsonify
import cv2
import numpy as np
from tensorflow.keras.models import load_model
import base64
import os
import requests
import gdown


# 🔥 Disable TensorFlow optimizations (stability)
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

emotion_bp = Blueprint("emotion", __name__)

MODEL_PATH = "emotion_model.h5"
MODEL_URL = "https://drive.google.com/uc?export=download&id=1l2d9B1LeGDXlia1NwONu5TzGGDIIK3Wv"

emotion_labels = ['Angry', 'Disgust', 'Happy', 'Neutral', 'Sad', 'Surprise']

# -------------------------------
# Download Model (Google Drive)


def download_model():
    if os.path.exists(MODEL_PATH):
        print("✅ Model already exists")
        return

    print("⬇️ Downloading model via gdown...")

    url = "https://drive.google.com/uc?id=1l2d9B1LeGDXlia1NwONu5TzGGDIIK3Wv"
    gdown.download(url, MODEL_PATH, quiet=False)

    size = os.path.getsize(MODEL_PATH) / (1024 * 1024)
    print(f"📦 Model size: {size:.2f} MB")

    if size < 50:
        raise Exception("❌ Model corrupted (download failed)")


# -------------------------------
# def download_model():
#     if os.path.exists(MODEL_PATH):
#         return

#     print("⬇️ Downloading model...")

#     session = requests.Session()
#     response = session.get(MODEL_URL, stream=True)

#     # Handle large file confirm
#     for key, value in response.cookies.items():
#         if key.startswith("download_warning"):
#             params = {
#                 "id": MODEL_URL.split("id=")[-1],
#                 "confirm": value
#             }
#             response = session.get(
#                 "https://drive.google.com/uc?export=download",
#                 params=params,
#                 stream=True
#             )
#             break

#     with open(MODEL_PATH, "wb") as f:
#         for chunk in response.iter_content(1024 * 1024):
#             if chunk:
#                 f.write(chunk)

#     print("✅ Model downloaded")


# -------------------------------
# Lazy Load Model
# -------------------------------
model = None

def get_model():
    global model
    if model is None:
        download_model()

        if not os.path.exists(MODEL_PATH):
            raise Exception("Model file missing after download")

        print("📦 Loading model...")
        model = load_model(MODEL_PATH, compile=False)
        print("✅ Model loaded")

    return model


# -------------------------------
# Emotion Detection Route
# -------------------------------
@emotion_bp.route("/detect-emotion", methods=["POST"])
def detect_emotion():
    data = request.get_json()

    if not data or "image" not in data:
        return jsonify({"error": "Missing 'image' key"}), 400

    try:
        img_b64 = data["image"]

        # Remove prefix if exists
        if "," in img_b64:
            img_b64 = img_b64.split(",")[1]

        # Decode image
        img_bytes = base64.b64decode(img_b64)
        npimg = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({"error": "Image decode failed"}), 400

        # Convert to grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Face detection
        detector = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        )
        faces = detector.detectMultiScale(gray, 1.3, 5)

        if len(faces) == 0:
            return jsonify({"emotion": "No Face Detected", "confidence": 0})

        (x, y, w, h) = faces[0]

        # 🔥 Add padding (better accuracy)
        pad = 10
        x1, y1 = max(0, x - pad), max(0, y - pad)
        x2, y2 = min(frame.shape[1], x + w + pad), min(frame.shape[0], y + h + pad)

        face = frame[y1:y2, x1:x2]

        # Convert to RGB
        face = cv2.cvtColor(face, cv2.COLOR_BGR2RGB)

        # 🔥 Histogram equalization (better contrast)
        yuv = cv2.cvtColor(face, cv2.COLOR_RGB2YUV)
        yuv[:, :, 0] = cv2.equalizeHist(yuv[:, :, 0])
        face = cv2.cvtColor(yuv, cv2.COLOR_YUV2RGB)

        # Resize
        face = cv2.resize(face, (224, 224))

        # Normalize
        face = face.astype("float32") / 255.0
        face = np.expand_dims(face, axis=0)

        # Predict
        pred = get_model().predict(face, verbose=0)[0]
        idx = np.argmax(pred)

        return jsonify({
            "emotion": emotion_labels[idx],
            "confidence": float(pred[idx] * 100)
        })

    except Exception as e:
        import traceback
        print("🔥 EMOTION ERROR:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500