import os
from flask import Flask, request, jsonify
from google import genai
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()
app = Flask(__name__)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# -----------------------
# USER STORAGE (NEW)
# -----------------------
user_data = {}

def get_user_store(user_id):
    if user_id not in user_data:
        user_data[user_id] = {
            "conversation_history": [],
            "all_chats": [],
            "last_message_time": None
        }
    return user_data[user_id]

# -----------------------
# HELPERS
# -----------------------
def generate_description(messages):
    user_msgs = [m["content"] for m in messages if m["role"] == "user"]
    return (" ".join(user_msgs[:2])[:60]) if user_msgs else "Conversation"

def get_emotion_prompt(emotion):
    return {
        "sad": "I'm here for you. Why are you feeling sad?",
        "happy": "That's great! What's making you feel happy?",
        "angry": "I understand. What's making you feel angry?",
        "neutral": "How are you feeling today?"
    }.get(emotion.lower(), "How are you feeling?")

def get_fallback_response(emotion):
    return {
        "sad": "I'm here with you.",
        "happy": "Tell me more 😊",
        "angry": "Take your time.",
        "neutral": "I'm listening."
    }.get(emotion.lower(), "Go ahead.")

# -----------------------
# CHAT
# -----------------------
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_id = data.get("userId", "default")

    store = get_user_store(user_id)
    history = store["conversation_history"]

    msg = data.get("message", "").strip()
    emotion = data.get("emotion", "neutral")
    now = datetime.now()

    # First message
    if len(history) == 0:
        reply = get_emotion_prompt(emotion)
        history.append({"role": "assistant", "content": reply})
        return jsonify({"reply": reply})

    # Empty input
    if not msg:
        reply = get_fallback_response(emotion)
        history.append({"role": "assistant", "content": reply})
        return jsonify({"reply": reply})

    # AI response
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"I am {emotion}. {msg}"
    )

    reply = response.text

    history.append({"role": "user", "content": msg})
    history.append({"role": "assistant", "content": reply})

    return jsonify({"reply": reply})

# -----------------------
# HISTORY
# -----------------------
@app.route("/history")
def history():
    user_id = request.args.get("userId", "default")
    store = get_user_store(user_id)

    return jsonify({"history": store["conversation_history"]})

# -----------------------
# NEW CHAT
# -----------------------
@app.route("/newchat", methods=["POST"])
def newchat():
    data = request.get_json()
    user_id = data.get("userId", "default")

    store = get_user_store(user_id)

    if store["conversation_history"]:
        store["all_chats"].append({
            "id": len(store["all_chats"]),
            "description": generate_description(store["conversation_history"]),
            "messages": store["conversation_history"].copy()
        })

    store["conversation_history"] = []

    return jsonify({"message": "New Chat Started"})

# -----------------------
# DESCRIPTIONS
# -----------------------
@app.route("/chat_descriptions")
def chat_descriptions():
    user_id = request.args.get("userId", "default")
    store = get_user_store(user_id)

    chats = store["all_chats"]

    if store["conversation_history"]:
        chats = chats + [{
            "id": len(chats),
            "description": generate_description(store["conversation_history"]) + " (ongoing)"
        }]

    return jsonify({"chats": chats})

# -----------------------
# GET CHAT
# -----------------------
@app.route("/chat/<int:chat_id>")
def get_chat(chat_id):
    user_id = request.args.get("userId", "default")
    store = get_user_store(user_id)

    if chat_id < len(store["all_chats"]):
        return jsonify({"chat": store["all_chats"][chat_id]})

    return jsonify({"error": "Chat not found"})

# -----------------------
# RUN
# -----------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)