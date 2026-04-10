import os
from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

app = Flask(__name__)

# -----------------------
# Gemini Client
# -----------------------

client = genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

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
# Empty Input Handling (NEW)
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

        # -------------------------------
        # Auto split chats
        # -------------------------------

        if last_message_time:

            if current_time.date() != last_message_time.date():
                save_current_chat()
                conversation_history = []

            elif current_time - last_message_time > TIME_GAP_LIMIT:
                save_current_chat()
                conversation_history = []

        # -------------------------------
        # FIRST BOT MESSAGE
        # -------------------------------

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

        # -------------------------------
        # EMPTY INPUT HANDLING (FIXED)
        # -------------------------------

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

        # -------------------------------
        # NORMAL AI RESPONSE
        # -------------------------------

        prompt = f"I am {emotion}. {user_message}"

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        reply = response.text

        # Save user message
        conversation_history.append({
            "role": "user",
            "content": user_message,
            "time": current_time.strftime("%H:%M"),
            "date": current_time.strftime("%Y-%m-%d")
        })

        # Save bot reply
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
        })


# -----------------------
# Current History
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

    save_current_chat()

    conversation_history = []
    last_message_time = None

    return jsonify({"message": "New Chat Started"})


# -----------------------
# Chat Descriptions
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
# Open Chat
# -----------------------

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
# Run Server
# -----------------------

if __name__ == "__main__":
    app.run(host = '0.0.0.0', port=5050,debug=True)