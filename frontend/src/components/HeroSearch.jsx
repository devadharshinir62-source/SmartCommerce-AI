import React, { useState } from 'react';
import { Sparkles, Search, ArrowRight, CornerDownLeft, Zap, DollarSign, Tag, CheckCircle2, RotateCcw } from 'lucide-react';

const SAMPLE_PROMPTS = [
  "I need a laptop for coding under ₹60,000",
  "Best smartphone with great camera under ₹30,000",
  "Sony noise cancelling headphones for deep focus",
  "Wireless mechanical keyboard for programming",
  "4K monitor for multi-window development under ₹25,000",
  "Budget student laptop under ₹40,000"
];

export default function HeroSearch({ onSearch, isLoading, activeCriteria, onResetSearch }) {
  const [inputQuery, setInputQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      onSearch(inputQuery.trim());
    }
  };

  const handlePromptClick = (prompt) => {
    setInputQuery(prompt);
    onSearch(prompt);
  };

  return (
    <div className="relative pt-8 pb-12 overflow-hidden">
      {/* Background ambient glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-0 right-1/4 w-[400px] h-[250px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Top Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs sm:text-sm font-medium mb-6 animate-pulse-subtle">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>AI-Powered Natural Language Shopping Assistant</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
          What are you shopping for <br className="hidden sm:inline" />
          <span className="gradient-text">today?</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8">
          Tell us your budget, requirements, or use-case in plain English. Our AI analyzes your needs and suggests the top matching gear with clear explanations.
        </p>

        {/* Search Bar Form */}
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto mb-6">
          <div className="relative flex items-center shadow-2xl rounded-2xl p-2 bg-slate-800/90 border border-slate-700/80 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/30 transition-all">
            <div className="pl-3 pr-2 text-brand-400">
              <Sparkles className="w-5 h-5" />
            </div>
            
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="e.g. I need a laptop for coding under ₹60,000"
              className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none px-2 py-2.5"
            />

            {inputQuery && (
              <button
                type="button"
                onClick={() => setInputQuery('')}
                className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 mr-1 rounded-md hover:bg-slate-700"
              >
                Clear
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-md transition-all shrink-0"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Recommend</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Active AI Analyzed Criteria Tags */}
        {activeCriteria && (
          <div className="mb-6 p-4 rounded-xl bg-slate-800/60 border border-brand-500/30 text-left transition-all animate-fadeIn">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2 pb-2 border-b border-slate-700/50">
              <div className="flex items-center space-x-2 text-xs font-semibold text-brand-400 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" />
                <span>AI Requirement Analysis Result</span>
              </div>
              <button
                onClick={onResetSearch}
                className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-700/50 hover:bg-slate-700"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset View</span>
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {activeCriteria.category && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  <Tag className="w-3 h-3" />
                  <span>Category: {activeCriteria.category}</span>
                </span>
              )}
              {activeCriteria.max_budget && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  <DollarSign className="w-3 h-3" />
                  <span>Budget: Under ₹{activeCriteria.max_budget.toLocaleString('en-IN')}</span>
                </span>
              )}
              {activeCriteria.intent_tags && activeCriteria.intent_tags.length > 0 && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Focus: {activeCriteria.intent_tags.join(', ')}</span>
                </span>
              )}
              {activeCriteria.preferred_brands && activeCriteria.preferred_brands.length > 0 && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  <span>Brand: {activeCriteria.preferred_brands.join(', ')}</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Suggestion Chips */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-slate-400">
          <span className="shrink-0 font-medium">Try asking:</span>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {SAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePromptClick(prompt)}
                className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 hover:border-brand-500/40 text-slate-300 hover:text-white transition-all text-xs text-left"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
