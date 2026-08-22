import React, { useMemo, useState } from 'react';

import {
  ArrowLeft,
  CreditCard,
  MapPin,
  PackageCheck,
  ShoppingBag,
  CheckCircle2,
  Truck,
  Landmark,
  Wallet
} from 'lucide-react';

export default function CheckoutPage({
  cart = [],
  onBack,
  onOrderSuccess
}) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const totalItems = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
        Number(item.quantity || 1),
      0
    );
  }, [cart]);

  const deliveryCharge = subtotal > 50000 ? 0 : 99;

  const finalTotal = subtotal + deliveryCharge;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      alert('Please fill in all delivery details.');
      return;
    }

    setIsPlacingOrder(true);

    setTimeout(() => {
      setIsPlacingOrder(false);
      setIsOrderPlaced(true);
    }, 1000);
  };

  const handleContinueShopping = () => {
    const orderData = {
      id: `ORD-${Date.now()}`,
      orderDate: new Date().toISOString(),
      items: cart.map((item) => ({ ...item })),
      totalItems,
      subtotal,
      deliveryCharge,
      total: finalTotal,
      paymentMethod,
      customer: { ...formData }
    };

    if (onOrderSuccess) {
      onOrderSuccess(orderData);
    }
  };

  if (cart.length === 0 && !isOrderPlaced) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-4">

        <div className="max-w-md w-full text-center p-8 rounded-3xl bg-slate-800 border border-slate-700">

          <ShoppingBag className="w-16 h-16 mx-auto mb-5 text-brand-400" />

          <h1 className="text-2xl font-bold text-white mb-3">
            Your Cart is Empty
          </h1>

          <p className="text-slate-400 mb-6">
            Add some products before proceeding to checkout.
          </p>

          <button
            onClick={onBack}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition"
          >
            Back to Shopping
          </button>

        </div>
      </div>
    );
  }

  if (isOrderPlaced) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-4">

        <div className="max-w-lg w-full text-center p-8 sm:p-12 rounded-3xl bg-slate-800 border border-emerald-500/30 shadow-2xl">

          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-3">
            Order Placed Successfully!
          </h1>

          <p className="text-slate-400 mb-6">
            Thank you for shopping with SmartCommerce AI.
            Your order has been placed successfully.
          </p>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 mb-6">

            <p className="text-sm text-slate-400 mb-1">
              Order Total
            </p>

            <p className="text-3xl font-extrabold text-emerald-400">
              ₹{finalTotal.toLocaleString('en-IN')}
            </p>

            <p className="text-xs text-slate-500 mt-2">
              {totalItems} item{totalItems !== 1 ? 's' : ''} ordered
            </p>

          </div>

          <button
            onClick={handleContinueShopping}
            className="w-full py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition"
          >
            Continue Shopping
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </button>

        <div className="mb-8">

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Checkout
          </h1>

          <p className="text-slate-400 mt-2">
            Complete your details and place your order securely.
          </p>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <form
            id="checkout-form"
            onSubmit={handlePlaceOrder}
            className="lg:col-span-2 space-y-6"
          >

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-800 border border-slate-700">

              <div className="flex items-center gap-3 mb-5">

                <div className="p-2.5 rounded-xl bg-brand-500/10">
                  <PackageCheck className="w-5 h-5 text-brand-400" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white">
                    Customer Information
                  </h2>

                  <p className="text-xs text-slate-400">
                    Enter your contact details
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="sm:col-span-2">

                  <label className="block text-sm text-slate-300 mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-brand-500 outline-none text-white"
                  />

                </div>

                <div>

                  <label className="block text-sm text-slate-300 mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-brand-500 outline-none text-white"
                  />

                </div>

                <div>

                  <label className="block text-sm text-slate-300 mb-2">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-brand-500 outline-none text-white"
                  />

                </div>

              </div>

            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-800 border border-slate-700">

              <div className="flex items-center gap-3 mb-5">

                <div className="p-2.5 rounded-xl bg-emerald-500/10">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white">
                    Delivery Address
                  </h2>

                  <p className="text-xs text-slate-400">
                    Where should we deliver your order?
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="sm:col-span-2">

                  <label className="block text-sm text-slate-300 mb-2">
                    Complete Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    placeholder="House number, street, area"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-brand-500 outline-none text-white resize-none"
                  />

                </div>

                <div>

                  <label className="block text-sm text-slate-300 mb-2">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-brand-500 outline-none text-white"
                  />

                </div>

                <div>

                  <label className="block text-sm text-slate-300 mb-2">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-brand-500 outline-none text-white"
                  />

                </div>

                <div>

                  <label className="block text-sm text-slate-300 mb-2">
                    PIN Code
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter PIN code"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-brand-500 outline-none text-white"
                  />

                </div>

              </div>

            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-800 border border-slate-700">

              <div className="flex items-center gap-3 mb-5">

                <div className="p-2.5 rounded-xl bg-purple-500/10">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white">
                    Payment Method
                  </h2>

                  <p className="text-xs text-slate-400">
                    Select your preferred payment method
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border text-left transition ${
                    paymentMethod === 'card'
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-brand-400 mb-2" />

                  <p className="font-semibold text-white">
                    Card
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Credit or Debit
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-xl border text-left transition ${
                    paymentMethod === 'upi'
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                  }`}
                >
                  <Wallet className="w-5 h-5 text-emerald-400 mb-2" />

                  <p className="font-semibold text-white">
                    UPI
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Pay instantly
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border text-left transition ${
                    paymentMethod === 'cod'
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                  }`}
                >
                  <Landmark className="w-5 h-5 text-amber-400 mb-2" />

                  <p className="font-semibold text-white">
                    Cash on Delivery
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Pay at delivery
                  </p>
                </button>

              </div>

            </div>

            <button
              type="submit"
              disabled={isPlacingOrder}
              className="lg:hidden w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white font-bold transition"
            >
              <CheckCircle2 className="w-5 h-5" />

              {isPlacingOrder
                ? 'Placing Order...'
                : `Place Order • ₹${finalTotal.toLocaleString('en-IN')}`}
            </button>

          </form>

          <div className="lg:col-span-1">

            <div className="sticky top-6 p-5 sm:p-6 rounded-2xl bg-slate-800 border border-slate-700">

              <div className="flex items-center gap-3 mb-6">

                <ShoppingBag className="w-5 h-5 text-brand-400" />

                <div>
                  <h2 className="text-lg font-bold text-white">
                    Order Summary
                  </h2>

                  <p className="text-xs text-slate-400">
                    {totalItems} item{totalItems !== 1 ? 's' : ''}
                  </p>
                </div>

              </div>

              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">

                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3"
                  >

                    <img
                      src={
                        item.image_url ||
                        'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=300&q=80'
                      }
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-900"
                    />

                    <div className="flex-1 min-w-0">

                      <p className="text-sm font-semibold text-white line-clamp-2">
                        {item.name}
                      </p>

                      <div className="flex items-center justify-between mt-2">

                        <span className="text-xs text-slate-400">
                          Qty: {item.quantity}
                        </span>

                        <span className="text-sm font-bold text-brand-300">
                          ₹{(
                            Number(item.price || 0) *
                            Number(item.quantity || 1)
                          ).toLocaleString('en-IN')}
                        </span>

                      </div>

                    </div>

                  </div>
                ))}

              </div>

              <div className="border-t border-slate-700 mt-6 pt-5 space-y-3">

                <div className="flex justify-between text-sm">

                  <span className="text-slate-400">
                    Subtotal
                  </span>

                  <span className="text-white font-semibold">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-slate-400">
                    Delivery
                  </span>

                  <span className="text-emerald-400 font-semibold">
                    {deliveryCharge === 0
                      ? 'FREE'
                      : `₹${deliveryCharge}`}
                  </span>

                </div>

                <div className="flex justify-between items-center border-t border-slate-700 pt-4 mt-4">

                  <span className="text-base font-semibold text-slate-300">
                    Total Amount
                  </span>

                  <span className="text-2xl font-extrabold text-white">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>

                </div>

              </div>

              <div className="flex items-center gap-2 mt-5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">

                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />

                <span className="text-xs text-slate-400">
                  Free delivery on orders above ₹50,000
                </span>

              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isPlacingOrder}
                className="hidden lg:flex w-full mt-5 items-center justify-center gap-2 py-4 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white font-bold transition"
              >
                <CheckCircle2 className="w-5 h-5" />

                {isPlacingOrder
                  ? 'Placing Order...'
                  : `Place Order • ₹${finalTotal.toLocaleString('en-IN')}`}
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}