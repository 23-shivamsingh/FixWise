import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Sparkles, Send, X, Bot, User, ArrowRight, ShieldAlert, Wrench } from 'lucide-react';

export const CopilotModal: React.FC = () => {
  const {
    copilotOpen,
    setCopilotOpen,
    copilotMessages,
    sendCopilotMessage,
    currentDiagnosis,
    setActiveTab,
  } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (copilotOpen) {
      scrollToBottom();
    }
  }, [copilotMessages, copilotOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    setInput('');
    setLoading(true);
    try {
      await sendCopilotMessage(text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      {!copilotOpen && (
        <button
          onClick={() => setCopilotOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-emerald-700 hover:bg-emerald-800 text-white p-3.5 md:px-5 md:py-3.5 rounded-full shadow-2xl shadow-emerald-900/30 flex items-center gap-2.5 transition-all hover:scale-105 group border-2 border-emerald-500/40"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-emerald-200" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping" />
          </div>
          <span className="hidden md:inline text-xs font-black tracking-wide uppercase">
            FixWise Copilot
          </span>
        </button>
      )}

      {/* Copilot Chat Window */}
      {copilotOpen && (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] md:w-[440px] h-[580px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-emerald-800 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-700 border border-emerald-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <h4 className="text-sm font-black tracking-tight leading-none">
                  FixWise AI Copilot
                </h4>
                <p className="text-[11px] text-emerald-200 mt-1">
                  {currentDiagnosis
                    ? `Context: ${currentDiagnosis.brand} ${currentDiagnosis.deviceModel}`
                    : 'Hardware Repair Specialist'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setCopilotOpen(false)}
              className="w-8 h-8 rounded-full bg-emerald-700/60 hover:bg-emerald-700 flex items-center justify-center text-emerald-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Active Case Context Chip */}
          {currentDiagnosis && (
            <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 flex items-center justify-between text-[11px]">
              <span className="font-semibold text-emerald-900 truncate">
                Active Case: {currentDiagnosis.identifiedIssue}
              </span>
              <button
                onClick={() => {
                  setActiveTab('diagnose');
                  setCopilotOpen(false);
                }}
                className="text-emerald-700 font-bold hover:underline shrink-0 ml-2 flex items-center gap-0.5"
              >
                View <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {copilotMessages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-medium leading-relaxed ${
                      isUser
                        ? 'bg-emerald-700 text-white rounded-br-none shadow-sm'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>

                    {/* Suggested Prompts */}
                    {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Suggested questions:
                        </span>
                        {msg.suggestedPrompts.map((p, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(p)}
                            className="w-full text-left text-[11px] font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 p-2 rounded-lg transition-colors flex items-center justify-between border border-emerald-100"
                          >
                            <span>{p}</span>
                            <ArrowRight className="w-3 h-3 text-emerald-600 shrink-0 ml-1" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-2xl text-xs text-slate-500 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] font-medium">Analyzing hardware context...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Strip */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap">
            <button
              onClick={() => handleSend('Is it safe to repair this myself?')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium transition-colors"
            >
              DIY Safety?
            </button>
            <button
              onClick={() => handleSend('What questions should I ask the technician?')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium transition-colors"
            >
              Ask Technician?
            </button>
            <button
              onClick={() => handleSend('Is the ₹3,200 quote fair?')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium transition-colors"
            >
              Quote Fairness?
            </button>
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about diagnosis, costs, or safety..."
              className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-900 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white flex items-center justify-center shrink-0 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
