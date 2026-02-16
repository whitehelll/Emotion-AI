from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64
# (Make sure your model loading and other imports remain above)

app = Flask(__name__)

@app.route('/')
def home():
    return "Emotion detection api is running"

@app.route('/detect', methods=['POST'])
def detect_emotion():
    """
    Expects a POST request with an image in base64 format under 'image' key.
    Returns detected emotion label and confidence.
    """
    data = request.json
    if 'image' not in data:
        return jsonify({"error": "No image provided"}), 400
    # Decode base64 image
    img_bytes = base64.b64decode(data['image'])
    nparr = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Copy the same logic as your main emotion detection loop:
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = facedetector.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)
    for (x, y, w, h) in faces:
        y1, y2 = max(0, y - 10), min(frame.shape[0], y + h + 10)
        x1, x2 = max(0, x - 10), min(frame.shape[1], x + w + 10)
        faceroi = frame[y1:y2, x1:x2]
        faceroi = cv2.cvtColor(faceroi, cv2.COLOR_BGR2RGB)
        roicolor = cv2.resize(faceroi, (224, 224))
        roicolor = roicolor.astype('float32') / 255.0
        roicolor = np.expand_dims(roicolor, axis=0)
        preds = model.predict(roicolor, verbose=0)
        emotionidx = np.argmax(preds)
        emotion = emotionlabels[emotionidx]
        confidence = float(preds[0][emotionidx]) * 100
        return jsonify({'emotion': emotion, 'confidence': confidence})
    return jsonify({'emotion': 'No face found', 'confidence': None})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)