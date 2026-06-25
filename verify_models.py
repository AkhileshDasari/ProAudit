import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load env from my-agent directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, "my-agent", ".env"))

api_key = os.environ.get("GOOGLE_API_KEY")
groq_api_key = os.environ.get("GROQ_API_KEY")

if not api_key:
    print("WARNING: No Google API Key found in .env")
else:
    print(f"Testing Google API Key: {api_key[:5]}...{api_key[-5:]}")
    genai.configure(api_key=api_key)
    
    print("\nListing available Google models:")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
    except Exception as e:
        print(f"Error listing Google models: {e}")

if not groq_api_key:
    print("\nWARNING: No Groq API Key found in .env")
else:
    print(f"\nTesting Groq API Key: {groq_api_key[:5]}...{groq_api_key[-5:]}")
    try:
        import groq
        client = groq.Groq(api_key=groq_api_key)
        models = client.models.list()
        print("Listing available Groq models:")
        for m in models.data:
            print(f"- {m.id}")
    except Exception as e:
        print(f"Error testing Groq API: {e}")
