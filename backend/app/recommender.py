"""
AI Recommendation Engine for SmartCommerce AI
==============================================
Analyzes user shopping requirements in natural language and scores products
based on extracted budget, category, intent tags, and technical specifications.
"""

import re
import json
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from .models import Product
from .schemas import ExtractedCriteria, ScoredProduct, RecommendationResponse

# Keywords mapping to product categories
CATEGORY_KEYWORDS = {
    "Laptops": ["laptop", "laptops", "notebook", "macbook", "ultrabook", "pc", "computer"],
    "Smartphones": ["phone", "smartphone", "smartphones", "mobile", "android", "iphone", "handset"],
    "Audio": ["headphone", "headphones", "earphone", "earphones", "earbuds", "tws", "audio", "sound", "anc"],
    "Accessories": ["mouse", "keyboard", "keyboards", "accessory", "accessories", "peripherals", "trackpad"],
    "Monitors": ["monitor", "monitors", "screen", "display", "4k monitor", "gaming monitor"]
}

# Known brands in our dataset
KNOWN_BRANDS = [
    "lenovo", "asus", "hp", "apple", "dell", "acer", 
    "oneplus", "samsung", "redmi", "xiaomi", "sony", 
    "boat", "logitech", "keychron", "portronics", "lg"
]

# Intent and capability keywords
INTENT_KEYWORDS = {
    "coding": ["coding", "programming", "developer", "software", "development", "python", "javascript", "code", "dev"],
    "gaming": ["gaming", "games", "gamer", "rtx", "gpu", "fps", "play"],
    "camera": ["camera", "photo", "photography", "portrait", "video", "photos", "megapixels", "ois"],
    "battery": ["battery", "battery life", "all day", "backup", "fast charging", "100w"],
    "lightweight": ["lightweight", "thin", "slim", "portable", "travel", "carry"],
    "anc": ["noise cancelling", "anc", "quiet", "focus", "silence", "commute", "flight"],
    "budget": ["budget", "cheap", "affordable", "low cost", "value for money", "under 1000", "under 2000"],
    "premium": ["premium", "flagship", "high-end", "best quality", "top of the line", "apple", "pro"]
}

def parse_budget(query: str) -> Tuple[float | None, float | None]:
    """
    Extracts minimum and maximum budget from natural language text.
    Handles formats: 'under 60,000', 'under ₹60000', 'under 60k', 'below 50000', 'around 30k', etc.
    """
    query_lower = query.lower()
    max_budget = None
    min_budget = None

    # Pattern for "k" notation: e.g. "under 60k", "below 30k", "under 60 k"
    k_match = re.search(r'(?:under|below|less than|within|upto|up to|budget\s+of)\s*₹?\s*(\d+(?:\.\d+)?)\s*k\b', query_lower)
    if k_match:
        max_budget = float(k_match.group(1)) * 1000
        return min_budget, max_budget

    # Pattern for standard numbers: e.g. "under ₹60,000", "under 60000", "below 25,000"
    num_match = re.search(r'(?:under|below|less than|within|upto|up to|max|budget\s+of)\s*₹?\s*([\d,]+)', query_lower)
    if num_match:
        raw_val = num_match.group(1).replace(',', '')
        try:
            max_budget = float(raw_val)
            return min_budget, max_budget
        except ValueError:
            pass

    # Pattern for "around 30k" or "around ₹30,000" (creates a +- 20% range)
    around_k = re.search(r'(?:around|approx|approximately|about)\s*₹?\s*(\d+(?:\.\d+)?)\s*k\b', query_lower)
    if around_k:
        target = float(around_k.group(1)) * 1000
        min_budget = target * 0.8
        max_budget = target * 1.2
        return min_budget, max_budget

    around_num = re.search(r'(?:around|approx|approximately|about)\s*₹?\s*([\d,]+)', query_lower)
    if around_num:
        raw_val = around_num.group(1).replace(',', '')
        try:
            target = float(raw_val)
            min_budget = target * 0.8
            max_budget = target * 1.2
            return min_budget, max_budget
        except ValueError:
            pass

    # General ₹ symbol match if no explicit 'under' word: e.g. "laptop ₹60000"
    rs_match = re.search(r'₹\s*([\d,]+)', query_lower)
    if rs_match:
        raw_val = rs_match.group(1).replace(',', '')
        try:
            max_budget = float(raw_val)
            return min_budget, max_budget
        except ValueError:
            pass

    return min_budget, max_budget

def extract_criteria(query: str) -> ExtractedCriteria:
    """
    Parses a user natural language query to extract intent, category, budget, and brands.
    """
    query_lower = query.lower()
    
    # 1. Extract Budget
    min_budget, max_budget = parse_budget(query)
    
    # 2. Extract Category
    detected_category = None
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(kw in query_lower for kw in keywords):
            detected_category = category
            break
            
    # 3. Extract Intent Tags
    detected_intents = []
    for intent, keywords in INTENT_KEYWORDS.items():
        if any(kw in query_lower for kw in keywords):
            detected_intents.append(intent)
            
    # 4. Extract Brands
    detected_brands = []
    for brand in KNOWN_BRANDS:
        if re.search(r'\b' + re.escape(brand) + r'\b', query_lower):
            detected_brands.append(brand.capitalize())
            
    # 5. Extract rating requirement (e.g., "4 star", "top rated")
    min_rating = None
    if "top rated" in query_lower or "best rated" in query_lower:
        min_rating = 4.5
    elif re.search(r'(\d(?:\.\d)?)\s*(?:star|\+?\s*stars)', query_lower):
        match = re.search(r'(\d(?:\.\d)?)\s*(?:star|\+?\s*stars)', query_lower)
        try:
            min_rating = float(match.group(1))
        except ValueError:
            pass

    return ExtractedCriteria(
        original_query=query,
        category=detected_category,
        max_budget=max_budget,
        min_budget=min_budget,
        intent_tags=detected_intents,
        preferred_brands=detected_brands,
        min_rating=min_rating
    )

def calculate_product_score(product: Product, criteria: ExtractedCriteria) -> Tuple[int, List[str], str | None]:
    """
    Computes relevance score (0-100), reasons, and badge for a product based on search criteria.
    """
    score = 50.0  # Base neutral score
    reasons = []
    
    prod_name_lower = product.name.lower()
    prod_desc_lower = product.description.lower()
    prod_tags_lower = (product.tags or "").lower()
    prod_specs_lower = (product.specs or "").lower()
    all_product_text = f"{prod_name_lower} {prod_desc_lower} {prod_tags_lower} {prod_specs_lower}"

    # 1. Category Matching (+30 points)
    if criteria.category:
        if product.category.lower() == criteria.category.lower():
            score += 30
            reasons.append(f"Matches category '{product.category}'")
        else:
            # Huge penalty if category explicitly does not match
            score -= 40
    else:
        # Check query keywords in category
        for cat_name, kws in CATEGORY_KEYWORDS.items():
            if cat_name.lower() == product.category.lower():
                if any(kw in criteria.original_query.lower() for kw in kws):
                    score += 25
                    reasons.append(f"Fits target category '{product.category}'")

    # 2. Budget Evaluation (+25 points or penalty)
    if criteria.max_budget is not None:
        if product.price <= criteria.max_budget:
            # Under budget bonus
            savings = criteria.max_budget - product.price
            score += 25
            if savings >= 5000:
                reasons.append(f"Well within budget (₹{product.price:,.0f} vs ₹{criteria.max_budget:,.0f} limit, saving ₹{savings:,.0f})")
            else:
                reasons.append(f"Fits within your budget of ₹{criteria.max_budget:,.0f}")
        else:
            # Over budget penalty
            overage = product.price - criteria.max_budget
            percentage_over = (overage / criteria.max_budget) * 100
            if percentage_over <= 15:
                # Slightly over budget
                score -= 10
                reasons.append(f"Slightly above budget by ₹{overage:,.0f}, but offers strong specs")
            else:
                score -= 40
                reasons.append(f"Exceeds specified budget of ₹{criteria.max_budget:,.0f}")

    if criteria.min_budget is not None and product.price >= criteria.min_budget:
        score += 5

    # 3. Intent & Tag Matching (+10 points per matched intent)
    matched_intents_count = 0
    for intent in criteria.intent_tags:
        intent_kws = INTENT_KEYWORDS.get(intent, [intent])
        if any(kw in all_product_text for kw in intent_kws):
            score += 12
            matched_intents_count += 1
            if intent == "coding":
                reasons.append("Optimized for coding & software development (Fast CPU & RAM)")
            elif intent == "gaming":
                reasons.append("Equipped for gaming with dedicated GPU & high refresh rate")
            elif intent == "camera":
                reasons.append("High-resolution camera sensor with optical image stabilization")
            elif intent == "battery":
                reasons.append("Long-lasting battery with fast charging support")
            elif intent == "anc":
                reasons.append("Active Noise Cancellation for uninterrupted focus")
            elif intent == "lightweight":
                reasons.append("Ultra-portable, slim, and travel friendly")
            elif intent == "budget":
                reasons.append("Exceptional price-to-performance ratio")

    # 4. Brand Preference (+15 points)
    if criteria.preferred_brands:
        if product.brand.lower() in [b.lower() for b in criteria.preferred_brands]:
            score += 15
            reasons.append(f"Requested brand: {product.brand}")

    # 5. Rating & Popularity (+5 to +10 points)
    if product.rating >= 4.5:
        score += 8
        reasons.append(f"Highly rated by verified buyers ({product.rating}★ with {product.review_count:,}+ reviews)")
    elif product.rating >= 4.0:
        score += 4

    # 6. Specific spec keywords in query (e.g. "16gb", "ryzen", "rtx", "i5", "oled", "4k")
    spec_keywords = ["16gb", "32gb", "8gb", "ryzen", "intel", "i5", "i7", "rtx", "ssd", "oled", "4k", "ips", "120hz", "5g", "m2", "bluetooth", "mac"]
    for kw in spec_keywords:
        if kw in criteria.original_query.lower() and kw in all_product_text:
            score += 8
            reasons.append(f"Includes requested spec: {kw.upper()}")

    # Normalize score between 10 and 99
    final_score = int(max(15, min(99, round(score))))
    
    # Assign AI Badge
    ai_badge = None
    if final_score >= 90:
        ai_badge = "Top Match"
    elif final_score >= 80:
        if criteria.max_budget and product.price < criteria.max_budget * 0.85:
            ai_badge = "Best Value"
        else:
            ai_badge = "Recommended"
    elif final_score >= 70:
        ai_badge = "Popular Choice"

    return final_score, reasons, ai_badge

def build_summary_text(criteria: ExtractedCriteria, count: int) -> str:
    """
    Generates a natural, intelligent AI summary of what the analyzer did.
    """
    parts = []
    if criteria.category:
        parts.append(f"category: **{criteria.category}**")
    if criteria.intent_tags:
        parts.append(f"purpose: **{', '.join(criteria.intent_tags).title()}**")
    if criteria.max_budget:
        parts.append(f"budget under: **₹{criteria.max_budget:,.0f}**")
    if criteria.preferred_brands:
        parts.append(f"preferred brand: **{', '.join(criteria.preferred_brands)}**")

    criteria_str = " | ".join(parts) if parts else "all categories"
    
    if count == 0:
        return f"We analyzed your requirement ({criteria_str}), but found no exact matches. Try expanding your budget or exploring related categories."
    
    return f"Analyzed requirement ({criteria_str}). Found {count} best matching product{'s' if count != 1 else ''} ranked by relevance, specifications, and buyer ratings."

def analyze_and_recommend(query: str, db: Session) -> RecommendationResponse:
    """
    End-to-end recommendation workflow:
    1. Parse query into ExtractedCriteria
    2. Score all products in SQLite
    3. Sort by match_score descending
    4. Return structured response
    """
    criteria = extract_criteria(query)
    all_products = db.query(Product).all()

    scored_items: List[ScoredProduct] = []

    for prod in all_products:
        score, reasons, badge = calculate_product_score(prod, criteria)
        
        # Parse JSON fields safely
        try:
            features = json.loads(prod.features) if prod.features else []
        except Exception:
            features = []

        try:
            specs = json.loads(prod.specs) if prod.specs else {}
        except Exception:
            specs = {}

        tags = [t.strip() for t in (prod.tags or "").split(",") if t.strip()]

        # Only include if score is at least reasonable (or if few items, include top)
        scored_prod = ScoredProduct(
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
            is_featured=prod.is_featured,
            match_score=score,
            match_reasons=reasons,
            ai_badge=badge
        )
        scored_items.append(scored_prod)

    # Sort descending by match score, then rating
    scored_items.sort(key=lambda p: (p.match_score, p.rating), reverse=True)

    # If criteria had a specific category or budget, filter out very low scoring products (<40) unless empty
    if criteria.category or criteria.max_budget:
        filtered = [p for p in scored_items if p.match_score >= 50]
        final_recommendations = filtered if filtered else scored_items[:5]
    else:
        final_recommendations = scored_items[:8]

    summary = build_summary_text(criteria, len(final_recommendations))

    return RecommendationResponse(
        query=query,
        criteria=criteria,
        recommendation_summary=summary,
        total_matches=len(final_recommendations),
        recommendations=final_recommendations
    )
