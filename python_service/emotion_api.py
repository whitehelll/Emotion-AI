from flask import Flask, request, jsonify
import cv2
import numpy as np
from tensorflow.keras.models import load_model
import base64
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)   # Allow React to access Flask

# Path to your model
MODEL_PATH = r"E:\New folder\New folder\Chatbot\python_service\emotion_model.h5"

if not os.path.exists(MODEL_PATH):
    print(f"[WARNING] Model file not found at {MODEL_PATH}")

# Emotion labels
emotion_labels = ['Angry', 'Disgust', 'Happy', 'Neutral', 'Sad', 'Surprise']

# Load model
model = None
if os.path.exists(MODEL_PATH):
    model = load_model(MODEL_PATH, compile=False)
    print("[INFO] Emotion model loaded.")
else:
    print("[ERROR] emotion_model.h5 not found. /detect-emotion will not work.")




@app.route("/detect-emotion", methods=["POST"])
def detect_emotion():
    """ Accepts base64 image → returns detected emotion """
    global model

    if model is None:
        return jsonify({"error": "Model NOT loaded"}), 500

    data = request.get_json()

    if not data or "image" not in data:
        return jsonify({"error": "Missing 'image' key"}), 400

    try:
        img_b64 = data["image"]

        # Remove "data:image/jpeg;base64," prefix if present
        if "," in img_b64:
            img_b64 = img_b64.split(",")[1]

        # Convert to numpy image
        img_bytes = base64.b64decode(img_b64)
        npimg = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({"error": "Image decode failed"}), 400

        # Convert to grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect faces
        detector = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
        faces = detector.detectMultiScale(gray, 1.3, 5)

        if len(faces) == 0:
            return jsonify({"emotion": "No Face Detected", "confidence": 0})

        (x, y, w, h) = faces[0]

        # Crop face
        pad = 10
        x1, y1 = max(0, x - pad), max(0, y - pad)
        x2, y2 = min(frame.shape[1], x + w + pad), min(frame.shape[0], y + h + pad)
        face = frame[y1:y2, x1:x2]

        # Preprocess
        face = cv2.cvtColor(face, cv2.COLOR_BGR2RGB)

        # Histogram equalization
        yuv = cv2.cvtColor(face, cv2.COLOR_RGB2YUV)
        yuv[:, :, 0] = cv2.equalizeHist(yuv[:, :, 0])
        face = cv2.cvtColor(yuv, cv2.COLOR_YUV2RGB)

        face = cv2.resize(face, (224, 224))
        face = face.astype("float32") / 255.0
        face = np.expand_dims(face, axis=0)

        # Predict
        pred = model.predict(face, verbose=0)[0]
        idx = np.argmax(pred)
        emotion = emotion_labels[idx]
        confidence = float(pred[idx] * 100)

        return jsonify({
            "emotion": emotion,
            "confidence": confidence
        })

    except Exception as e:
        print("[ERROR] /detect-emotion:", str(e))
        return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    # IMPORTANT — Match frontend port (5000)
    app.run(host="127.0.0.1", port=5001, debug=True)
 