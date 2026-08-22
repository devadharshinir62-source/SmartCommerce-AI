"""
FastAPI Application Entry Point for SmartCommerce AI
====================================================
Configures FastAPI routes, CORS middleware, database seeding, and REST endpoints.
"""

from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, Base, get_db
from .models import Product
from .schemas import (
    ProductResponse, 
    RequirementRequest, 
    RecommendationResponse,
    ChatRequest,
    ChatResponse
)
from .seed_data import seed_database_if_empty
from .recommender import analyze_and_recommend
from .chatbot import handle_chat_query, format_product_response

# Initialize SQLite database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app instance
app = FastAPI(
    title="SmartCommerce AI - Backend API",
    description="AI-Powered E-Commerce Shopping Assistant & Recommendation Engine",
    version="1.0.0"
)

# Configure CORS so frontend (React Vite at localhost:5173) can access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup Event to seed database with rich sample data if empty
@app.on_event("startup")
def on_startup():
    db = next(get_db())
    try:
        seed_database_if_empty(db)
    finally:
        db.close()

# -------------------------------------------------------------
# API Endpoints
# -------------------------------------------------------------

@app.get("/")
def root():
    """Root status check endpoint."""
    return {
        "status": "online",
        "app": "SmartCommerce AI API",
        "version": "1.0.0",
        "endpoints": [
            "/api/products",
            "/api/products/{id}",
            "/api/recommend",
            "/api/chat",
            "/api/categories"
        ]
    }

@app.get("/api/products", response_model=List[ProductResponse])
def get_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Keyword search in name/description"),
    max_price: Optional[float] = Query(None, description="Maximum budget in INR"),
    min_rating: Optional[float] = Query(None, description="Minimum star rating"),
    db: Session = Depends(get_db)
):
    """
    Retrieve product catalog with optional filtering by category, search term, price, and rating.
    """
    query = db.query(Product)

    if category and category.lower() != "all":
        query = query.filter(Product.category.ilike(f"%{category}%"))

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Product.name.ilike(search_pattern)) |
            (Product.description.ilike(search_pattern)) |
            (Product.tags.ilike(search_pattern)) |
            (Product.brand.ilike(search_pattern))
        )

    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    if min_rating is not None:
        query = query.filter(Product.rating >= min_rating)

    products = query.all()
    return [format_product_response(p) for p in products]

@app.get("/api/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """
    Get detailed information for a single product by ID.
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return format_product_response(product)

@app.get("/api/categories")
def get_categories(db: Session = Depends(get_db)):
    """
    Get list of unique categories and count of products in each category.
    """
    products = db.query(Product).all()
    categories = {}
    for p in products:
        categories[p.category] = categories.get(p.category, 0) + 1

    return {
        "categories": ["All"] + sorted(list(categories.keys())),
        "counts": categories
    }

@app.post("/api/recommend", response_model=RecommendationResponse)
def recommend_products(req: RequirementRequest, db: Session = Depends(get_db)):
    """
    Main AI Recommendation Endpoint.
    Accepts natural language user requirements (e.g. 'I need a laptop for coding under ₹60,000')
    and returns scored recommendations with match explanations.
    """
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    return analyze_and_recommend(req.query, db)

@app.post("/api/chat", response_model=ChatResponse)
def chat_assistant(req: ChatRequest, db: Session = Depends(get_db)):
    """
    AI Shopping Assistant Chatbot Endpoint.
    Handles follow-up questions, comparisons, and product advice.
    """
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    return handle_chat_query(req, db)
