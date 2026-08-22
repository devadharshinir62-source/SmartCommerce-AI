"""
Verification Test Script for SmartCommerce AI
==============================================
Tests database seeding, recommendation engine, and chatbot assistant locally.
"""

import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from app.database import SessionLocal, engine, Base
from app.models import Product
from app.seed_data import seed_database_if_empty
from app.recommender import analyze_and_recommend
from app.chatbot import handle_chat_query
from app.schemas import ChatRequest

def run_tests():
    print("==================================================")
    print("Testing SmartCommerce AI Engine")
    print("==================================================")

    # 1. Initialize DB and Seed
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_database_if_empty(db)

    count = db.query(Product).count()
    print(f"[OK] Products in SQLite database: {count}")
    assert count > 0, "Database should not be empty"

    # 2. Test Recommendation Query
    query = "I need a laptop for coding under ₹60,000"
    print(f"\n--- Testing Recommendation for: '{query}' ---")
    rec_res = analyze_and_recommend(query, db)
    
    print(f"Criteria Detected: Category={rec_res.criteria.category}, Max Budget=Rs.{rec_res.criteria.max_budget}, Intents={rec_res.criteria.intent_tags}")
    print(f"Summary: {rec_res.recommendation_summary}")
    print(f"Top Recommended Products ({rec_res.total_matches} matches):")
    for idx, p in enumerate(rec_res.recommendations[:3], 1):
        print(f"  {idx}. {p.name} | Price: Rs.{p.price:,.0f} | Score: {p.match_score}% | Badge: {p.ai_badge}")
        if p.match_reasons:
            print(f"     Why: {p.match_reasons[0]}")

    assert len(rec_res.recommendations) > 0, "Should return at least 1 recommendation"
    assert rec_res.recommendations[0].price <= 60000, "Top laptop should be under 60k budget"

    # 3. Test Chatbot
    print("\n--- Testing Chatbot ---")
    chat_req = ChatRequest(message="What is the difference between Lenovo and ASUS for coding?")
    chat_res = handle_chat_query(chat_req, db)
    print(f"Chat Response preview:\n{chat_res.reply[:200]}...")
    print(f"Suggested Followups: {chat_res.suggested_followups}")
    assert len(chat_res.reply) > 0, "Chatbot should return a response"

    print("\n==================================================")
    print("[SUCCESS] ALL TESTS PASSED!")
    print("==================================================")
    db.close()

if __name__ == "__main__":
    run_tests()
