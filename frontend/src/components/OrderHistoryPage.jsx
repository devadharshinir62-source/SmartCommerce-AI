import React from 'react';
import {
  ArrowLeft,
  Package,
  ShoppingBag,
  CheckCircle2,
  Calendar,
  MapPin,
  CreditCard,
  Trash2
} from 'lucide-react';

export default function OrderHistoryPage({
  orders = [],
  onBack,
  onClearHistory
}) {
  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString('en-IN')}`;
  };

  const formatDate = (date) => {
    if (!date) return '';

    return new Date(date).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Shopping
            </button>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Order History
            </h1>

            <p className="text-slate-400 mt-2">
              View all your previous SmartCommerce AI orders.
            </p>
          </div>

          {orders.length > 0 && (
            <button
              onClick={onClearHistory}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </button>
          )}

        </div>

        {/* EMPTY HISTORY */}

        {orders.length === 0 ? (

          <div className="min-h-[50vh] flex items-center justify-center">

            <div className="max-w-md w-full text-center p-10 rounded-3xl bg-slate-800 border border-slate-700">

              <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-brand-500/10 flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-brand-400" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-3">
                No Orders Yet
              </h2>

              <p className="text-slate-400 mb-6">
                You haven't placed any orders yet. Start shopping and your orders will appear here.
              </p>

              <button
                onClick={onBack}
                className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition"
              >
                Start Shopping
              </button>

            </div>

          </div>

        ) : (

          <div className="space-y-6">

            {orders.map((order) => (

              <div
                key={order.id}
                className="rounded-3xl bg-slate-800 border border-slate-700 overflow-hidden"
              >

                {/* ORDER HEADER */}

                <div className="p-5 sm:p-6 border-b border-slate-700 bg-slate-800/80">

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                      <div className="flex items-center gap-3 mb-2">

                        <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                          <Package className="w-5 h-5 text-brand-400" />
                        </div>

                        <div>

                          <p className="text-xs text-slate-400">
                            Order ID
                          </p>

                          <h3 className="font-bold text-white">
                            #{order.id}
                          </h3>

                        </div>

                      </div>

                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />

                        <span className="text-xs font-semibold text-emerald-400">
                          Order Placed
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400">

                        <Calendar className="w-4 h-4" />

                        {formatDate(order.orderDate)}

                      </div>

                    </div>

                  </div>

                </div>

                {/* ORDER CONTENT */}

                <div className="p-5 sm:p-6">

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* PRODUCTS */}

                    <div className="lg:col-span-2">

                      <h4 className="font-semibold text-white mb-4">
                        Ordered Products
                      </h4>

                      <div className="space-y-4">

                        {order.items?.map((item) => (

                          <div
                            key={`${order.id}-${item.id}`}
                            className="flex gap-4 p-3 rounded-2xl bg-slate-900 border border-slate-700"
                          >

                            <img
                              src={
                                item.image_url ||
                                'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=300&q=80'
                              }
                              alt={item.name}
                              className="w-20 h-20 rounded-xl object-cover bg-slate-700"
                            />

                            <div className="flex-1 min-w-0">

                              <p className="text-xs text-brand-400 uppercase font-semibold">
                                {item.brand || 'Product'}
                              </p>

                              <h5 className="text-sm sm:text-base font-semibold text-white mt-1">
                                {item.name}
                              </h5>

                              <div className="flex items-center justify-between mt-3">

                                <span className="text-xs text-slate-400">
                                  Quantity: {item.quantity}
                                </span>

                                <span className="font-bold text-brand-300">
                                  {formatPrice(
                                    Number(item.price || 0) *
                                    Number(item.quantity || 1)
                                  )}
                                </span>

                              </div>

                            </div>

                          </div>

                        ))}

                      </div>

                    </div>

                    {/* ORDER DETAILS */}

                    <div className="space-y-4">

                      {/* TOTAL */}

                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700">

                        <p className="text-xs text-slate-400 mb-1">
                          Total Amount
                        </p>

                        <p className="text-2xl font-extrabold text-white">
                          {formatPrice(order.total)}
                        </p>

                        <p className="text-xs text-slate-500 mt-2">
                          {order.totalItems} item
                          {order.totalItems !== 1 ? 's' : ''}
                        </p>

                      </div>

                      {/* PAYMENT */}

                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700">

                        <div className="flex items-center gap-2 mb-2">

                          <CreditCard className="w-4 h-4 text-purple-400" />

                          <p className="text-xs text-slate-400">
                            Payment Method
                          </p>

                        </div>

                        <p className="text-sm font-semibold text-white capitalize">
                          {order.paymentMethod === 'cod'
                            ? 'Cash on Delivery'
                            : order.paymentMethod === 'upi'
                            ? 'UPI'
                            : 'Card'}
                        </p>

                      </div>

                      {/* ADDRESS */}

                      {order.customer && (

                        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700">

                          <div className="flex items-center gap-2 mb-2">

                            <MapPin className="w-4 h-4 text-emerald-400" />

                            <p className="text-xs text-slate-400">
                              Delivery Address
                            </p>

                          </div>

                          <p className="text-sm text-white font-medium">
                            {order.customer.fullName}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            {order.customer.address}
                          </p>

                          <p className="text-xs text-slate-400">
                            {order.customer.city},
                            {' '}
                            {order.customer.state}
                          </p>

                          <p className="text-xs text-slate-400">
                            {order.customer.pincode}
                          </p>

                        </div>

                      )}

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </div>
  );
}