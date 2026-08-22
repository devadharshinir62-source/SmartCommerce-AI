import React, { useState } from 'react';

import {
  Bot,
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  User,
  LogOut,
  ChevronDown,
  History
} from 'lucide-react';

export default function Header({
  onOpenChat,
  onOpenHistory,
  totalProductsCount = 0,

  cart = [],
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveFromCart,
  onCheckout,

  user,
  onLogout
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const cartItemCount = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
      Number(item.quantity || 0),
    0
  );

  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString('en-IN')}`;
  };

  const userName =
    user?.name ||
    user?.username ||
    user?.email?.split('@')[0] ||
    'User';

  const handleCheckoutClick = () => {
    setIsCartOpen(false);

    if (onCheckout) {
      onCheckout();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-700/60 bg-slate-900/95 backdrop-blur-xl">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-20 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/20">

                <Bot className="w-6 h-6 text-white" />

                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />

              </div>

              <div>

                <div className="flex items-center gap-2">

                  <h1 className="text-lg sm:text-2xl font-bold text-white">
                    SmartCommerce
                    <span className="text-brand-400 ml-1">
                      AI
                    </span>
                  </h1>

                  <span className="hidden sm:inline-flex px-2 py-0.5 text-xs rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300">
                    v1.0
                  </span>

                </div>

                <p className="hidden sm:block text-xs text-slate-400">
                  Intelligent Shopping & Recommendation Assistant
                </p>

              </div>

            </div>

            <div className="hidden lg:flex items-center gap-6 text-sm">

              <div className="flex items-center gap-2 text-slate-300">

                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />

                <span>
                  FastAPI & SQLite Engine
                </span>

              </div>

              <div className="px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">

                Catalog:

                <span className="ml-1 font-bold text-brand-400">
                  {totalProductsCount}
                </span>

                <span className="ml-1">
                  Items
                </span>

              </div>

            </div>

            <div className="flex items-center gap-2 sm:gap-3">

              <div className="relative">

                <button
                  onClick={() =>
                    setIsProfileOpen(!isProfileOpen)
                  }
                  className="flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition"
                >

                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white">

                    <User className="w-4 h-4" />

                  </div>

                  <span className="hidden md:block text-sm font-semibold max-w-[100px] truncate">
                    {userName}
                  </span>

                  <ChevronDown className="hidden sm:block w-4 h-4 text-slate-400" />

                </button>

                {isProfileOpen && (

                  <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl overflow-hidden z-50">

                    <div className="p-4 border-b border-slate-700">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center">

                          <User className="w-5 h-5 text-white" />

                        </div>

                        <div className="min-w-0">

                          <p className="text-sm font-bold text-white truncate">
                            {userName}
                          </p>

                          <p className="text-xs text-slate-400 truncate">
                            {user?.email || 'SmartCommerce User'}
                          </p>

                        </div>

                      </div>

                    </div>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);

                        if (onLogout) {
                          onLogout();
                        }
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition"
                    >

                      <LogOut className="w-4 h-4" />

                      <span>
                        Logout
                      </span>

                    </button>

                  </div>

                )}

              </div>

              <button
                onClick={() => {
                  if (onOpenHistory) {
                    onOpenHistory();
                  }

                  setIsProfileOpen(false);
                  setIsCartOpen(false);
                }}
                className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white transition"
                title="Order History"
              >
                <History className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  setIsCartOpen(true);
                  setIsProfileOpen(false);
                }}
                className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white transition"
                title="Open Cart"
              >

                <ShoppingCart className="w-5 h-5" />

                {cartItemCount > 0 && (

                  <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 flex items-center justify-center rounded-full bg-brand-500 text-white text-[11px] font-bold border-2 border-slate-900">

                    {cartItemCount > 99
                      ? '99+'
                      : cartItemCount}

                  </span>

                )}

              </button>

              <button
                onClick={onOpenChat}
                className="flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-brand-500/20 transition"
              >

                <Sparkles className="w-4 h-4" />

                <span className="hidden sm:inline">
                  Ask AI Assistant
                </span>

                <span className="sm:hidden">
                  AI
                </span>

              </button>

            </div>

          </div>

        </div>

      </header>

      {isCartOpen && (

        <div className="fixed inset-0 z-50">

          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="absolute top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col">

            <div className="flex items-center justify-between px-5 py-5 border-b border-slate-700">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-brand-400" />
                </div>

                <div>

                  <h2 className="font-bold text-white">
                    Your Cart
                  </h2>

                  <p className="text-xs text-slate-400">
                    {cartItemCount}{' '}
                    {cartItemCount === 1 ? 'item' : 'items'}
                  </p>

                </div>

              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <div className="flex-1 overflow-y-auto p-5">

              {cart.length === 0 ? (

                <div className="h-full flex flex-col items-center justify-center text-center">

                  <div className="w-20 h-20 rounded-3xl bg-slate-800 flex items-center justify-center mb-5">
                    <ShoppingCart className="w-9 h-9 text-slate-500" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">
                    Your cart is empty
                  </h3>

                  <p className="text-sm text-slate-400 max-w-xs">
                    Start exploring products and add your favorites to the cart.
                  </p>

                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition"
                  >
                    Continue Shopping
                  </button>

                </div>

              ) : (

                <div className="space-y-4">

                  {cart.map((item) => (

                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-800 border border-slate-700"
                    >

                      <div className="flex gap-3">

                        <img
                          src={
                            item.image_url ||
                            'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=300&q=80'
                          }
                          alt={item.name}
                          className="w-20 h-20 rounded-xl object-cover bg-slate-700"
                        />

                        <div className="flex-1 min-w-0">

                          <div className="flex justify-between gap-2">

                            <div>

                              <p className="text-[10px] uppercase tracking-wider text-brand-400 font-semibold">
                                {item.brand}
                              </p>

                              <h3 className="text-sm font-semibold text-white line-clamp-2">
                                {item.name}
                              </h3>

                            </div>

                            <button
                              onClick={() => {
                                if (onRemoveFromCart) {
                                  onRemoveFromCart(item.id);
                                }
                              }}
                              className="shrink-0 p-1.5 h-fit rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>

                          <div className="mt-3 flex items-center justify-between">

                            <span className="font-bold text-white">
                              {formatPrice(item.price)}
                            </span>

                            <div className="flex items-center gap-2 bg-slate-900 rounded-xl border border-slate-700 p-1">

                              <button
                                onClick={() => {
                                  if (onDecreaseQuantity) {
                                    onDecreaseQuantity(item.id);
                                  }
                                }}
                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-700 text-slate-300 transition"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>

                              <span className="w-6 text-center text-sm font-bold text-white">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() => {
                                  if (onIncreaseQuantity) {
                                    onIncreaseQuantity(item.id);
                                  }
                                }}
                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-700 text-slate-300 transition"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

            {cart.length > 0 && (

              <div className="border-t border-slate-700 p-5 bg-slate-900">

                <div className="flex justify-between items-center mb-5">

                  <div>

                    <p className="text-xs text-slate-400">
                      Total Amount
                    </p>

                    <p className="text-2xl font-extrabold text-white">
                      {formatPrice(cartTotal)}
                    </p>

                  </div>

                  <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
                    {cartItemCount} items
                  </div>

                </div>

                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm transition shadow-lg shadow-brand-500/20"
                >
                  Proceed to Checkout
                </button>

              </div>

            )}

          </div>

        </div>

      )}

    </>
  );
}