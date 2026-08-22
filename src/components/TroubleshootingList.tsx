import React, { useState } from 'react';
import { TroubleshootingStep } from '../types';
import { ChevronDown, ChevronUp, Clock, CheckCircle2, AlertCircle, Wrench } from 'lucide-react';

interface TroubleshootingListProps {
  steps: TroubleshootingStep[];
}

export const TroubleshootingList: React.FC<TroubleshootingListProps> = ({ steps }) => {
  const [expandedId, setExpandedId] = useState<string | null>(steps[0]?.id || null);

  if (!steps || steps.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-emerald-600" />
            Safe Self-Troubleshooting Steps
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Non-invasive checks you can perform at home before booking technician service.
          </p>
        </div>
        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          {steps.length} Steps
        </span>
      </div>

      <div className="space-y-2.5">
        {steps.map((step, index) => {
          const isExpanded = expandedId === step.id;

          return (
            <div
              key={step.id || index}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? 'bg-slate-50/90 border-emerald-500/40 ring-1 ring-emerald-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : step.id)}
                className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 hover:bg-slate-50/70 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 block truncate">
                      {step.title}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {step.timeEstimate || '2 min'}
                      </span>
                      <span>•</span>
                      <span
                        className={`font-semibold ${
                          step.difficulty === 'Easy'
                            ? 'text-emerald-700'
                            : step.difficulty === 'Medium'
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {step.difficulty || 'Easy'}
                      </span>
                      <span>•</span>
                      <span className="text-slate-500">{step.riskLevel || 'Low risk'}</span>
                    </div>
                  </div>
                </div>

                <div className="text-slate-400 shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-700 border-t border-slate-200/60 mt-1">
                  <p className="font-medium text-slate-600 mb-3">{step.description}</p>

                  <div className="bg-white rounded-lg p-3 border border-slate-200/70 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Step-by-Step Instructions:
                    </span>
                    {step.instructions && step.instructions.map((inst, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{inst}</span>
                      </div>
                    ))}
                  </div>

                  {!step.safeForDIY && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>This step requires caution. If you lack anti-static grounding, consult a verified technician.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
