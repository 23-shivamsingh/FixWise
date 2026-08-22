import React from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_PRESET_CASES } from '../data/seedData';
import { Sparkles, Laptop, Smartphone, Flame, Headphones, Check } from 'lucide-react';

interface DemoCaseSelectorProps {
  onCaseSelected?: () => void;
  compact?: boolean;
}

export const DemoCaseSelector: React.FC<DemoCaseSelectorProps> = ({ onCaseSelected, compact = false }) => {
  const { currentDiagnosis, loadDemoCase } = useApp();

  const getIcon = (cat: string, id: string) => {
    if (id.includes('battery')) return <Flame className="w-4 h-4 text-rose-600" />;
    if (cat === 'laptop') return <Laptop className="w-4 h-4 text-emerald-600" />;
    if (cat === 'smartphone') return <Smartphone className="w-4 h-4 text-blue-600" />;
    if (cat === 'headphones') return <Headphones className="w-4 h-4 text-amber-600" />;
    return <Sparkles className="w-4 h-4 text-emerald-600" />;
  };

  return (
    <div className={`w-full ${compact ? '' : 'bg-slate-900 text-white rounded-3xl p-5 md:p-6 shadow-xl border border-slate-800'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className={`text-sm font-extrabold tracking-tight ${compact ? 'text-slate-900' : 'text-white'}`}>
              Judge 1-Click Interactive Demo Cases
            </h4>
            <p className={`text-xs ${compact ? 'text-slate-500' : 'text-slate-400'}`}>
              Instant end-to-end evaluation with pre-seeded hardware telemetry & quotes.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {DEMO_PRESET_CASES.map((demo) => {
          const isCurrent = currentDiagnosis?.deviceModel === demo.diagnosis.deviceModel;

          return (
            <button
              key={demo.id}
              onClick={() => {
                loadDemoCase(demo.id);
                if (onCaseSelected) onCaseSelected();
              }}
              className={`text-left p-3.5 rounded-2xl border transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden group ${
                isCurrent
                  ? compact
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/40 shadow-xs'
                  : compact
                  ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  : 'bg-slate-800/80 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-white/10 shrink-0">
                  {getIcon(demo.category, demo.id)}
                </div>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  demo.id.includes('swollen')
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {demo.highlightTag}
                </span>
              </div>

              <h5 className={`text-xs font-bold truncate ${compact ? 'text-slate-900' : 'text-white'}`}>
                {demo.name}
              </h5>

              <div className={`flex items-center justify-between text-[11px] mt-2 pt-2 border-t ${
                compact ? 'border-slate-100 text-slate-500' : 'border-slate-700/60 text-slate-400'
              }`}>
                <span>{demo.brand} {demo.model}</span>
                <span className="font-extrabold text-emerald-400">
                  Save ₹{(demo.diagnosis.estimatedSavings || 50000).toLocaleString('en-IN')}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
