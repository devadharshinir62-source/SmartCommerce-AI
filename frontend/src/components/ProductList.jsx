import React from 'react';

import ProductCard from './ProductCard';

import {
  PackageSearch,
  Sparkles
} from 'lucide-react';

export default function ProductList({
  products = [],
  isLoading,
  aiSummary,
  onAskAi,
  onAddToCart,
  onViewDetails,
  cart = [],
  onResetFilters
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">

        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-5 h-96 flex flex-col justify-between"
          >
            <div className="bg-slate-700/50 h-48 rounded-xl w-full mb-4" />

            <div className="space-y-2.5">
              <div className="h-4 bg-slate-700/50 rounded w-3/4" />
              <div className="h-3 bg-slate-700/30 rounded w-full" />
              <div className="h-3 bg-slate-700/30 rounded w-1/2" />
            </div>

            <div className="h-10 bg-slate-700/50 rounded-xl mt-4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>

      {/* AI Summary */}
      {aiSummary && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-brand-900/40 via-indigo-950/40 to-slate-900 border border-brand-500/30 flex items-start space-x-3 shadow-lg">

          <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-1">
              AI Recommendation Analysis
            </h4>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {aiSummary}
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-800/30 border border-slate-700/40 max-w-lg mx-auto">

          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400 border border-slate-700">
            <PackageSearch className="w-8 h-8 text-brand-400" />
          </div>

          <h3 className="text-lg font-bold text-white mb-2">
            No matching products found
          </h3>

          <p className="text-sm text-slate-400 mb-6">
            Try adjusting your filters or search criteria.
          </p>

          <button
            onClick={onResetFilters}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all"
          >
            Reset Filters & View All
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {products.map((product) => {
            const isInCart = cart.some(
              (item) => item.id === product.id
            );

            return (
              <ProductCard
                key={product.id}
                product={product}
                onAskAi={onAskAi}
                onAddToCart={onAddToCart}
                onViewDetails={onViewDetails}
                isInCart={isInCart}
              />
            );
          })}

        </div>
      )}
    </div>
  );
}