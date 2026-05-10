import pypdf
import io

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extracts text from a PDF file (bytes) using pypdf.
    Returns a single string containing all text.
    """
    try:
        # Create a file-like object from bytes
        file_obj = io.BytesIO(file_bytes)
        reader = pypdf.PdfReader(file_obj)
        
        text = ""
        for page in reader.pages:
            result = page.extract_text()
            if result:
                text += result + "\n"
        
        print(f"DEBUG: Extracted {len(text)} characters from PDF.")
        print(f"DEBUG: Text Snippet: {text[:200]}...")
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""
