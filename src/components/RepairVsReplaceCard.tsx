import React from 'react';
import { CheckCircle2, TrendingUp, Sparkles, Leaf, ArrowRight, ShieldCheck } from 'lucide-react';

interface RepairVsReplaceCardProps {
  repairCost: number;
  replacementCost: number;
  expectedLifeExtensionMonths: number;
  expectedReplacementLifeYears: number;
  verdict: 'REPAIR' | 'CONSIDER REPLACEMENT';
  verdictReason: string;
  estimatedSavings: number;
  onExploreRepairers?: () => void;
}

export const RepairVsReplaceCard: React.FC<RepairVsReplaceCardProps> = ({
  repairCost,
  replacementCost,
  expectedLifeExtensionMonths,
  expectedReplacementLifeYears,
  verdict,
  verdictReason,
  estimatedSavings,
  onExploreRepairers,
}) => {
  const isRepair = verdict === 'REPAIR';
  const savingsPct = replacementCost > 0 ? Math.round((estimatedSavings / replacementCost) * 100) : 0;
  const annualizedRepair = Math.round(repairCost / (expectedLifeExtensionMonths / 12 || 1));
  const annualizedReplace = Math.round(replacementCost / (expectedReplacementLifeYears || 3));

  return (
    <div className="bg-white rounded-3xl border-2 border-emerald-500/30 p-6 md:p-7 shadow-lg shadow-emerald-500/5 relative overflow-hidden">
      {/* Top subtle highlight banner */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

      {/* Header section with verdict badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              Decision Intelligence Engine
            </span>
            <span className="text-xs text-slate-400 font-medium">Deterministic ROI v2.4</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-2 tracking-tight">
            Repair vs. Replace Evaluation
          </h3>
        </div>

        {/* Major Recommendation Callout Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Recommended Verdict</span>
            <div className="flex items-center gap-1.5 justify-end">
              <span
                className={`text-xl md:text-2xl font-black tracking-tight px-4 py-1.5 rounded-2xl shadow-sm inline-flex items-center gap-2 ${
                  isRepair
                    ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                    : 'bg-slate-800 text-white'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                {verdict}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-side comparison columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {/* REPAIR CARD (Dominant) */}
        <div
          className={`rounded-2xl p-5 border-2 transition-all relative ${
            isRepair
              ? 'bg-emerald-50/40 border-emerald-500 shadow-md ring-4 ring-emerald-500/10'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          {isRepair && (
            <span className="absolute -top-3 right-4 bg-emerald-700 text-white text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm">
              ★ Best Economic Value
            </span>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-900">
              Option A: Repair
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
              +{expectedLifeExtensionMonths} Months Life
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              ₹{repairCost.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-medium text-slate-500">estimated cost</span>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-200/50 space-y-1.5 text-xs text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Annualized Cost:</span>
              <span className="font-bold text-slate-900">₹{annualizedRepair.toLocaleString('en-IN')}/yr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Warranty Coverage:</span>
              <span className="font-semibold text-emerald-700">60–120 Days Included</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Turnaround Time:</span>
              <span className="font-semibold text-slate-800">1–3 Days</span>
            </div>
          </div>
        </div>

        {/* REPLACE CARD */}
        <div className="rounded-2xl p-5 border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Option B: Replace New
            </span>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              +{expectedReplacementLifeYears} Years Life
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              ₹{replacementCost.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-medium text-slate-500">new device MRP</span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-500">Annualized Cost:</span>
              <span className="font-bold text-slate-900">₹{annualizedReplace.toLocaleString('en-IN')}/yr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Capital Outlay:</span>
              <span className="font-semibold text-rose-600">+{savingsPct}% More Expensive</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Data Migration Effort:</span>
              <span className="font-semibold text-slate-800">High (Setup & Transfers)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Economic & Sustainability takeaway */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold text-slate-900">
              Estimated Savings: <span className="text-emerald-700 font-extrabold">₹{estimatedSavings.toLocaleString('en-IN')}</span> ({savingsPct}% saved)
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
            {verdictReason}
          </p>
        </div>

        {onExploreRepairers && (
          <button
            onClick={onExploreRepairers}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-700/20 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 shrink-0"
          >
            Find Nearby Repairers
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Eco Badge Footer */}
      <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-800 font-medium bg-emerald-50/60 px-3 py-1.5 rounded-xl border border-emerald-100">
        <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Repairing prevents electronic scrap disposal and reduces cradle-to-gate manufacturing greenhouse emissions.</span>
      </div>
    </div>
  );
};
