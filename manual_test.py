import asyncio
from backend.services.pdf import extract_text_from_pdf
from backend.services.extraction import extract_bid_data
import os

# Use the file we know exists
FILE_PATH = "tenders/1713942557.pdf"

if os.path.exists(FILE_PATH):
    print(f"--- STARTING MANUAL TEST ON {FILE_PATH} ---")
    with open(FILE_PATH, "rb") as f:
        pdf_bytes = f.read()
    
    print("1. Extracting Text...")
    text = extract_text_from_pdf(pdf_bytes)
    
    if not text.strip():
        print("CRITICAL FAIL: No text extracted from PDF!")
    else:
        print("2. Sending to AI...")
        try:
            data = extract_bid_data(text)
            print("\n--- EXTRACTION RESULT ---")
            print(data.model_dump_json(indent=2))
        except Exception as e:
            print(f"AI FAIL: {e}")
else:
    print(f"Test file not found: {FILE_PATH}")
