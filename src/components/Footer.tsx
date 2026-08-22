import React from 'react';
import { useApp } from '../context/AppContext';
import { RotateCcw, Wrench, ShieldCheck, Leaf, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center">
                <RotateCcw className="w-4 h-4 text-emerald-100" />
              </div>
              <span className="text-base font-black tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                FixWise<span className="text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Repair smarter. Replace less. The AI-powered decision intelligence and verified local repair marketplace.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400 font-medium">
              <Leaf className="w-3.5 h-3.5" />
              <span>Dedicated to reducing global electronic waste</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              Platform Features
            </h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('diagnose')} className="hover:text-white transition-colors">
                  AI Visual Diagnosis
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('repairers')} className="hover:text-white transition-colors">
                  Local Repairer Map
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('quotes')} className="hover:text-white transition-colors">
                  Quote Comparison Engine
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('repairs')} className="hover:text-white transition-colors">
                  Live Repair Tracking
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('calculator')} className="hover:text-white transition-colors">
                  Repair vs. Replace Calculator
                </button>
              </li>
            </ul>
          </div>

          {/* Passports & Portals */}
          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              Ecosystem
            </h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('devices')} className="hover:text-white transition-colors">
                  Digital Repair Passports
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('impact')} className="hover:text-white transition-colors">
                  Sustainability Impact Tracker
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('history')} className="hover:text-white transition-colors">
                  Warranty & Service History
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('repairer_portal')} className="hover:text-white transition-colors">
                  Technician Lab Portal
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admin_portal')} className="hover:text-white transition-colors">
                  Admin Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Safety & Compliance */}
          <div className="space-y-2 text-xs">
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              Engineering Principles
            </h5>
            <div className="flex items-start gap-2 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-300 leading-snug">
                <strong className="text-white">Deterministic Rules:</strong> Repairability scores and financial ROI recommendations are computed by deterministic application code, not unconstrained LLMs.
              </p>
            </div>
            <p className="text-[10px] text-slate-500 pt-1">
              AI-assisted diagnosis provides technical probability estimates. Always exercise caution with lithium batteries and electrical equipment.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} FixWise AI Inc. Built for sustainability & circular economy.
          </div>
          <div className="flex items-center gap-4">
            <span>Bangalore, KA • New Delhi • San Francisco</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
