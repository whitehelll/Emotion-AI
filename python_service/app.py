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
# Gemini Setup (FIXED)
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
        "sad": "I'm here for you. Why are you feeling sad?",
        "happy": "That's great! What's making you feel happy?",
        "angry": "I understand. What's making you feel angry?",
        "neutral": "How are you feeling today?"
    }
    return prompts.get(emotion.lower(), "How are you feeling?")

# -----------------------
# Empty Input Handling
# -----------------------
def get_fallback_response(emotion):
    fallback = {
        "sad": "It's okay if you don't feel like saying much. I'm here with you.",
        "happy": "You seem happy 😊 Want to share more?",
        "angry": "Take your time. I'm listening.",
        "neutral": "No rush. Tell me whenever you're ready."
    }
    return fallback.get(emotion.lower(), "I'm here whenever you want to talk.")

# -----------------------
# Routes
# -----------------------
@app.route("/")
def index():
    return render_template("index.html")

# -----------------------
# Chat API
# -----------------------
@app.route("/chat", methods=["POST"])
def chat():
    global last_message_time, conversation_history

    try:
        data = request.get_json()

        user_message = data.get("message", "").strip()
        emotion = data.get("emotion", "neutral")

        current_time = datetime.now()

        if last_message_time:
            if current_time.date() != last_message_time.date():
                save_current_chat()
                conversation_history = []
            elif current_time - last_message_time > TIME_GAP_LIMIT:
                save_current_chat()
                conversation_history = []

        # First message → emotion starter
        if len(conversation_history) == 0:
            bot_msg = get_emotion_prompt(emotion)

            conversation_history.append({
                "role": "assistant",
                "content": bot_msg,
                "time": current_time.strftime("%H:%M"),
                "date": current_time.strftime("%Y-%m-%d")
            })

            last_message_time = current_time
            return jsonify({"reply": bot_msg})

        # Empty message fallback
        if not user_message:
            reply = get_fallback_response(emotion)

            conversation_history.append({
                "role": "assistant",
                "content": reply,
                "time": current_time.strftime("%H:%M"),
                "date": current_time.strftime("%Y-%m-%d")
            })

            last_message_time = current_time
            return jsonify({"reply": reply})

        prompt = f"I am {emotion}. {user_message}"

        # ✅ SAFE GEMINI CALL
        if model is None:
            return jsonify({
                "reply": "AI service is currently unavailable",
                "error": "Model not initialized"
            }), 500

        try:
            response = model.generate_content(prompt)
            reply = response.text if hasattr(response, "text") else "No response from AI"
        except Exception as e:
            return jsonify({
                "reply": "AI service error",
                "error": str(e)
            }), 500

        # Save conversation
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

        last_message_time = current_time

        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({
            "reply": "Server Error",
            "error": str(e)
        }), 500

# -----------------------
# Other Routes (UNCHANGED)
# -----------------------
@app.route("/history")
def history():
    return jsonify({"history": conversation_history})

@app.route("/newchat", methods=["POST"])
def newchat():
    global conversation_history, last_message_time

    save_current_chat()
    conversation_history = []
    last_message_time = None

    return jsonify({"message": "New Chat Started"})

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

@app.route("/chat/<int:chat_id>")
def get_chat(chat_id):
    temp_chats = all_chats.copy()

    if len(conversation_history) > 0:
        temp_chats.append({
            "description": "Current Chat",
            "messages": conversation_history
        })

    if chat_id < len(temp_chats):
        return jsonify({"chat": temp_chats[chat_id]})

    return jsonify({"error": "Chat not found"})

# -----------------------
# Run App
# -----------------------
if __name__ == "__main__":
    app.run(port=5000)