/**
 * API Service for SmartCommerce AI
 * =================================
 * Connects the React frontend to the live FastAPI backend.
 */

const API_BASE_URL = 'https://smartcommerce-ai-backend-iol7.onrender.com';

/**
 * Fetch products list with optional query parameters.
 */
export async function fetchProducts({
  category,
  search,
  maxPrice,
  minRating
} = {}) {
  const params = new URLSearchParams();

  if (category && category !== 'All') {
    params.append('category', category);
  }

  if (search) {
    params.append('search', search);
  }

  if (maxPrice) {
    params.append('max_price', maxPrice);
  }

  if (minRating) {
    params.append('min_rating', minRating);
  }

  const url = `${API_BASE_URL}/api/products${
    params.toString() ? `?${params.toString()}` : ''
  }`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch products: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}

/**
 * Fetch single product details by ID.
 */
export async function fetchProductById(id) {
  const response = await fetch(
    `${API_BASE_URL}/api/products/${id}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch product ${id}: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}

/**
 * Fetch available categories and product counts.
 */
export async function fetchCategories() {
  const response = await fetch(
    `${API_BASE_URL}/api/categories`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch categories: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}

/**
 * Submit natural language requirement to AI recommender.
 *
 * Example:
 * "I need a laptop for coding under ₹60,000"
 */
export async function getAiRecommendations(query) {
  const response = await fetch(
    `${API_BASE_URL}/api/recommend`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    }
  );

  if (!response.ok) {
    throw new Error(
      `Recommendation failed: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}

/**
 * Send user message to the conversational shopping assistant.
 */
export async function sendChatMessage(
  message,
  history = [],
  contextProductId = null
) {
  const response = await fetch(
    `${API_BASE_URL}/api/chat`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        history,
        context_product_id: contextProductId
      })
    }
  );

  if (!response.ok) {
    throw new Error(
      `Chat assistant failed: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}