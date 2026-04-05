from flask import Flask, request, jsonify
import cv2
import numpy as np
from tensorflow.keras.models import load_model
import base64
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ✅ Correct relative path (important for Render)
MODEL_PATH = os.path.join(os.path.dirname(__file__), "emotion_model.h5")

# Emotion labels
emotion_labels = ['Angry', 'Disgust', 'Happy', 'Neutral', 'Sad', 'Surprise']

# ✅ Lazy loading (production-safe)
model = None

def get_model():
    global model
    if model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError("emotion_model.h5 not found")
        model = load_model(MODEL_PATH, compile=False)
        print("[INFO] Model loaded successfully")
    return model


@app.route("/detect-emotion", methods=["POST"])
def detect_emotion():
    try:
        model = get_model()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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

        if frame is None:
            return jsonify({"error": "Image decode failed"}), 400

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        detector = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        )

        faces = detector.detectMultiScale(gray, 1.3, 5)

        if len(faces) == 0:
            return jsonify({"emotion": "No Face Detected", "confidence": 0})

        (x, y, w, h) = faces[0]

        pad = 10
        x1, y1 = max(0, x - pad), max(0, y - pad)
        x2, y2 = min(frame.shape[1], x + w + pad), min(frame.shape[0], y + h + pad)
        face = frame[y1:y2, x1:x2]

        face = cv2.cvtColor(face, cv2.COLOR_BGR2RGB)

        yuv = cv2.cvtColor(face, cv2.COLOR_RGB2YUV)
        yuv[:, :, 0] = cv2.equalizeHist(yuv[:, :, 0])
        face = cv2.cvtColor(yuv, cv2.COLOR_YUV2RGB)

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
        print("[ERROR]:", str(e))
        return jsonify({"error": "Internal server error"}), 500


# ❌ REMOVE app.run() in production