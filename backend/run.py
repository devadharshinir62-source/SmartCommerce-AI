"""
Backend Server Runner for SmartCommerce AI
==========================================
Run this file to start the FastAPI Uvicorn server on http://localhost:8000
"""

import uvicorn

if __name__ == "__main__":
    print("[INFO] Starting SmartCommerce AI Backend Server on http://localhost:8000 ...")
    print("[INFO] Interactive API Docs available at http://localhost:8000/docs")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
