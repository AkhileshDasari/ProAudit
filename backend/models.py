from pydantic import BaseModel, Field
from typing import Optional, Union, List

class ParameterStatus(BaseModel):
    status: str  # "found", "not_found", "unclear", "partial", "provisional"
    confidence: Optional[str] = None # "high", "medium", "low"
    evidence: Optional[str] = None # Quote from text

class Turnover(ParameterStatus):
    value: Optional[float] = None
    unit: Optional[str] = "INR" # Normalized to INR
    original_text: Optional[str] = None

class Certification(ParameterStatus):
    has_iso_9001: bool = False
    other_certs: List[str] = []

class Experience(ParameterStatus):
    project_count: Optional[int] = None
    years: Optional[int] = None

class DeliveryTimeline(ParameterStatus):
    days: Optional[int] = None
    original_text: Optional[str] = None

class AdminDocs(ParameterStatus):
    has_gst: bool = False
    has_pan: bool = False
    has_emd: bool = False # Keeping for compatibility, but moving detailed EMD to separate struct
    missing_docs: List[str] = []

class EMD(ParameterStatus):
    amount: Optional[float] = None
    payment_mode: Optional[str] = None # BG, DD, Online
    original_text: Optional[str] = None

class Blacklisting(ParameterStatus):
    is_blacklisted: bool = False # If they declare they ARE blacklisted
    declaration_found: bool = False
    evidence: Optional[str] = None

class Warranty(ParameterStatus):
    duration_months: Optional[int] = None
    original_text: Optional[str] = None

class Solvency(ParameterStatus):
    amount: Optional[float] = None
    original_text: Optional[str] = None

class MII(ParameterStatus):
    local_content_percent: Optional[float] = None
    class_type: Optional[str] = None # Class-I, Class-II
    original_text: Optional[str] = None

class BasicDetails(BaseModel):
    tender_no: Optional[str] = None
    bid_date: Optional[str] = None
    total_bid_value: Optional[str] = None
    vendor_address: Optional[str] = None
    validity_period: Optional[str] = None
    organization_name: Optional[str] = None # NEW: e.g. "Indian Railways"
    tender_title: Optional[str] = None # NEW: e.g. "Supply of Steel"

class BidData(BaseModel):
    vendor_name: str = "Unknown Vendor"
    basic_details: BasicDetails = Field(default_factory=BasicDetails)
    turnover: Turnover = Field(default_factory=lambda: Turnover(status="not_found"))
    certification: Certification = Field(default_factory=lambda: Certification(status="not_found"))
    experience: Experience = Field(default_factory=lambda: Experience(status="not_found"))
    delivery: DeliveryTimeline = Field(default_factory=lambda: DeliveryTimeline(status="not_found"))
    admin_docs: AdminDocs = Field(default_factory=lambda: AdminDocs(status="not_found"))
    emd: EMD = Field(default_factory=lambda: EMD(status="not_found"))
    blacklisting: Blacklisting = Field(default_factory=lambda: Blacklisting(status="not_found"))
    warranty: Warranty = Field(default_factory=lambda: Warranty(status="not_found"))
    solvency: Solvency = Field(default_factory=lambda: Solvency(status="not_found"))
    mii: MII = Field(default_factory=lambda: MII(status="not_found"))

class ComparisonResult(BaseModel):
    bids: List[BidData]
