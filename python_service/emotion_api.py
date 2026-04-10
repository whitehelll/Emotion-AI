from flask import Blueprint, request, jsonify
import cv2
import numpy as np
from tensorflow.keras.models import load_model
import base64
import os

emotion_bp = Blueprint("emotion", __name__)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "emotion_model.h5")

emotion_labels = ['Angry', 'Disgust', 'Happy', 'Neutral', 'Sad', 'Surprise']

model = load_model(MODEL_PATH, compile=False)

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

        detector = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
        faces = detector.detectMultiScale(gray, 1.3, 5)

        if len(faces) == 0:
            return jsonify({"emotion": "No Face Detected", "confidence": 0})

        (x, y, w, h) = faces[0]
        face = frame[y:y+h, x:x+w]

        face = cv2.resize(face, (224, 224))
        face = face.astype("float32") / 255.0
        face = np.expand_dims(face, axis=0)

        pred = model.predict(face, verbose=0)[0]
        idx = np.argmax(pred)

        return jsonify({
            "emotion": emotion_labels[idx],
            "confidence": float(pred[idx] * 100)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500