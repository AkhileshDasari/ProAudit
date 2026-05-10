import os
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from backend.services.pdf import extract_text_from_pdf
from backend.services.extraction import extract_bid_data
from backend.models import BidData, ComparisonResult

# Load env from my-agent directory (robust path)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, "my-agent", ".env"))

app = FastAPI(title="ProAudit AI Backend")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Procurement MVP Backend"}

from backend.services.docx_service import extract_text_from_docx

# ...

@app.post("/upload", response_model=BidData)
async def upload_bid(file: UploadFile = File(...)):
    """
    Upload a single PDF or DOCX bid, extract text, and parse parameters.
    """
    filename = file.filename.lower()
    if not (filename.endswith(".pdf") or filename.endswith(".docx") or filename.endswith(".doc")):
        raise HTTPException(status_code=400, detail="File must be a PDF or DOCX")
    
    try:
        # Save file to history (tenders directory)
        tenders_dir = os.path.join(BASE_DIR, "tenders")
        os.makedirs(tenders_dir, exist_ok=True)
        file_path = os.path.join(tenders_dir, filename)
        
        contents = await file.read()
        
        # Save to disk
        with open(file_path, "wb") as f:
            f.write(contents)
            
        text = ""
        
        if filename.endswith(".pdf"):
            text = extract_text_from_pdf(contents)
        elif filename.endswith(".docx") or filename.endswith(".doc"):
            # Note: .doc usually requires antiword or similar, but we'll try basic docx parser 
            # or assume user meant docx. strict .doc (binary) won't work with python-docx
            text = extract_text_from_docx(contents)
        
        print(f"DEBUG: Extracted text length for {filename}: {len(text)}") # LOG TEXT LENGTH
        
        if not text:
            print("ERROR: Text extraction returned empty string!")
            raise HTTPException(status_code=400, detail="Could not extract text from document")
            
        data = extract_bid_data(text)
        return data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@app.get("/history")
def list_history():
    """List all PDF files in the tenders directory."""
    tenders_dir = os.path.join(BASE_DIR, "tenders")
    if not os.path.exists(tenders_dir):
        return []
    
    files = [f for f in os.listdir(tenders_dir) if f.lower().endswith('.pdf') or f.lower().endswith('.docx')]
    return files

@app.post("/history/{filename}/analyze", response_model=BidData)
async def analyze_history_file(filename: str):
    """
    Analyze a file already stored in the tenders directory.
    """
    tenders_dir = os.path.join(BASE_DIR, "tenders")
    file_path = os.path.join(tenders_dir, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found in history")
        
    try:
        with open(file_path, "rb") as f:
            contents = f.read()
            
        text = ""
        if filename.lower().endswith(".pdf"):
            text = extract_text_from_pdf(contents)
        elif filename.lower().endswith(".docx") or filename.lower().endswith(".doc"):
            text = extract_text_from_docx(contents)
            
        if not text:
            raise HTTPException(status_code=400, detail="Could not extract text from document")
            
        data = extract_bid_data(text)
        # Inject filename as vendor name if not found, or just ensuring consistency
        # data.vendor_name = filename # Optional overrides
        return data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

from pydantic import BaseModel
class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []

from backend.services.chat_service import chat_with_ai

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """
    Chat with the Procurement AI.
    """
    response = chat_with_ai(request.message, request.history)
    return {"response": response}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
