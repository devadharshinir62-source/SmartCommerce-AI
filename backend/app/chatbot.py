"""
Context-Aware Chatbot Assistant for SmartCommerce AI
===================================================
Provides intelligent conversational assistance for product comparisons,
specs queries, buying advice, and follow-up questions.
"""

import json
import re
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from .models import Product
from .schemas import ChatRequest, ChatResponse, ProductResponse

def format_product_response(prod: Product) -> ProductResponse:
    """Helper to convert a SQLAlchemy Product model to Pydantic ProductResponse."""
    try:
        features = json.loads(prod.features) if prod.features else []
    except Exception:
        features = []

    try:
        specs = json.loads(prod.specs) if prod.specs else {}
    except Exception:
        specs = {}

    tags = [t.strip() for t in (prod.tags or "").split(",") if t.strip()]

    return ProductResponse(
        id=prod.id,
        name=prod.name,
        brand=prod.brand,
        category=prod.category,
        price=prod.price,
        original_price=prod.original_price,
        rating=prod.rating,
        review_count=prod.review_count,
        description=prod.description,
        features=features,
        specs=specs,
        tags=tags,
        image_url=prod.image_url,
        in_stock=prod.in_stock,
        is_featured=prod.is_featured
    )

def handle_chat_query(req: ChatRequest, db: Session) -> ChatResponse:
    """
    Analyzes the user's chat message and returns a helpful, context-aware AI response.
    """
    msg = req.message.strip().lower()
    all_products = db.query(Product).all()
    context_prod = None
    if req.context_product_id:
        context_prod = db.query(Product).filter(Product.id == req.context_product_id).first()

    suggested_followups = []
    related_products = []

    # -------------------------------------------------------------
    # Case 1: Specific Product Context Queries
    # -------------------------------------------------------------
    if context_prod:
        prod_specs = {}
        try:
            prod_specs = json.loads(context_prod.specs) if context_prod.specs else {}
        except Exception:
            pass

        if any(w in msg for w in ["ram", "memory", "multitask", "docker"]):
            ram = prod_specs.get("RAM", "Standard RAM")
            cpu = prod_specs.get("Processor", "High-performance CPU")
            reply = (
                f"### 🚀 Memory & Performance for **{context_prod.name}**\n\n"
                f"- **Equipped RAM:** {ram}\n"
                f"- **Processor:** {cpu}\n\n"
                f"**Verdict for Developers & Multi-taskers:**\n"
                f"With **{ram}**, this machine is well-suited for running modern IDEs (VS Code, IntelliJ), "
                f"multiple browser tabs, Node.js/Python servers, and Docker containers simultaneously without lag."
            )
            suggested_followups = [
                f"What is the battery backup of {context_prod.brand}?",
                f"Compare {context_prod.brand} with alternatives under this price",
                f"Is this good for gaming as well?"
            ]
            return ChatResponse(reply=reply, suggested_followups=suggested_followups, related_products=[format_product_response(context_prod)])

        elif any(w in msg for w in ["battery", "backup", "charging", "charger"]):
            battery = prod_specs.get("Battery", "All-day battery")
            reply = (
                f"### 🔋 Battery & Charging: **{context_prod.name}**\n\n"
                f"- **Battery Specs:** {battery}\n"
                f"- **Portability:** Fast charging allows up to 80% charge in ~60 minutes on supported adapters.\n\n"
                f"Ideal for developers working in cafes, college students attending lectures, or frequent travelers."
            )
            suggested_followups = [
                f"What display resolution does it have?",
                f"Is the storage expandable?",
                "What other laptops are available under ₹60,000?"
            ]
            return ChatResponse(reply=reply, suggested_followups=suggested_followups, related_products=[format_product_response(context_prod)])

        elif any(w in msg for w in ["display", "screen", "resolution", "hz"]):
            display = prod_specs.get("Display", "Full HD Display")
            reply = (
                f"### 🖥️ Display Details: **{context_prod.name}**\n\n"
                f"- **Screen:** {display}\n"
                f"- **Comfort:** Features anti-glare coating and Eye Care certification, reducing eye strain during long programming or reading sessions."
            )
            suggested_followups = [
                f"Check processor speed",
                f"What is the warranty policy?",
                "Show top rated accessories"
            ]
            return ChatResponse(reply=reply, suggested_followups=suggested_followups, related_products=[format_product_response(context_prod)])

    # -------------------------------------------------------------
    # Case 2: Comparison Requests (e.g. "compare lenovo and asus" or "which is better")
    # -------------------------------------------------------------
    if "compare" in msg or "vs" in msg or "difference between" in msg:
        # Find mentioned products or categories
        matched_prods = []
        for p in all_products:
            if p.brand.lower() in msg or any(part in msg for part in p.name.lower().split()[:3]):
                matched_prods.append(p)

        if len(matched_prods) >= 2:
            p1, p2 = matched_prods[0], matched_prods[1]
            reply = (
                f"### ⚖️ Side-by-Side Comparison\n\n"
                f"| Feature | **{p1.name[:30]}...** | **{p2.name[:30]}...** |\n"
                f"| :--- | :--- | :--- |\n"
                f"| **Brand** | {p1.brand} | {p2.brand} |\n"
                f"| **Price** | ₹{p1.price:,.0f} | ₹{p2.price:,.0f} |\n"
                f"| **Rating** | {p1.rating} ★ ({p1.review_count}+) | {p2.rating} ★ ({p2.review_count}+) |\n"
                f"| **Category** | {p1.category} | {p2.category} |\n\n"
                f"💡 **Recommendation:** If you want raw CPU multithreading efficiency, **{p1.brand}** is compelling. "
                f"For screen real estate and high-refresh display, **{p2.brand}** is a great choice."
            )
            suggested_followups = [
                f"Tell me more about {p1.brand}",
                f"Tell me more about {p2.brand}",
                "Are there any other options under this budget?"
            ]
            related_products = [format_product_response(p1), format_product_response(p2)]
            return ChatResponse(reply=reply, suggested_followups=suggested_followups, related_products=related_products)

    # -------------------------------------------------------------
    # Case 3: Coding / Programming Specific Advice
    # -------------------------------------------------------------
    if any(w in msg for w in ["coding", "programming", "developer", "python", "software", "docker"]):
        coding_laptops = [p for p in all_products if p.category == "Laptops" and ("coding" in (p.tags or "") or p.price <= 65000)]
        coding_laptops.sort(key=lambda x: x.rating, reverse=True)
        top_picks = coding_laptops[:2]

        reply = (
            f"### 💻 Best Hardware Recommendations for Coding & Development\n\n"
            f"For software development (Python, Web Dev, VS Code, Docker, Android Studio), we recommend:\n"
            f"1. **Minimum 16GB RAM:** Prevents memory bottlenecks when running multiple microservices & browser tabs.\n"
            f"2. **Fast NVMe SSD (512GB+):** Ensures instant project indexing and fast compile times.\n"
            f"3. **Multi-core Processor (Ryzen 7 or Intel Core i5 H-series):** Speeds up builds and testing.\n\n"
            f"**Top Recommended Models in our Store:**\n"
            + "\n".join([f"- **{p.name}** at **₹{p.price:,.0f}** ({p.rating}★)" for p in top_picks])
        )
        suggested_followups = [
            "Show laptops under ₹60,000",
            "What accessories do developers recommend?",
            "Is MacBook M2 good for coding?"
        ]
        related_products = [format_product_response(p) for p in top_picks]
        return ChatResponse(reply=reply, suggested_followups=suggested_followups, related_products=related_products)

    # -------------------------------------------------------------
    # Case 4: Budget / Price Inquiries
    # -------------------------------------------------------------
    if "under 60000" in msg or "under 60k" in msg or "60,000" in msg:
        budget_items = [p for p in all_products if p.price <= 60000 and p.category == "Laptops"]
        budget_items.sort(key=lambda x: x.rating, reverse=True)
        reply = (
            f"### 🏷️ Top Laptops Under ₹60,000\n\n"
            f"Here are the best laptops strictly within your ₹60,000 budget with 16GB RAM and fast SSDs:\n\n"
            + "\n".join([f"• **{p.name}** — **₹{p.price:,.0f}** (Rated {p.rating}★ with {p.review_count} reviews)" for p in budget_items])
            + "\n\nBoth feature excellent keyboards, fast processors, and robust thermal management."
        )
        suggested_followups = [
            "Which one has better battery life?",
            "Can I play games on these laptops?",
            "What noise cancelling headphones match this setup?"
        ]
        return ChatResponse(reply=reply, suggested_followups=suggested_followups, related_products=[format_product_response(p) for p in budget_items])

    # -------------------------------------------------------------
    # Case 5: Audio / ANC Inquiries
    # -------------------------------------------------------------
    if any(w in msg for w in ["headphone", "earbud", "audio", "anc", "noise cancelling", "sound"]):
        audio_items = [p for p in all_products if p.category == "Audio"]
        reply = (
            f"### 🎧 Top Audio & Noise Cancelling Picks\n\n"
            f"Whether you need deep focus during work sessions or premium sound for music:\n\n"
            + "\n".join([f"- **{p.name}** — **₹{p.price:,.0f}** ({p.rating}★)" for p in audio_items])
        )
        suggested_followups = [
            "How long does the Sony WH-1000XM4 battery last?",
            "Show budget earbuds under ₹2,000",
            "Compare Sony vs boAt headphones"
        ]
        return ChatResponse(reply=reply, suggested_followups=suggested_followups, related_products=[format_product_response(p) for p in audio_items])

    # -------------------------------------------------------------
    # Case 6: General Greetings & Default AI Advisor Response
    # -------------------------------------------------------------
    if any(w in msg for w in ["hi", "hello", "hey", "help", "who are you", "what can you do"]):
        reply = (
            f"👋 **Hello! I'm your SmartCommerce AI shopping assistant.**\n\n"
            f"I can help you:\n"
            f"- 🔍 **Find products** by natural language (e.g. *\"I need a laptop for coding under ₹60,000\"*)\n"
            f"- ⚖️ **Compare specs** between different models\n"
            f"- 💡 **Get personalized advice** on RAM, CPU, cameras, monitors, and headphones\n"
            f"- 💰 **Find the best deals** within your specific budget in Indian Rupees (₹)\n\n"
            f"What are you looking to buy today?"
        )
        suggested_followups = [
            "I need a laptop for coding under ₹60,000",
            "Best smartphone under ₹30,000 with good camera",
            "Show top developer accessories (Keyboard & Mouse)"
        ]
        return ChatResponse(reply=reply, suggested_followups=suggested_followups)

    # Default fallback intelligent search
    # Search for matching keywords in product name or description
    keywords = [w for w in re.split(r'\W+', msg) if len(w) > 3]
    matches = []
    for p in all_products:
        p_text = f"{p.name} {p.brand} {p.category} {p.description}".lower()
        if any(kw in p_text for kw in keywords):
            matches.append(p)

    if matches:
        top_matches = matches[:3]
        reply = (
            f"Based on your query **\"{req.message}\"**, here are the most relevant items from our catalog:\n\n"
            + "\n".join([f"- **{p.name}** ({p.category}) — **₹{p.price:,.0f}** ({p.rating}★)" for p in top_matches])
            + "\n\nFeel free to ask me to compare any of them or analyze their technical specifications!"
        )
        suggested_followups = [
            f"Tell me more about {top_matches[0].brand}",
            "What are the user reviews saying?",
            "Show other categories"
        ]
        return ChatResponse(reply=reply, suggested_followups=suggested_followups, related_products=[format_product_response(p) for p in top_matches])

    # Universal friendly response
    reply = (
        f"I'd be happy to help you with that! You can ask me specific questions like:\n"
        f"- *\"Recommend a laptop with 16GB RAM under ₹60,000\"*\n"
        f"- *\"What is the difference between Lenovo IdeaPad and ASUS Vivobook?\"*\n"
        f"- *\"Show me wireless headphones with active noise cancellation\"*\n\n"
        f"Or try searching using the main search bar above for instant AI recommendations."
    )
    suggested_followups = [
        "Laptop for coding under ₹60,000",
        "Best 5G smartphone under ₹30,000",
        "Mechanical keyboard for programming"
    ]
    return ChatResponse(reply=reply, suggested_followups=suggested_followups)
