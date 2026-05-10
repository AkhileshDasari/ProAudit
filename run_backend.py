import uvicorn
import os
import sys

if __name__ == "__main__":
    # Add the current directory to sys.path to ensure 'backend' module is found
    # regardless of where this script is run from.
    current_dir = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, current_dir)
    
    print(f"Starting ProcureAudit AI Backend...")
    print(f"Working Directory: {current_dir}")
    
    # Run Uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
