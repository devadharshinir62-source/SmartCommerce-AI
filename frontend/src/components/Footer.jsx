import React from 'react';
import { Cpu, Heart, Database, Zap, Code2, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-bold">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold text-white">
                SmartCommerce <span className="gradient-text">AI</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              An intelligent, full-stack shopping assistant designed to parse requirements in plain natural language, recommend matching tech products, and answer buying questions.
            </p>
          </div>

          {/* Col 2: Tech Stack */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Tech Architecture</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
                <span>FastAPI Python Backend</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>React 18 + Vite Frontend</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span>SQLite with SQLAlchemy ORM</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                <span>Tailwind CSS + Lucide Icons</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Features */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Core Features</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• Intent & Budget Extraction</li>
              <li>• Relevance Scoring Engine</li>
              <li>• Contextual Product Q&A Chatbot</li>
              <li>• Local SQLite Dataset (INR ₹)</li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} SmartCommerce AI. Built for full-stack AI development.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Local Heuristic NLP Engine</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
