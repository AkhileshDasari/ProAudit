import json
import os
import google.generativeai as genai
from typing import Optional
from backend.models import BidData

from dotenv import load_dotenv

# Configure GenAI
# Robustly load .env to ensure key is present even if main.py didn't load it
def configure_genai():
    api_key = os.environ.get("GOOGLE_API_KEY")
    
    if not api_key:
        print("DEBUG: Key not found in env, attempting manual load...")
        # Path from backend/services/extraction.py to my-agent/.env
        # .../backend/services/extraction.py -> services -> backend -> frontend
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        env_path = os.path.join(base_dir, "my-agent", ".env")
        print(f"DEBUG: Loading .env from {env_path}")
        load_dotenv(env_path)
        api_key = os.environ.get("GOOGLE_API_KEY")

    if not api_key:
        print("CRITICAL: GOOGLE_API_KEY not found even after manual load.")
    else:
        print(f"DEBUG: GOOGLE_API_KEY found (length {len(api_key)}). Configuring GenAI.")
        genai.configure(api_key=api_key)

def extract_bid_data(text: str) -> BidData:
    """
    Extracts bid parameters from raw text using Gemini.
    """
    configure_genai()
    
    # Solid Instructions for the Agent (Gate Parameter / Signal Detection Mode)
    system_instruction = """
    You are an expert Government Procurement Analyst AI. 
    Your goal is to perform a 'Gate Check' on vendor bids. 
    
    PRINCIPLE: "NO BID FAILS INGESTION UNLESS IT HAS ZERO LEGAL IDENTITY."
    
    If exact values are missing, look for *signals* of compliance (provisional pass).

    PARAMETERS TO EXTRACT:

    0. **Basic Bid Details** (Header Info)
       - **Organization Name**: Look for the Authority Name at top (e.g. "Ministry of...", "Corporation Ltd").
       - **Tender Title**: Description of work/Project Name.
       - **Tender Reference No**: "Tender No", "NIT No", "GEM ID".
       - **Bid Submission Date**: "Due Date", "Closing Date", "Submitted on".
       - **Total Bid Value**: "Total Amount", "Quoted Price".
       - **Vendor Address**: Address of the bidder.
       - **Validity Period**: "Bid Validity".

    1. **Turnover** (Signal: Financial Strength)
       - EXACT: precise INR value, "Average Annual Turnover".
       - SIGNAL: "Balance Sheet", "profit and loss account", "financial capabilities", "Audited Accounts".
       - RULE: If explicit turnover value is found, extract it. If balance sheets are attached without explicit summary, mark as "provisional" with evidence "Balance sheets attached".

    2. **ISO 9001** (Signal: Quality Assurance)
       - EXACT: "ISO 9001:2015", "ISO 9001".
       - SIGNAL: "Quality Management System", "QMS", "Certified Firm", "Accredited".
       - RULE: If "ISO" is mentioned in context of "will submit" or "undertaking", mark "provisional". If certification number/date found, mark "found".

    3. **Experience** (Signal: Capability Evidence)
       - EXACT: "Past Experience", "Work Orders".
       - SIGNAL: "Client list", "Successfully exported", "Supplied to", "completion certificates".
       - RULE: Look for keywords like "executed", "completed", "ongoing". If any list of past works exists, mark "found".

    4. **Delivery** (Signal: Commitment)
       - EXACT: "Delivery Schedule", "Timeline".
       - SIGNAL: "Within x weeks", "shipment", "dispatch", "lead time".
       - RULE: Any mention of time duration (Weeks, Days, Months) near "supply" or "delivery" counts as Found.

    5. **Admin Docs** (Signal: Identity)
       - MANDATORY: Search for Vendor Name, GST, PAN, Address. 
       - RULE: If GST number (15 digits) or PAN (10 chars) is found anywhere, mark "found".

    6. **EMD / Bid Security** (Signal: serious intent)
        - Look for "EMD", "Earnest Money Deposit", "Bank Guarantee", "DD", "Demand Draft".
        - RULE: If an amount (Rupees, Rs.) is mentioned near EMD, or "Exempt" is mentioned (MSME/Start-up), mark "found".

    7. **Blacklisting Declaration** (Signal: Integrity)
        - Look for "Not Blacklisted", "Non-Debarment", "Declaration regarding blacklisting", "Affidavit".
        - RULE: If a self-declaration or affidavit format is present/mentioned, mark "found".
        
    8. **Warranty** (Signal: Support)
        - Look for "Warranty", "Guarantee", "Defect Liability Period", "DLP", "AMC".
        - RULE: "Standard Warranty", "12 months", "1 year" -> found.
        
    9. **Solvency** (Signal: Financial Health)
        - Look for "Solvency Certificate", "Banker's Certificate", "Financial Health".
        
    10. **Make in India (MII)** (Signal: Local Content)
        - Look for "Class-I", "Class-II", "Local Content", "MII", "Public Procurement (Preference to Make in India)".
        - RULE: If "Local Content" % is mentioned, mark found.

    CRITICAL RULES:
    CRITICAL RULES:
    - Never return valid JSON with missing top-level keys.
    - If a section is empty, return status: "not_found".
    - BE GENEROUS: If you see *any* mention of the requirement being met (e.g. "Enclosed", "Attached", "Yes", "Complied"), mark it as "found" or "provisional". Do not mark "not_found" if there is ambiguity.

    REQUIRED JSON STRUCTURE (Example):
    {
      "vendor_name": "ABC Corp",
      "basic_details": {
        "tender_no": "123", "bid_date": "2023-01-01", 
        "total_bid_value": "1 Cr", "organization_name": "Org", "tender_title": "Title"
      },
      "turnover": { "status": "found", "value": 500000, "evidence": "Balance sheet found" },
      ... (other keys: certification, experience, delivery, admin_docs, emd, blacklisting, warranty, solvency, mii)
    }
    """

    # Truncation Reverted: Sending FULL text as per user request (User has updated API Key)
    prompt = f"""
    {system_instruction}

    Analyze the following BID DOCUMENT TEXT and output the JSON strictly adhering to the schema.
    
    IMPORTANT: 
    - You must read the ENTIRE text below.
    - For every "found" or "provisional" status, you MUST provide a short 'evidence' quote from the text.
    - If you are not 100% sure a specific numeric value (like Turnover) is correct, look for a "Balance Sheet" or "Financial Summary" table.

    BID DOCUMENT TEXT:
    {text}
    """

    try:
        # Debug: Check if key is present
        if not os.environ.get("GOOGLE_API_KEY"):
             print("CRITICAL: GOOGLE_API_KEY is missing!")
        
        # Robust Model Selection Strategy with Retry Logic
        model = None
        try_models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-flash-latest']
        
        response = None
        last_error = None
        import time

        for model_name in try_models:
            retries = 3
            for attempt in range(retries):
                try:
                    print(f"Attempting with {model_name} (Try {attempt+1}/{retries})")
                    model = genai.GenerativeModel(model_name)
                    response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
                    if response:
                        break # Success
                except Exception as e:
                    print(f"Failed with {model_name}: {e}")
                    last_error = e
                    if "429" in str(e) or "quota" in str(e).lower():
                        wait_time = 10 * (attempt + 1) # 10s, 20s, 30s
                        print(f"Rate limit hit. Waiting {wait_time}s...")
                        time.sleep(wait_time) # Backoff
                    else:
                        break # Move to next model if not a rate limit issue (e.g. invalid key)
            
            if response:
                break # Exit model loop if success

        if not response:
            raise last_error or Exception("All models failed")

        # Parse JSON
        print(f"DEBUG: Raw LLM Response: {response.text}") # LOG RAW RESPONSE
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        
        try:
            data_dict = json.loads(clean_text)
            print(f"DEBUG: Parsed JSON: {json.dumps(data_dict, indent=2)}") # LOG PARSED JSON
        except json.JSONDecodeError as je:
            print(f"JSON Parse Error: {je}")
            print(f"Failed Text: {clean_text}")
            # Fallback for empty/bad JSON response
            return BidData(vendor_name="Parsing Error", turnover={"status": "error", "evidence": "Invalid JSON from AI"})

        # FIX: Unwrap nested dictionaries if the LLM wrapped the response
        if "turnover" not in [k.lower() for k in data_dict.keys()]:
            for wrapper in ["audit_results", "extraction_results", "bid_analysis", "output"]:
                if wrapper in data_dict:
                    print(f"DEBUG: Unwrapping response from '{wrapper}' key")
                    data_dict = data_dict[wrapper]
                    break
            else:
                if len(data_dict) == 1 and isinstance(list(data_dict.values())[0], dict):
                    inner_key = list(data_dict.keys())[0]
                    print(f"DEBUG: Auto-unwrapping response from '{inner_key}' key")
                    data_dict = data_dict[inner_key]

        # FIX: Normalize keys to lowercase and partial matches
        normalized_data = {}
        key_mapping = {
            "turnover": "turnover", "certification": "certification", 
            "experience": "experience", "delivery": "delivery",
            "admin_docs": "admin_docs", "admindocs": "admin_docs",
            "vendor_name": "vendor_name", "vendorname": "vendor_name",
            "emd": "emd", "blacklisting": "blacklisting",
            "warranty": "warranty", "solvency": "solvency", "mii": "mii",
            "basic_details": "basic_details", "basicdetails": "basic_details", 
            "details": "basic_details", "basic bid details": "basic_details"
        }

        for k, v in data_dict.items():
            k_lower = k.lower().strip()
            # Direct map
            if k_lower in key_mapping:
                normalized_data[key_mapping[k_lower]] = v
            # Fuzzy map for "Basic Bid Details" etc
            elif "basic" in k_lower and "details" in k_lower:
                 normalized_data["basic_details"] = v
            else:
                normalized_data[k_lower] = v
        
        return BidData(**normalized_data)

    except Exception as e:
        print(f"Extraction Error details: {e}")
        # Return a structured error object so the UI shows "Extraction Failed" instead of crashing
        return BidData(
            vendor_name="Extraction Failed",
            turnover={"status": "error", "evidence": f"Error: {str(e)}", "value": 0},
            certification={"status": "error", "has_iso_9001": False},
            experience={"status": "error", "project_count": 0},
            delivery={"status": "error", "days": 0},
            admin_docs={"status": "error", "missing_docs": ["Processing Failed"]}
        )
