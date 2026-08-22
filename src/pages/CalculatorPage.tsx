import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateRepairabilityScore, calculateRepairVsReplace } from '../lib/scoring';
import { RepairVsReplaceCard } from '../components/RepairVsReplaceCard';
import { RepairabilityGauge } from '../components/RepairabilityGauge';
import {
  Calculator,
  TrendingUp,
  Sparkles,
  Leaf,
  DollarSign,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const CalculatorPage: React.FC = () => {
  const { setActiveTab } = useApp();

  // Interactive Live Sliders State
  const [deviceCategory, setDeviceCategory] = useState<'laptop' | 'smartphone' | 'tablet' | 'headphones'>('laptop');
  const [originalPrice, setOriginalPrice] = useState<number>(85000);
  const [deviceAgeYears, setDeviceAgeYears] = useState<number>(2.5);
  const [estimatedRepairCost, setEstimatedRepairCost] = useState<number>(6500);
  const [replacementCost, setReplacementCost] = useState<number>(80000);
  const [expectedLifeExtensionMonths, setExpectedLifeExtensionMonths] = useState<number>(24);
  const [expectedReplacementLifeYears, setExpectedReplacementLifeYears] = useState<number>(4);

  // Compute live deterministic scores
  const repairability = calculateRepairabilityScore({
    category: deviceCategory,
    ageYears: deviceAgeYears,
    originalPrice,
    estimatedRepairCost,
    replacementCost,
  });

  const decision = calculateRepairVsReplace({
    estimatedRepairCost,
    replacementCost,
    expectedLifeExtensionMonths,
    expectedReplacementLifeYears,
    repairabilityScore: repairability.score,
    deviceAgeYears,
  });

  const isRepair = decision.verdict === 'REPAIR';

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            <span>Deterministic Economic Model</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Repair vs. Replace ROI Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Evaluate whether repairing or replacing makes financial and environmental sense based on annualized lifecycle cost.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('diagnose')}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Diagnose with Photos</span>
        </button>
      </div>

      {/* Calculator Grid: LEFT (Interactive Inputs / Sliders), RIGHT (Live Results) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: Input Sliders */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
          <h3 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">
            Hardware & Valuation Inputs
          </h3>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Device Type</label>
            <div className="grid grid-cols-4 gap-2 text-xs font-bold">
              {(['laptop', 'smartphone', 'tablet', 'headphones'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setDeviceCategory(cat)}
                  className={`py-2 rounded-xl capitalize transition-all ${
                    deviceCategory === cat
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Estimated Repair Cost Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Estimated Repair Cost (₹)</span>
              <span className="font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md text-sm">
                ₹{estimatedRepairCost.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={50000}
              step={500}
              value={estimatedRepairCost}
              onChange={(e) => setEstimatedRepairCost(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>₹1,000</span>
              <span>₹25,000</span>
              <span>₹50,000</span>
            </div>
          </div>

          {/* Replacement Cost Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">New Replacement Cost (₹)</span>
              <span className="font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md text-sm">
                ₹{replacementCost.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={250000}
              step={5000}
              value={replacementCost}
              onChange={(e) => setReplacementCost(Number(e.target.value))}
              className="w-full accent-slate-800 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>₹10,000</span>
              <span>₹1,25,000</span>
              <span>₹2,50,000</span>
            </div>
          </div>

          {/* Device Age Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Current Device Age</span>
              <span className="font-bold text-slate-900">{deviceAgeYears} Years Old</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={8}
              step={0.5}
              value={deviceAgeYears}
              onChange={(e) => setDeviceAgeYears(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>6 Months</span>
              <span>4 Years</span>
              <span>8 Years</span>
            </div>
          </div>

          {/* Life Extension Months Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Expected Life Extension (Post-Repair)</span>
              <span className="font-bold text-emerald-800">+{expectedLifeExtensionMonths} Months</span>
            </div>
            <input
              type="range"
              min={6}
              max={48}
              step={6}
              value={expectedLifeExtensionMonths}
              onChange={(e) => setExpectedLifeExtensionMonths(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>6 Months</span>
              <span>24 Months</span>
              <span>48 Months</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Real-Time Results & Visualization */}
        <div className="lg:col-span-7 space-y-6">
          <RepairVsReplaceCard
            repairCost={estimatedRepairCost}
            replacementCost={replacementCost}
            expectedLifeExtensionMonths={expectedLifeExtensionMonths}
            expectedReplacementLifeYears={expectedReplacementLifeYears}
            verdict={decision.verdict}
            verdictReason={decision.reason}
            estimatedSavings={decision.estimatedSavings}
            onExploreRepairers={() => setActiveTab('quotes')}
          />

          <RepairabilityGauge
            score={repairability.score}
            breakdown={repairability}
            showBreakdown={true}
          />
        </div>
      </div>
    </div>
  );
};
