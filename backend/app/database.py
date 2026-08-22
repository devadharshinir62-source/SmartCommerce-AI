"""
Database Configuration for SmartCommerce AI
============================================
This module sets up the SQLite database connection using SQLAlchemy.
SQLite is a lightweight, serverless database that stores all data in a single file ('smartcommerce.db').
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Define database file path in the backend directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "smartcommerce.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

# Create SQLAlchemy engine
# connect_args={"check_same_thread": False} is needed specifically for SQLite in multi-threaded FastAPI
engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False}
)

# SessionLocal class for creating isolated database sessions per request
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for database models to inherit from
Base = declarative_base()

def get_db():
    """
    Dependency generator for FastAPI routes.
    Yields a database session and ensures it is safely closed after the request completes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
