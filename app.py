from flask import Flask, render_template, request
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()  # .env file-ல irukka values load agum

app = Flask(__name__)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    user_msg = request.json.get("message")
    if not user_msg or not user_msg.strip():
        return {"reply": "Enna kekanum nu sollungalen!"}

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are Sorna, a friendly AI. If user types in Tamil, reply in Tamil. For English, reply in English."
                },
                {
                    "role": "user",
                    "content": user_msg,
                }
            ],
            model="llama-3.3-70b-versatile",
        )

        reply = chat_completion.choices[0].message.content
        return {"reply": reply}

    except Exception as e:
        print(f"ERROR: {e}")
        return {"reply": "Server busy-ah iruku bro. Konjam kazhichu try pannunga!"}

if __name__ == "__main__":
    app.run(debug=True)