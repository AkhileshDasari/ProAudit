import os
import groq
from dotenv import load_dotenv

load_dotenv("my-agent/.env")
system_instruction = "You are a helpful assistant."
history = [{"sender": "user", "text": "hello"}]
message = "how are you?"

client = groq.Groq(api_key=os.environ.get("GROQ_API_KEY"))
messages = [{"role": "system", "content": system_instruction}]
for msg in history[-5:]:
    role = "user" if msg.get("sender") == "user" else "assistant"
    messages.append({"role": role, "content": msg.get("text", "")})
messages.append({"role": "user", "content": message})

try:
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages
    )
    print(completion.choices[0].message.content)
except Exception as e:
    print(f"Error: {e}")
