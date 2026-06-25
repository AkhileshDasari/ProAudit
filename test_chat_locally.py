import requests
import json
try:
    res = requests.post("http://localhost:8000/chat", json={"message": "hello", "history": []})
    print(res.status_code)
    print(res.text)
except Exception as e:
    print(f"Error: {e}")
