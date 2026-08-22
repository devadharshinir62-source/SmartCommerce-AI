import React from 'react';
import {
  Star,
  MessageSquare,
  Check,
  Sparkles,
  ShieldCheck,
  Eye,
  Heart
} from 'lucide-react';

export default function ProductCard({
  product,
  onAskAi,
  onAddToCart,
  onViewDetails,
  onToggleWishlist,
  isInCart = false,
  isWishlisted = false
}) {
  const discountPercent =
    product.original_price &&
    Number(product.original_price) > Number(product.price)
      ? Math.round(
          ((Number(product.original_price) - Number(product.price)) /
            Number(product.original_price)) *
            100
        )
      : null;

  const handleAdd = () => {
    if (!isInCart && onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleWishlist = () => {
    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };

  const imageUrl =
    product.image_url ||
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="group relative flex flex-col rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-brand-500/50 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 overflow-hidden">

      {/* Product Image */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-900/50">

        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-slate-200 border border-slate-700/60">
          {product.category}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${
            isWishlisted
              ? 'bg-red-500 border-red-400 text-white scale-105'
              : 'bg-slate-900/80 border-slate-600 text-slate-200 hover:bg-red-500 hover:border-red-400 hover:text-white'
          }`}
          title={
            isWishlisted
              ? 'Remove from Wishlist'
              : 'Add to Wishlist'
          }
        >
          <Heart
            className={`w-5 h-5 ${
              isWishlisted ? 'fill-current' : ''
            }`}
          />
        </button>

        {/* AI Match Score */}
        {product.match_score !== undefined &&
          product.match_score !== null && (
            <div className="absolute top-3 right-3 flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/90 text-slate-950 shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{product.match_score}% Match</span>
            </div>
          )}

        {/* AI Badge */}
        {product.ai_badge && (
          <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-brand-500 text-white shadow-md">
            {product.ai_badge}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">

          {/* Brand and Rating */}
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className="font-semibold text-brand-400 uppercase tracking-wider">
              {product.brand || 'Product'}
            </span>

            <div className="flex items-center space-x-1 text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
              <Star className="w-3.5 h-3.5 fill-amber-400" />

              <span className="font-bold text-slate-200">
                {product.rating || 'N/A'}
              </span>

              {product.review_count && (
                <span className="text-slate-500 text-[10px]">
                  ({product.review_count})
                </span>
              )}
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-brand-300 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-400 mb-3 line-clamp-2">
            {product.description || 'No description available.'}
          </p>

          {/* AI Reasons */}
          {Array.isArray(product.match_reasons) &&
            product.match_reasons.length > 0 && (
              <div className="mb-3 p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs">

                <div className="text-[11px] font-semibold text-emerald-400 mb-1 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Why AI Picked This:</span>
                </div>

                <ul className="space-y-1">
                  {product.match_reasons
                    .slice(0, 2)
                    .map((reason, index) => (
                      <li
                        key={index}
                        className="text-slate-300 flex items-start space-x-1 text-[11px]"
                      >
                        <span className="text-emerald-400">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

          {/* Product Specs */}
          {product.specs &&
            Object.keys(product.specs).length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5">
                {Object.entries(product.specs)
                  .slice(0, 3)
                  .map(([key, value], index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-700/60 border border-slate-600/40 text-slate-300"
                    >
                      <strong className="text-slate-400">
                        {key}:
                      </strong>{' '}
                      {value}
                    </span>
                  ))}
              </div>
            )}
        </div>

        {/* Price and Buttons */}
        <div className="pt-3 border-t border-slate-700/50 mt-auto">

          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xl font-extrabold text-white">
                ₹{Number(product.price || 0).toLocaleString('en-IN')}
              </span>

              {product.original_price && (
                <span className="ml-2 text-xs text-slate-500 line-through">
                  ₹{Number(product.original_price).toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {discountPercent && (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* View Details */}
          <button
            onClick={() =>
              onViewDetails && onViewDetails(product)
            }
            className="w-full mb-2 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-semibold transition-all"
          >
            <Eye className="w-4 h-4 text-brand-400" />
            View Details
          </button>

          {/* Ask AI + Cart */}
          <div className="grid grid-cols-2 gap-2">

            <button
              onClick={() =>
                onAskAi && onAskAi(product)
              }
              className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-700/70 hover:bg-slate-700 border border-slate-600/50 text-slate-200 text-xs font-medium transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 text-brand-400" />
              <span>Ask AI</span>
            </button>

            <button
              onClick={handleAdd}
              disabled={isInCart}
              className={`inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isInCart
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-brand-600 hover:bg-brand-500 text-white shadow-sm'
              }`}
            >
              {isInCart ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <span>Add to Cart</span>
              )}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}