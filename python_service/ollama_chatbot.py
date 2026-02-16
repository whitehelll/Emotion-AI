from flask import Flask, request, jsonify
import requests
import json
from datetime import datetime

app = Flask(__name__) 

# --------------------------------------- 
# ADMIN EMOTION
# ---------------------------------------
admin_emotion = "angry"

emotion_styles = {
    "angry": "Speak in a slightly irritated, blunt, and short-tempered tone. Be direct, sarcastic, and impatient.",
    "sad": "Speak in a low-energy, emotional, soft, and discouraged tone. Sound upset and hopeless.",
    "happy": "Speak in a cheerful, energetic, positive, and friendly tone.",
    "fear": "Speak in a worried, nervous, anxious, cautious tone.",
    "disgust": "Speak in a judgmental, unimpressed, grossed-out tone.",
    "neutral": "Speak in a calm, balanced, professional tone."
}

style = emotion_styles.get(admin_emotion, emotion_styles["neutral"])

# ---------------------------------------
# STORAGE
# ---------------------------------------
# List of all previous chat sessions
all_chat_sessions = []

# Current active conversation
conversation_history = [
    {"role": "system", "content": f"You are an AI chatbot. Your tone must follow this instruction: {style}"}
]

# ---------------------------------------
# OLLAMA CHAT FUNCTION (unchanged)
# ---------------------------------------
def ask_ollama(prompt):
    url = "http://localhost:11434/api/chat"
    payload = {
        "model": "llama3.1",
        "messages": conversation_history + [{"role": "user", "content": prompt}]
    }

    response = requests.post(url, json=payload, stream=True)
    full_reply = ""

    for line in response.iter_lines():
        if line:
            json_data = json.loads(line.decode('utf-8'))
            if "message" in json_data:
                chunk = json_data["message"]["content"]
                full_reply += chunk

    return full_reply


# ---------------------------------------
# CHAT ENDPOINT
# ---------------------------------------
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("message", "")  

    bot_reply = ask_ollama(user_input)

    # Save to active history
    conversation_history.append({"role": "user", "content": user_input})
    conversation_history.append({"role": "assistant", "content": bot_reply})

    return jsonify({"reply": bot_reply})


# ---------------------------------------
# HISTORY OF CURRENT CHAT
# ---------------------------------------
@app.route("/history", methods=["GET"])
def history():
    return jsonify({"history": conversation_history})


# ---------------------------------------
# NEW CHAT ENDPOINT
# ---------------------------------------
@app.route("/newchat", methods=["POST"])
def new_chat():
    global conversation_history

    # Save the old session ONLY if it contains chat
    if len(conversation_history) > 1:
        all_chat_sessions.append({
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "session": conversation_history.copy()
        })

    # Reset conversation history with system prompt
    conversation_history = [
        {"role": "system", "content": f"You are an AI chatbot. Your tone must follow this instruction: {style}"}
    ]

    return jsonify({"message": "New chat started", "status": "success"})


# ---------------------------------------
# ALL PREVIOUS CHATS
# ---------------------------------------
@app.route("/all_chats", methods=["GET"])
def all_chats():
    return jsonify({"chats": all_chat_sessions})


# ---------------------------------------
# START SERVER
# ---------------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
