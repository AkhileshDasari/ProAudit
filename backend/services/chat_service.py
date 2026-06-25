import google.generativeai as genai
import os
from backend.services.extraction import configure_genai

def chat_with_ai(message: str, history: list) -> str:
    """
    Context-aware chat with the AI about procurement.
    """
    configure_genai()
    
    system_instruction = """
    You are 'ProAudit Assistant', an expert AI in Government Procurement, Compliance, and Auditing.
    
    YOUR MANDATE:
    1.  **Strict Scope**: ONLY answer questions related to:
        - Bids, Tenders, Vendors, Request for Proposals (RFP).
        - Procurement Compliance (General Financial Rules, CVC guidelines).
        - Audits, Financial Evaluations, Technical Parameters.
        - Using this application (ProAudit AI).
        
    2.  **Refusal Policy**: If a user asks about anything else (e.g. sports, movies, general life advice, coding irrelevant to procurement), politely refuse using a variation of:
        "I am designed to assist only with procurement and compliance tasks. Please ask me about your tenders or bids."
        
    3.  **Tone**: Professional, precise, yet helpful.
    """
    
    # Construct history for context
    # Gemini 1.5/2.0 supports chat history objects, but for simplicity/stateless REST logic, we might just append context
    # or use the proper ChatSession if we were keeping state. 
    # For this MVP, we will feed recent history as context.
    
    chat_context = f"{system_instruction}\n\nRecent Conversation:\n"
    for msg in history[-5:]: # Keep last 5 messages for context window
        role = "User" if msg.get("sender") == "user" else "Assistant"
        chat_context += f"{role}: {msg.get('text')}\n"
        
    chat_context += f"User: {message}\nAssistant:"
    
    # Robust Model Selection Strategy (copied from extraction.py)
    try_models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-flash-latest', 'gemini-pro']
    
    response_text = None
    last_error = None
    import time

    if os.environ.get("GOOGLE_API_KEY"):
        for model_name in try_models:
            try:
                print(f"DEBUG: Chat attempting with {model_name}...")
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(chat_context)
                if response:
                    response_text = response.text.strip()
                    break # Success
            except Exception as e:
                print(f"DEBUG: Chat Failed with {model_name}: {e}")
                last_error = e
                if "429" in str(e) or "quota" in str(e).lower():
                    if os.environ.get("GROQ_API_KEY"):
                        print("DEBUG: Google quota hit. Skipping to Groq immediately.")
                        break
                    else:
                        time.sleep(2) # Brief backoff
                else:
                    break # Try next model or fallback
                    
    # Fallback to Groq if Google failed or key is missing
    if not response_text and os.environ.get("GROQ_API_KEY"):
        print("DEBUG: Chat falling back to Groq API...")
        try:
            import groq
            client = groq.Groq(api_key=os.environ.get("GROQ_API_KEY"))
            
            # Format history for Groq
            messages = [{"role": "system", "content": system_instruction}]
            for msg in history[-5:]:
                role = "user" if msg.get("sender") == "user" else "assistant"
                messages.append({"role": role, "content": msg.get("text", "")})
            messages.append({"role": "user", "content": message})
            
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages
            )
            response_text = completion.choices[0].message.content.strip()
            print("DEBUG: Groq chat successfully generated.")
        except Exception as e:
            print(f"DEBUG: Groq Chat fallback failed: {e}")
            last_error = e
    
    if response_text:
        return response_text
    
    # If all failed, return the specific error for debugging
    print(f"CRITICAL: All chat models failed. Last error: {last_error}")
    return f"I'm having trouble connecting. Error details: {str(last_error)}"
