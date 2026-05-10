import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()  # .env file-la irukka key load agum

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
# Groq-la available models list panna
models = client.models.list()

print("Available models for your Groq API key:\n")
for model in models.data:
    print("ID:", model.id)
    print("Created:", model.created)
    print("-" * 40)