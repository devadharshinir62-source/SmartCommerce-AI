# 🛒 SmartCommerce AI — AI-Powered Shopping Assistant

**SmartCommerce AI** is a full-stack intelligent e-commerce shopping assistant web application. Users can express their shopping requirements in plain natural language (for example: *"I need a laptop for coding under ₹60,000"*), and the system analyzes their budget, category, and usage intent to recommend the best matching products from an SQLite database, complete with match explanations and an interactive shopping assistant chatbot.

---

## 🌟 Core Features

1. **Modern Responsive UI**: Clean, glassmorphism dark-mode interface built with React, Vite, and Tailwind CSS.
2. **Natural Language Requirement Search**: Analyzes queries like *"I need a laptop for coding under ₹60,000"* or *"Best noise cancelling headphones under ₹15,000"*.
3. **AI Recommendation Engine**:
   - Extracts category, budget in INR (₹), brand preferences, and usage intent (coding, gaming, battery, camera, ANC, lightweight).
   - Generates match scores (0-100%) and explains *why* each product was picked.
4. **Interactive AI Shopping Chatbot**:
   - Answers follow-up questions about specifications, comparisons (*"Compare Lenovo vs ASUS"*), and developer advice.
   - Context-aware: Click **"Ask AI"** on any product card to discuss that specific product.
5. **Pre-Seeded SQLite Product Database**:
   - Realistic catalog of Laptops, Smartphones, Audio/Headphones, Mechanical Keyboards, Ergonomic Mice, and 4K Monitors with INR (₹) prices.

---

## 🏗️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React Icons
- **Backend**: Python 3, FastAPI, Uvicorn, SQLAlchemy, Pydantic v2
- **Database**: SQLite (`smartcommerce.db`)

---

## 📁 Project Structure

```
smart commerce ai/
├── backend/
│   ├── app/
│   │   ├── __init__.py         # App package identifier
│   │   ├── database.py         # SQLite engine & SQLAlchemy session management
│   │   ├── models.py           # Product table definition with specs and tags
│   │   ├── schemas.py          # Pydantic models for validation and responses
│   │   ├── seed_data.py        # Realistic electronics catalog with INR (₹) prices
│   │   ├── recommender.py      # Natural language parser & product scoring engine
│   │   ├── chatbot.py          # Context-aware conversational shopping assistant
│   │   └── main.py             # FastAPI REST routes, CORS & startup seed handler
│   ├── requirements.txt        # Python backend dependencies
│   └── run.py                  # Backend server starter script
│
├── frontend/
│   ├── index.html              # HTML shell with Google fonts
│   ├── package.json            # Node.js dependencies and build scripts
│   ├── vite.config.js          # Vite development server configuration
│   ├── tailwind.config.js      # Tailwind theme and brand color palette
│   ├── postcss.config.js       # PostCSS processor config
│   └── src/
│       ├── main.jsx            # React root mount
│       ├── App.jsx             # Main container: search state, catalog, chatbot
│       ├── index.css           # Tailwind base styles and glassmorphism utilities
│       ├── api/
│       │   └── api.js          # API client for FastAPI endpoints
│       └── components/
│           ├── Header.jsx      # Top navigation with live stats & chat trigger
│           ├── HeroSearch.jsx  # Natural language search input & prompt chips
│           ├── ProductCard.jsx # Product card with specs, ratings, and match tags
│           ├── ProductList.jsx # Responsive product grid and AI summary banner
│           ├── FilterBar.jsx   # Category filter tabs and sorting options
│           ├── ChatBot.jsx     # Floating conversational assistant modal
│           └── Footer.jsx      # Clean tech stack footer
└── README.md                   # Full documentation & setup guide
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.10+** (Tested on Python 3.13)
- **Node.js 18+** & **npm**

---

### Step 1: Set Up & Run the Backend (FastAPI)

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the FastAPI backend server:
   ```bash
   python run.py
   ```
   > Backend will run at **`http://localhost:8000`**  
   > Interactive API documentation is at **`http://localhost:8000/docs`**

---

### Step 2: Set Up & Run the Frontend (React + Vite)

1. Open a **second terminal** and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   > Frontend will run at **`http://localhost:5173`**

4. Open your browser and navigate to **`http://localhost:5173`** to use SmartCommerce AI!

---

## 🧪 Try These Example Queries

- 💻 *"I need a laptop for coding under ₹60,000"*
- 📱 *"Best smartphone with great camera under ₹30,000"*
- 🎧 *"Sony noise cancelling headphones for deep focus"*
- ⌨️ *"Wireless mechanical keyboard for programming"*
- 🖥️ *"4K monitor for multi-window development under ₹25,000"*
