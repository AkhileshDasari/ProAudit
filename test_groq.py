import os
import groq
from dotenv import load_dotenv

load_dotenv("my-agent/.env")

client = groq.Groq(api_key=os.environ.get("GROQ_API_KEY"))
try:
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": "Hello in JSON"}
        ],
        response_format={"type": "json_object"}
    )
    print(completion.choices[0].message.content)
except Exception as e:
    print(f"Error: {e}")
