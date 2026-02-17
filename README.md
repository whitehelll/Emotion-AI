🎭 Emotion AI – Real-Time Emotion Detection & Chat Platform

A full-stack AI-powered web application that analyzes real-time emotions using facial expressions and voice modulation while chatting with an intelligent chatbot.

🚀 Overview

Emotion AI is a modern web application that combines:

💬 Interactive chatbot system

🎥 Facial emotion recognition (CNN)

🎤 Audio-based emotion detection (Random Forest)

📊 Real-time emotion tracking dashboard

The system detects and tracks user emotions during live conversations using computer vision and audio signal processing.

🧠 AI Models Used
Component	Model	Purpose
Facial Emotion	Convolutional Neural Network (CNN)	Detect emotion from webcam frames
Audio Emotion	Random Forest Classifier	Detect emotion from voice modulation
Chatbot	NLP-based conversational system	Interactive chat experience
🏗️ Tech Stack
Frontend

React.js

Axios

WebRTC (Camera & Mic access)

Backend

Node.js

Express.js

JWT Authentication

REST API Architecture

Database

MongoDB

AI Microservice

Python

Flask

OpenCV

Scikit-learn

TensorFlow / Keras

📂 Project Structure
major-project/
│
├── backend/            # Node.js + Express API
├── frontend/           # React Frontend
├── python_services/    # Emotion Detection Models (Flask)
└── README.md

⚙️ Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/whitehelll/major-project.git
cd major-project

🔹 Backend Setup
Step 1: Configure Environment Variables

Inside backend/ folder, create a .env file:

MONGODB_URL=your_mongodb_connection_string

JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=1d

PORT=5000

Step 2: Install Dependencies & Start Server
cd backend
npm install
npm start


Backend runs at:
http://localhost:5000
🔹 Frontend Setup

Open a new terminal:

cd frontend
npm install
npm start


Frontend runs at:

http://localhost:3000

🔹 Python AI Service Setup

Open a new terminal:

cd python_services
pip install -r requirements.txt
python emotion_api.py


This starts the Flask ML API responsible for:

Facial Emotion Detection (CNN)

Audio Emotion Classification (Random Forest)

🔁 Application Workflow
User logs into the platform.
Webcam captures facial frames.
Microphone captures audio signals.
Data sent to Python ML microservice.
Emotion predicted in real time.
Results displayed on dashboard.
Emotional history stored in MongoDB.
✨ Key Features
🔐 Secure JWT Authentication
📹 Real-time facial emotion detection
🎤 Audio-based emotion recognition
💬 Chatbot interaction
📊 Emotion tracking dashboard
🧩 Microservice-based architecture
