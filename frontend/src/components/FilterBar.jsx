import React from 'react';
import { SlidersHorizontal, ArrowDownUp, Sparkles, Filter } from 'lucide-react';

const CATEGORIES = ["All", "Laptops", "Smartphones", "Audio", "Accessories", "Monitors"];

export default function FilterBar({
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  totalResults,
  isAiResult
}) {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
      
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'bg-slate-700/40 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Right Side: Total Count & Sort By */}
      <div className="flex items-center justify-between md:justify-end gap-3 text-xs sm:text-sm">
        <div className="text-slate-400 font-medium">
          Showing <span className="text-white font-bold">{totalResults}</span> product{totalResults !== 1 ? 's' : ''}
        </div>

        <div className="flex items-center space-x-2 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-700/80">
          <ArrowDownUp className="w-3.5 h-3.5 text-brand-400" />
          <span className="text-slate-400 text-xs hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
          >
            {isAiResult && <option value="relevance" className="bg-slate-800 text-white">AI Match Score</option>}
            <option value="featured" className="bg-slate-800 text-white">Featured</option>
            <option value="price_asc" className="bg-slate-800 text-white">Price: Low to High</option>
            <option value="price_desc" className="bg-slate-800 text-white">Price: High to Low</option>
            <option value="rating" className="bg-slate-800 text-white">Highest Rated</option>
          </select>
        </div>
      </div>

    </div>
  );
}
