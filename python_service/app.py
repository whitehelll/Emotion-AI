import os
from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
from datetime import datetime, timedelta
from flask_cors import CORS

# IMPORT EMOTION ROUTES
from emotion_api import emotion_bp

load_dotenv()

app = Flask(__name__)
CORS(app)

# REGISTER EMOTION API
app.register_blueprint(emotion_bp)

# -----------------------
# Gemini Setup
# -----------------------
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ GEMINI_API_KEY is missing")
    model = None
else:
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.5-flash")
        print("✅ Gemini initialized successfully")
    except Exception as e:
        print("❌ Gemini init failed:", str(e))
        model = None

# -----------------------
# Storage
# -----------------------
conversation_history = []
all_chats = []

last_message_time = None
TIME_GAP_LIMIT = timedelta(minutes=30)

# FIX 1: Variable named clearly, different from any function name
emotion_was_detected = False
current_emotion = None

# -----------------------
# Helper: Generate Description
# -----------------------
def generate_description(messages):
    user_msgs = [m["content"] for m in messages if m["role"] == "user" and m["content"].strip()]

    if not user_msgs:
        return "Conversation"

    text = " ".join(user_msgs[:2])
    return text[:60]

# -----------------------
# Save Chat
# -----------------------
def save_current_chat():
    global conversation_history, all_chats

    if len(conversation_history) == 0:
        return

    description = generate_description(conversation_history)
    description = f"{description} ({datetime.now().strftime('%d %b %H:%M')})"

    all_chats.append({
        "id": len(all_chats),
        "description": description,
        "messages": conversation_history.copy(),
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M")
    })

# -----------------------
# Emotion Starter
# -----------------------
def get_emotion_prompt(emotion):
    prompts = {
        "sad":       "I'm here for you 💙 Why are you feeling sad?",
        "happy":     "That's wonderful! 😊 What's making you feel happy?",
        "angry":     "I understand. Take a breath — what's making you feel angry?",
        "surprised": "Oh wow! What surprised you?",
        "fearful":   "It's okay to feel scared. I'm right here with you 💛",
        "disgusted": "That sounds really unpleasant. Want to talk about it?",
        "neutral":   "How are you feeling today? I'm here to listen.",
    }
    return prompts.get(emotion.lower(), "How are you feeling? I'm here for you.")

# -----------------------
# Fallback (empty input)
# -----------------------
def get_fallback_response(emotion):
    fallback = {
        "sad":       "It's okay if you don't feel like saying much. I'm here with you 💙",
        "happy":     "You seem happy 😊 Want to share more?",
        "angry":     "Take your time. I'm listening.",
        "surprised": "Take a moment — I'm here whenever you're ready.",
        "fearful":   "No rush. You're safe here 💛",
        "disgusted": "Whenever you're ready to talk, I'm here.",
        "neutral":   "No rush. Tell me whenever you're ready.",
    }
    return fallback.get(emotion.lower(), "I'm here whenever you want to talk.")

# -----------------------
# Routes
# -----------------------
@app.route("/")
def index():
    return render_template("index.html", initial_reply="")


# -----------------------
# FIX 3: Greeting — only appends to history if chat is fresh
# -----------------------
@app.route("/greeting", methods=["GET"])
def greeting():
    reply = "Hi 👋 I'm your emotional support companion. How are you feeling today?"

    # Only store greeting if this is a fresh conversation
    if not conversation_history:
        conversation_history.append({
            "role": "assistant",
            "content": reply,
            "time": datetime.now().strftime("%H:%M"),
            "date": datetime.now().strftime("%Y-%m-%d")
        })

    return jsonify({"reply": reply})


# -----------------------
# FIX 1 + 2: Route URL is /emotion_detected, function name is handle_emotion_detected
# -----------------------
@app.route("/emotion_detected", methods=["POST"])
def handle_emotion_detected():
    global emotion_was_detected, current_emotion

    data = request.get_json()
    emotion = data.get("emotion", "neutral")

    current_emotion = emotion
    emotion_was_detected = True  # ✅ flag is set here too

    bot_msg = get_emotion_prompt(current_emotion)

    conversation_history.append({
        "role": "assistant",
        "content": bot_msg,
        "time": datetime.now().strftime("%H:%M"),
        "date": datetime.now().strftime("%Y-%m-%d")
    })

    return jsonify({"reply": bot_msg})


# -----------------------
# Chat API
# -----------------------
@app.route("/chat", methods=["POST"])
def chat():
    global last_message_time, conversation_history
    global emotion_was_detected, current_emotion

    try:
        data = request.get_json()

        user_message = data.get("message", "").strip()
        incoming_emotion = data.get("emotion")
        current_time = datetime.now()

        # -----------------------------
        # STEP 1: No emotion set yet
        # -----------------------------
        if not emotion_was_detected:

            if not incoming_emotion:
                reply = "Hi 👋 I'm here to talk with you. How are you feeling today?"
                conversation_history.append({
                    "role": "assistant",
                    "content": reply,
                    "time": current_time.strftime("%H:%M"),
                    "date": current_time.strftime("%Y-%m-%d")
                })
                return jsonify({"reply": reply})

            # Emotion provided via manual input (old HTML UI)
            current_emotion = incoming_emotion
            emotion_was_detected = True

            bot_msg = get_emotion_prompt(current_emotion)
            bot_msg += "\n\nYou can talk to me freely — I'm here for you."

            conversation_history.append({
                "role": "assistant",
                "content": bot_msg,
                "time": current_time.strftime("%H:%M"),
                "date": current_time.strftime("%Y-%m-%d")
            })

            return jsonify({"reply": bot_msg})

        # -----------------------------
        # STEP 2: Emotion known, no message
        # -----------------------------
        if not user_message:
            reply = get_fallback_response(current_emotion or "neutral")
            conversation_history.append({
                "role": "assistant",
                "content": reply,
                "time": current_time.strftime("%H:%M"),
                "date": current_time.strftime("%Y-%m-%d")
            })
            return jsonify({"reply": reply})

        # -----------------------------
        # STEP 3: Normal chat with Gemini
        # -----------------------------
        if model is None:
            return jsonify({"reply": "⚠️ AI unavailable — Gemini not configured."}), 500

        prompt = (
            f"You are a compassionate emotional support chatbot. "
            f"The user is currently feeling {current_emotion}. "
            f"Respond with empathy, warmth, and understanding to: {user_message}"
        )

        response = model.generate_content(prompt)
        reply = response.text if hasattr(response, "text") else "I'm here for you. Can you tell me more?"

        conversation_history.append({
            "role": "user",
            "content": user_message,
            "time": current_time.strftime("%H:%M"),
            "date": current_time.strftime("%Y-%m-%d")
        })

        conversation_history.append({
            "role": "assistant",
            "content": reply,
            "time": current_time.strftime("%H:%M"),
            "date": current_time.strftime("%Y-%m-%d")
        })

        return jsonify({"reply": reply})

    except Exception as e:
        print("❌ Chat error:", str(e))
        return jsonify({"reply": "Server Error", "error": str(e)}), 500

    
# -----------------------
# History
# -----------------------
@app.route("/history")
def history():
    return jsonify({"history": conversation_history})


# -----------------------
# New Chat
# -----------------------
@app.route("/newchat", methods=["POST"])
def newchat():
    global conversation_history, last_message_time
    global emotion_was_detected, current_emotion

    save_current_chat()

    conversation_history = []
    last_message_time = None
    emotion_was_detected = False
    current_emotion = None

    return jsonify({"message": "New Chat Started"})


# -----------------------
# Chat Descriptions (Sidebar)
# -----------------------
@app.route("/chat_descriptions")
def chat_descriptions():
    temp_chats = all_chats.copy()

    if len(conversation_history) > 0:
        temp_chats.append({
            "id": len(temp_chats),
            "description": generate_description(conversation_history) + " (ongoing)",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M")
        })

    return jsonify({"chats": temp_chats})


# -----------------------
# Get Chat by ID
# -----------------------
@app.route("/chat/<int:chat_id>")
def get_chat(chat_id):
    temp_chats = all_chats.copy()

    if len(conversation_history) > 0:
        temp_chats.append({
            "id": len(temp_chats),
            "description": "Current Chat",
            "messages": conversation_history
        })

    if chat_id < len(temp_chats):
        return jsonify({"chat": temp_chats[chat_id]})

    return jsonify({"error": "Chat not found"}), 404


# -----------------------
# Run
# -----------------------
if __name__ == "__main__":
    app.run(port=5000, debug=True)