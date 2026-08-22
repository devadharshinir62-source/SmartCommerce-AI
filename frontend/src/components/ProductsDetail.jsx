import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  MessageSquare,
  Check,
  Tag,
  ShieldCheck,
} from 'lucide-react';

export default function ProductDetails({
  product,
  onBack,
  onAddToCart,
  onAskAi,
}) {
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString('en-IN')}`;
  };

  const discountPercent =
    product.original_price &&
    product.original_price > product.price
      ? Math.round(
          ((product.original_price - product.price) /
            product.original_price) *
            100
        )
      : null;

  const handleAdd = () => {
    onAddToCart(product);

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <div className="py-8 sm:py-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="rounded-3xl overflow-hidden bg-slate-800 border border-slate-700 shadow-xl">
          <div className="relative aspect-square bg-slate-900">
            <img
              src={
                product.image_url ||
                'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1000&q=80'
              }
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {product.ai_badge && (
              <div className="absolute top-5 left-5 px-3 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-lg">
                {product.ai_badge}
              </div>
            )}

            {product.match_score !== undefined && (
              <div className="absolute top-5 right-5 px-3 py-1.5 rounded-xl bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg">
                {product.match_score}% Match
              </div>
            )}
          </div>
        </div>

        {/* Product Information */}
        <div className="flex flex-col">
          {/* Category and Brand */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
              {product.category}
            </span>

            {product.brand && (
              <span className="text-sm font-semibold text-slate-400">
                {product.brand}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-5">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/20">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />

              <span className="font-bold text-amber-300">
                {product.rating || 'N/A'}
              </span>
            </div>

            {product.review_count && (
              <span className="text-sm text-slate-400">
                {Number(product.review_count).toLocaleString('en-IN')} reviews
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mt-7">
            <h2 className="text-lg font-bold text-white mb-3">
              About this product
            </h2>

            <p className="text-slate-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price */}
          <div className="mt-8 p-5 rounded-2xl bg-slate-800/70 border border-slate-700">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-3xl font-extrabold text-white">
                {formatPrice(product.price)}
              </span>

              {product.original_price && (
                <span className="text-base text-slate-500 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}

              {discountPercent && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          {/* AI Recommendation */}
          {product.match_reasons &&
            product.match_reasons.length > 0 && (
              <div className="mt-6 p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />

                  <h2 className="font-bold text-emerald-300">
                    Why AI recommends this
                  </h2>
                </div>

                <ul className="space-y-2">
                  {product.match_reasons.map((reason, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-slate-300"
                    >
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />

                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Specifications */}
          {product.specs &&
            Object.keys(product.specs).length > 0 && (
              <div className="mt-7">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-brand-400" />

                  <h2 className="text-lg font-bold text-white">
                    Specifications
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(product.specs).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="p-4 rounded-xl bg-slate-800 border border-slate-700"
                      >
                        <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">
                          {key}
                        </p>

                        <p className="text-sm font-semibold text-slate-200">
                          {String(value)}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          {/* Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
            <button
              onClick={() => onAskAi(product)}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold transition"
            >
              <MessageSquare className="w-5 h-5 text-brand-400" />
              Ask AI About This
            </button>

            <button
              onClick={handleAdd}
              className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold transition ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}