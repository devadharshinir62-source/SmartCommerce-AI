"""
Database Models for SmartCommerce AI
=====================================
Defines the SQLAlchemy database tables.
Here we define the 'Product' table with all product details, tags, specs, and features.
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, Text
from .database import Base

class Product(Base):
    """
    SQLAlchemy Model representing a Product in the store.
    """
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    brand = Column(String(100), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)  # e.g., 'Laptops', 'Smartphones', 'Audio', 'Accessories'
    price = Column(Float, nullable=False)                       # Current selling price in INR (₹)
    original_price = Column(Float, nullable=True)               # MRP / Original price for discount badge
    rating = Column(Float, default=4.0)                         # Star rating (1.0 to 5.0)
    review_count = Column(Integer, default=0)                   # Number of user reviews
    description = Column(Text, nullable=False)                  # Detailed product description
    features = Column(Text, nullable=True)                      # JSON string of key bullet highlights
    specs = Column(Text, nullable=True)                         # JSON string of technical specs (RAM, Storage, CPU, etc.)
    tags = Column(String(500), nullable=True)                   # Comma-separated search tags (coding, gaming, travel, etc.)
    image_url = Column(String(500), nullable=True)              # Product preview image URL
    in_stock = Column(Boolean, default=True)                    # Stock availability
    is_featured = Column(Boolean, default=False)                # Featured on homepage
