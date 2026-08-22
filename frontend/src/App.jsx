import React, { useEffect, useState } from 'react';

import Header from './components/Header';
import HeroSearch from './components/HeroSearch';
import FilterBar from './components/FilterBar';
import ProductList from './components/ProductList';
import ProductDetailsPage from './components/productDetailsPage';
import CheckoutPage from './components/CheckoutPage';
import OrderHistoryPage from './components/OrderHistoryPage';
import ChatBot from './components/ChatBot';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';

import {
  fetchProducts,
  getAiRecommendations
} from './api/api';

import {
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('smartcommerce_user');

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [aiSummary, setAiSummary] = useState(null);
  const [activeCriteria, setActiveCriteria] = useState(null);
  const [isAiMode, setIsAiMode] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [contextProduct, setContextProduct] = useState(null);

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('smartcommerce_cart');

    return savedCart
      ? JSON.parse(savedCart)
      : [];
  });

  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem(
      'smartcommerce_orders'
    );

    return savedOrders
      ? JSON.parse(savedOrders)
      : [];
  });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  useEffect(() => {
    localStorage.setItem(
      'smartcommerce_cart',
      JSON.stringify(cart)
    );
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(
      'smartcommerce_orders',
      JSON.stringify(orders)
    );
  }, [orders]);

  const loadInitialProducts = async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      const data = await fetchProducts();

      setAllProducts(data || []);
      setDisplayedProducts(data || []);

      setIsAiMode(false);
      setAiSummary(null);
      setActiveCriteria(null);
    } catch (err) {
      console.error('API error:', err);

      setApiError(
        'Could not connect to the FastAPI backend at http://localhost:8000. Please ensure the backend server is running.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialProducts();

    const handleOpenChat = () => {
      setIsChatOpen(true);
    };

    window.addEventListener(
      'open-smart-chat',
      handleOpenChat
    );

    return () => {
      window.removeEventListener(
        'open-smart-chat',
        handleOpenChat
      );
    };
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);

    localStorage.setItem(
      'smartcommerce_user',
      JSON.stringify(userData)
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('smartcommerce_user');

    setUser(null);

    showToast('You have been logged out.');
  };

  const handleAiSearch = async (query) => {
    if (!query || !query.trim()) {
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const result = await getAiRecommendations(query);

      setDisplayedProducts(
        result.recommendations || []
      );

      setAiSummary(
        result.recommendation_summary || null
      );

      setActiveCriteria(
        result.criteria || null
      );

      setIsAiMode(true);
      setSortBy('relevance');

      if (
        result.criteria &&
        result.criteria.category
      ) {
        setSelectedCategory(
          result.criteria.category
        );
      } else {
        setSelectedCategory('All');
      }

    } catch (err) {
      console.error(
        'AI Search failed:',
        err
      );

      const searchTerms = query
        .toLowerCase()
        .split(' ')
        .filter(Boolean);

      const filtered = allProducts.filter(
        (product) =>
          searchTerms.some((term) => {
            return (
              product.name
                ?.toLowerCase()
                .includes(term) ||

              product.category
                ?.toLowerCase()
                .includes(term) ||

              product.brand
                ?.toLowerCase()
                .includes(term) ||

              (
                product.tags &&
                product.tags.some((tag) =>
                  tag
                    .toLowerCase()
                    .includes(term)
                )
              )
            );
          })
      );

      setDisplayedProducts(filtered);

      setIsAiMode(false);
      setAiSummary(null);
      setActiveCriteria(null);

    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSearch = () => {
    setSelectedCategory('All');
    setSortBy('featured');
    setIsAiMode(false);
    setAiSummary(null);
    setActiveCriteria(null);

    setDisplayedProducts(allProducts);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);

    if (category === 'All') {
      if (isAiMode) {
        handleResetSearch();
      } else {
        setDisplayedProducts(allProducts);
      }

      return;
    }

    if (isAiMode) {
      setDisplayedProducts((previousProducts) =>
        previousProducts.filter(
          (product) =>
            product.category?.toLowerCase() ===
            category.toLowerCase()
        )
      );
    } else {
      const filtered = allProducts.filter(
        (product) =>
          product.category?.toLowerCase() ===
          category.toLowerCase()
      );

      setDisplayedProducts(filtered);
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);

    const sorted = [...displayedProducts];

    if (newSort === 'price_asc') {
      sorted.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    } else if (newSort === 'price_desc') {
      sorted.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    } else if (newSort === 'rating') {
      sorted.sort(
        (a, b) =>
          Number(b.rating || 0) -
          Number(a.rating || 0)
      );
    } else if (newSort === 'relevance') {
      sorted.sort(
        (a, b) =>
          Number(b.match_score || 0) -
          Number(a.match_score || 0)
      );
    } else {
      sorted.sort(
        (a, b) =>
          Number(b.is_featured || false) -
          Number(a.is_featured || false)
      );
    }

    setDisplayedProducts(sorted);
  };

  const handleAskAiAboutProduct = (product) => {
    setContextProduct(product);
    setIsChatOpen(true);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(false);
    setIsHistoryOpen(false);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleAddToCart = (product) => {
    setCart((previousCart) => {
      const existingProduct = previousCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return previousCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  Number(item.quantity || 1) + 1
              }
            : item
        );
      }

      return [
        ...previousCart,
        {
          ...product,
          quantity: 1
        }
      ];
    });

    showToast(
      `"${product.name.slice(0, 30)}${
        product.name.length > 30 ? '...' : ''
      }" added to your cart!`
    );
  };

  const handleIncreaseQuantity = (productId) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity:
                Number(item.quantity || 1) + 1
            }
          : item
      )
    );
  };

  const handleDecreaseQuantity = (productId) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity:
                  Number(item.quantity || 1) - 1
              }
            : item
        )
        .filter(
          (item) => Number(item.quantity) > 0
        )
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart((previousCart) =>
      previousCart.filter(
        (item) => item.id !== productId
      )
    );

    showToast('Product removed from cart.');
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty.');
      return;
    }

    setSelectedProduct(null);
    setIsHistoryOpen(false);
    setIsCheckoutOpen(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleBackFromCheckout = () => {
    setIsCheckoutOpen(false);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleOrderSuccess = (orderData) => {
    setOrders((previousOrders) => [
      orderData,
      ...previousOrders
    ]);

    setCart([]);
    setIsCheckoutOpen(false);
    setIsHistoryOpen(true);

    showToast(
      'Your order has been placed successfully!'
    );

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleOpenHistory = () => {
    setSelectedProduct(null);
    setIsCheckoutOpen(false);
    setIsHistoryOpen(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleBackFromHistory = () => {
    setIsHistoryOpen(false);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleClearHistory = () => {
    const confirmClear = window.confirm(
      'Are you sure you want to clear your order history?'
    );

    if (!confirmClear) {
      return;
    }

    setOrders([]);

    showToast('Order history cleared.');
  };

  const cartItemCount = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  if (!user) {
    return (
      <LoginPage
        onLogin={handleLogin}
      />
    );
  }

  const isSelectedProductInCart =
    selectedProduct
      ? cart.some(
          (item) =>
            item.id === selectedProduct.id
        )
      : false;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">

      {toastMessage && (
        <div className="fixed top-24 right-6 z-[100] px-4 py-3 rounded-2xl bg-emerald-600 text-white font-medium text-xs sm:text-sm shadow-xl flex items-center space-x-2">

          <span>✓</span>

          <span>
            {toastMessage}
          </span>

        </div>
      )}

      <Header
        onOpenChat={() =>
          setIsChatOpen(true)
        }
        onOpenHistory={handleOpenHistory}
        totalProductsCount={allProducts.length}
        cart={cart}
        cartItemCount={cartItemCount}
        onIncreaseQuantity={handleIncreaseQuantity}
        onDecreaseQuantity={handleDecreaseQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onCheckout={handleCheckout}
        user={user}
        onLogout={handleLogout}
      />

      {apiError && (
        <div className="max-w-4xl mx-auto px-4 mt-4 w-full">

          <div className="p-4 rounded-2xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs sm:text-sm flex items-start justify-between space-x-3">

            <div className="flex items-start space-x-2.5">

              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />

              <div>
                <strong>
                  Backend Connection Notice:
                </strong>

                {' '}

                {apiError}
              </div>

            </div>

            <button
              onClick={loadInitialProducts}
              className="px-3 py-1 bg-amber-600/40 hover:bg-amber-600/70 border border-amber-500/50 rounded-lg text-xs font-semibold shrink-0 flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />

              <span>
                Retry
              </span>

            </button>

          </div>

        </div>
      )}

      {isHistoryOpen ? (

        <main className="flex-1 w-full">

          <OrderHistoryPage
            orders={orders}
            onBack={handleBackFromHistory}
            onClearHistory={handleClearHistory}
          />

        </main>

      ) : isCheckoutOpen ? (

        <main className="flex-1 w-full">

          <CheckoutPage
            cart={cart}
            onBack={handleBackFromCheckout}
            onOrderSuccess={handleOrderSuccess}
          />

        </main>

      ) : selectedProduct ? (

        <main className="flex-1 w-full">

          <ProductDetailsPage
            product={selectedProduct}
            onBack={handleBackToProducts}
            onAddToCart={handleAddToCart}
            onAskAi={handleAskAiAboutProduct}
            isInCart={isSelectedProductInCart}
          />

        </main>

      ) : (

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

          <HeroSearch
            onSearch={handleAiSearch}
            isLoading={isLoading}
            activeCriteria={activeCriteria}
            onResetSearch={handleResetSearch}
          />

          <FilterBar
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            totalResults={displayedProducts.length}
            isAiResult={isAiMode}
          />

          <ProductList
            products={displayedProducts}
            isLoading={isLoading}
            aiSummary={aiSummary}
            onAskAi={handleAskAiAboutProduct}
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
            cart={cart}
            onResetFilters={handleResetSearch}
          />

        </main>

      )}

      <ChatBot
        isOpen={isChatOpen}
        onClose={() =>
          setIsChatOpen(false)
        }
        contextProduct={contextProduct}
        onClearContextProduct={() =>
          setContextProduct(null)
        }
      />

      <Footer />

    </div>
  );
}