from backend.services.pdf import extract_text_from_pdf
import os

# Path to the first tender file explicitly mentioned or found in dir
file_path = "tenders/1713942557.pdf"

if os.path.exists(file_path):
    print(f"Testing extraction for: {file_path}")
    with open(file_path, "rb") as f:
        content = f.read()
        text = extract_text_from_pdf(content)
        print(f"Extracted Text Length: {len(text)}")
        if len(text) < 100:
            print("WARNING: Very little text extracted. This might be a scanned PDF (image-only).")
        else:
            print("SUCCESS: Text extraction looks good.")
            print("Sample start:", text[:200].replace('\n', ' '))
else:
    print(f"File not found: {file_path}")
