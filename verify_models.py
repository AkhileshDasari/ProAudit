import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load env from my-agent directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, "my-agent", ".env"))

api_key = os.environ.get("GOOGLE_API_KEY")

if not api_key:
    print("ERROR: No API Key found in .env")
else:
    print(f"Testing API Key: {api_key[:5]}...{api_key[-5:]}")
    genai.configure(api_key=api_key)
    
    print("\nListing available models:")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
    except Exception as e:
        print(f"Error listing models: {e}")
