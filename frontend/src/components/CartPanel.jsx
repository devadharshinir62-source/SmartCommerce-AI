import React from 'react';
import {
  X,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ShoppingBag
} from 'lucide-react';

export default function CartPanel({
  isOpen,
  onClose,
  cart,
  onIncrease,
  onDecrease,
  onRemove
}) {
  const totalItems = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const totalPrice = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return (
    <>
      {/* Background Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}

      {/* Cart Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-slate-900 border-l border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand-500/20">
                <ShoppingCart className="w-5 h-5 text-brand-400" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-white">
                  Your Cart
                </h2>

                <p className="text-xs text-slate-400">
                  {totalItems} item{totalItems !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-5">

            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">

                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-9 h-9 text-brand-400" />
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  Your cart is empty
                </h3>

                <p className="text-sm text-slate-400">
                  Add some amazing products to get started!
                </p>

              </div>
            ) : (
              <div className="space-y-4">

                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-800 border border-slate-700 rounded-2xl p-3"
                  >
                    <div className="flex gap-3">

                      {/* Product Image */}
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover bg-slate-700"
                      />

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">

                        <h3 className="text-sm font-semibold text-white line-clamp-2">
                          {item.name}
                        </h3>

                        <p className="text-brand-400 font-bold mt-1">
                          ₹{item.price.toLocaleString('en-IN')}
                        </p>

                        <div className="flex items-center justify-between mt-3">

                          {/* Quantity */}
                          <div className="flex items-center bg-slate-700 rounded-lg overflow-hidden">

                            <button
                              onClick={() => onDecrease(item.id)}
                              className="p-1.5 hover:bg-slate-600 transition"
                            >
                              <Minus className="w-4 h-4" />
                            </button>

                            <span className="px-3 text-sm font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => onIncrease(item.id)}
                              className="p-1.5 hover:bg-slate-600 transition"
                            >
                              <Plus className="w-4 h-4" />
                            </button>

                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => onRemove(item.id)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>

                      </div>
                    </div>
                  </div>
                ))}

              </div>
            )}

          </div>

          {/* Total */}
          {cart.length > 0 && (
            <div className="border-t border-slate-700 p-5">

              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-400">
                  Total
                </span>

                <span className="text-2xl font-bold text-white">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition"
                onClick={() =>
                  alert(`Order placed successfully! Total: ₹${totalPrice.toLocaleString('en-IN')}`)
                }
              >
                Checkout
              </button>

            </div>
          )}

        </div>
      </div>
    </>
  );
}