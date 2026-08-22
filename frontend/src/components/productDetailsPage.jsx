import React from 'react';
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Check,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';

export default function ProductDetailsPage({
  product,
  onBack,
  onAddToCart,
  onAskAi,
  onBuyNow,
  isInCart = false
}) {
  if (!product) return null;

  const discountPercent =
    product.original_price &&
    Number(product.original_price) > Number(product.price)
      ? Math.round(
          ((Number(product.original_price) -
            Number(product.price)) /
            Number(product.original_price)) *
            100
        )
      : null;

  const imageUrl =
    product.image_url ||
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1000&q=80';

  const handleAddToCart = () => {
    if (!isInCart && onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow(product);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Product Image */}
          <div className="rounded-3xl overflow-hidden bg-slate-800 border border-slate-700">
            <div className="relative aspect-square bg-slate-900">

              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur border border-slate-700 text-sm font-semibold text-slate-200">
                {product.category}
              </div>

              {product.match_score !== undefined &&
                product.match_score !== null && (
                  <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-slate-950 text-sm font-bold">
                    <Sparkles className="w-4 h-4" />
                    {product.match_score}% Match
                  </div>
                )}

              {product.ai_badge && (
                <div className="absolute bottom-5 left-5 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-bold uppercase">
                  {product.ai_badge}
                </div>
              )}

            </div>
          </div>

          {/* Product Information */}
          <div className="flex flex-col">

            {/* Brand and Rating */}
            <div className="flex items-center justify-between gap-4 mb-4">

              <span className="text-sm font-bold uppercase tracking-wider text-brand-400">
                {product.brand || 'Product'}
              </span>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20">

                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />

                <span className="font-bold text-slate-100">
                  {product.rating || 'N/A'}
                </span>

                {product.review_count && (
                  <span className="text-xs text-slate-400">
                    ({product.review_count} reviews)
                  </span>
                )}

              </div>
            </div>

            {/* Product Name */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight mb-5">
              {product.name}
            </h1>

            {/* Description */}
            <p className="text-base text-slate-400 leading-relaxed mb-6">
              {product.description ||
                'No description available for this product.'}
            </p>

            {/* Price */}
            <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700 mb-6">

              <div className="flex items-center gap-3 flex-wrap">

                <span className="text-3xl font-extrabold text-white">
                  ₹{Number(product.price || 0).toLocaleString('en-IN')}
                </span>

                {product.original_price && (
                  <span className="text-lg text-slate-500 line-through">
                    ₹{Number(product.original_price).toLocaleString('en-IN')}
                  </span>
                )}

                {discountPercent && (
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-sm">
                    {discountPercent}% OFF
                  </span>
                )}

              </div>
            </div>

            {/* Specifications */}
            {product.specs &&
              Object.keys(product.specs).length > 0 && (
                <div className="mb-6">

                  <h2 className="text-lg font-bold text-white mb-4">
                    Product Specifications
                  </h2>

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
                            {value}
                          </p>
                        </div>
                      )
                    )}

                  </div>
                </div>
              )}

            {/* AI Reasons */}
            {Array.isArray(product.match_reasons) &&
              product.match_reasons.length > 0 && (
                <div className="mb-6 p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">

                  <div className="flex items-center gap-2 mb-3 text-emerald-400">

                    <ShieldCheck className="w-5 h-5" />

                    <h2 className="font-bold">
                      Why AI Recommends This
                    </h2>

                  </div>

                  <ul className="space-y-2">

                    {product.match_reasons.map((reason, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-slate-300"
                      >
                        <span className="text-emerald-400">✓</span>
                        {reason}
                      </li>
                    ))}

                  </ul>

                </div>
              )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-auto">

              {/* Ask AI */}
              <button
                onClick={() => onAskAi && onAskAi(product)}
                className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold transition"
              >
                <MessageSquare className="w-5 h-5 text-brand-400" />
                Ask AI
              </button>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isInCart}
                className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-bold transition ${
                  isInCart
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-brand-600 hover:bg-brand-500 text-white'
                }`}
              >
                {isInCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add Cart
                  </>
                )}
              </button>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold transition shadow-lg"
              >
                <Zap className="w-5 h-5" />
                Buy Now
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}