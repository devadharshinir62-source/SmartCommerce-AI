import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, User, RefreshCw, Trash2, ArrowUpRight, HelpCircle, CheckCircle } from 'lucide-react';
import { sendChatMessage } from '../api/api';

export default function ChatBot({ isOpen, onClose, contextProduct, onClearContextProduct }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 **Hello! I'm your SmartCommerce AI shopping assistant.**\n\nI can help you find products, compare specs, check RAM/battery details, and recommend the best gear for coding, gaming, or everyday use.\n\nHow can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [followups, setFollowups] = useState([
    "I need a laptop for coding under ₹60,000",
    "Which laptop has 16GB RAM and Ryzen 7?",
    "Best noise cancelling headphones for deep focus"
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // When a context product is selected from a card, notify in chat
  useEffect(() => {
    if (contextProduct && isOpen) {
      const prompt = `Tell me more about ${contextProduct.name}. Is it good for coding and multitasking?`;
      handleSend(prompt);
    }
  }, [contextProduct]);

  const handleSend = async (messageToSend) => {
    const text = messageToSend || input.trim();
    if (!text || loading) return;

    // Add user message to history
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Prepare history formatted for API
      const historyPayload = newMessages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await sendChatMessage(text, historyPayload, contextProduct?.id || null);
      
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.reply, related: res.related_products }
      ]);

      if (res.suggested_followups && res.suggested_followups.length > 0) {
        setFollowups(res.suggested_followups);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ *Sorry, I had trouble connecting to the backend server. Please make sure the FastAPI backend is running on http://localhost:8000.*`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Chat history cleared. How else can I assist your shopping today?"
      }
    ]);
    if (onClearContextProduct) onClearContextProduct();
  };

  // Simple renderer for markdown-like text (bold, lists, headers, tables)
  const renderFormattedText = (text) => {
    // Replace markdown bold, headings, bullets
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-sm font-bold text-brand-300 mt-2 mb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-base font-bold text-white mt-2 mb-1">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
        const itemContent = line.replace(/^[-•*]\s*/, '');
        return (
          <div key={idx} className="flex items-start space-x-1.5 my-1 text-xs sm:text-sm text-slate-200">
            <span className="text-brand-400 font-bold shrink-0">•</span>
            <span dangerouslySetInnerHTML={{ __html: itemContent.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>') }}></span>
          </div>
        );
      }
      if (line.startsWith('|')) {
        // Table line
        return (
          <div key={idx} className="text-[11px] font-mono bg-slate-900/60 px-2 py-0.5 border-x border-slate-700/60 overflow-x-auto">
            {line}
          </div>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-2"></div>;
      }
      return (
        <p
          key={idx}
          className="text-xs sm:text-sm text-slate-200 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
          }}
        />
      );
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          const evt = new CustomEvent('open-smart-chat');
          window.dispatchEvent(evt);
        }}
        className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold shadow-2xl shadow-brand-500/40 hover:shadow-brand-500/60 transition-all transform hover:-translate-y-0.5 active:scale-95 group"
      >
        <div className="relative">
          <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900"></span>
        </div>
        <span className="text-sm">Smart AI Assistant</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[95vw] sm:w-[420px] max-h-[85vh] h-[650px] flex flex-col rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden backdrop-blur-2xl animate-in slide-in-from-bottom-5 duration-300">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border-b border-slate-700/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900"></span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <span>SmartCommerce AI</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Online</span>
            </h3>
            <p className="text-[11px] text-slate-400">Your AI Shopping Advisor</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handleClearHistory}
            title="Clear Chat"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            title="Close"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Context Product Banner if selected */}
      {contextProduct && (
        <div className="bg-brand-950/60 border-b border-brand-500/20 px-3 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 truncate">
            <Sparkles className="w-3.5 h-3.5 text-brand-400 shrink-0" />
            <span className="text-slate-300 truncate">
              Discussing: <strong className="text-white">{contextProduct.name}</strong>
            </span>
          </div>
          <button
            onClick={onClearContextProduct}
            className="text-slate-400 hover:text-white text-[11px] px-1.5 py-0.5 rounded hover:bg-brand-900/60 ml-2 shrink-0"
          >
            Clear
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={index}
              className={`flex items-start space-x-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-brand-600/30 border border-brand-500/30 text-brand-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm shadow-md ${
                  isUser
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-tl-none'
                }`}
              >
                {renderFormattedText(msg.content)}

                {/* Optional Related Products Links in Chat */}
                {msg.related && msg.related.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-700/60 space-y-1.5">
                    <span className="text-[11px] font-semibold text-brand-400 block">Referenced Products:</span>
                    {msg.related.map((prod) => (
                      <div
                        key={prod.id}
                        className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/80 border border-slate-700 text-xs"
                      >
                        <span className="text-slate-200 truncate pr-2">{prod.name}</span>
                        <span className="text-emerald-400 font-bold shrink-0">₹{prod.price.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-2.5 text-slate-400 text-xs py-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600/20 text-brand-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-2 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              <span className="text-[11px] text-slate-400 ml-1">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Followup Prompt Chips */}
      {followups && followups.length > 0 && (
        <div className="px-3 py-2 bg-slate-900 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <Sparkles className="w-3.5 h-3.5 text-brand-400 shrink-0" />
          {followups.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-[11px] whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about laptops, specs, budget..."
          className="flex-1 bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-md transition-all shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
