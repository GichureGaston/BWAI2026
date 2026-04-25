import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv("../.env")
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

print("Listing models that support generateContent...")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(f"Name: {m.name}")
