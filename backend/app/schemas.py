"""
Pydantic Schemas for SmartCommerce AI
======================================
Defines data validation schemas for FastAPI request and response payloads.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# --- Product Schemas ---

class ProductBase(BaseModel):
    name: str
    brand: str
    category: str
    price: float
    original_price: Optional[float] = None
    rating: float = 4.0
    review_count: int = 0
    description: str
    features: Optional[List[str]] = []
    specs: Optional[Dict[str, str]] = {}
    tags: Optional[List[str]] = []
    image_url: Optional[str] = None
    in_stock: bool = True
    is_featured: bool = False

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True

# --- Recommendation Schemas ---

class RequirementRequest(BaseModel):
    query: str = Field(
        ..., 
        description="Natural language shopping requirement, e.g., 'I need a laptop for coding under ₹60,000'"
    )

class ExtractedCriteria(BaseModel):
    original_query: str
    category: Optional[str] = None
    max_budget: Optional[float] = None
    min_budget: Optional[float] = None
    intent_tags: List[str] = []
    preferred_brands: List[str] = []
    min_rating: Optional[float] = None

class ScoredProduct(ProductResponse):
    match_score: int = Field(..., description="Match percentage score (0-100)")
    match_reasons: List[str] = Field(default_factory=list, description="Reasons why this product was recommended")
    ai_badge: Optional[str] = Field(None, description="Tag like 'Top Match', 'Best Value', 'Budget Pick'")

class RecommendationResponse(BaseModel):
    query: str
    criteria: ExtractedCriteria
    recommendation_summary: str
    total_matches: int
    recommendations: List[ScoredProduct]

# --- Chatbot Schemas ---

class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str

class ChatRequest(BaseModel):
    message: str = Field(..., description="User's query or follow-up question")
    history: Optional[List[ChatMessage]] = []
    context_product_id: Optional[int] = None

class ChatResponse(BaseModel):
    reply: str
    suggested_followups: List[str] = []
    related_products: Optional[List[ProductResponse]] = []
