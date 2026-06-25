import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from backend.services.extraction import extract_bid_data
text = "This is a dummy bid document for test."
res = extract_bid_data(text)
print(res)
