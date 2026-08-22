import React from 'react';
import { Wrench, Layers, DollarSign, MapPin, Clock } from 'lucide-react';

interface RepairabilityGaugeProps {
  score: number; // 0 to 100
  breakdown?: {
    partsAvailability: number;
    repairComplexity: number;
    costFeasibility: number;
    localServiceability: number;
    productAgeFactor: number;
  };
  showBreakdown?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RepairabilityGauge: React.FC<RepairabilityGaugeProps> = ({
  score,
  breakdown,
  showBreakdown = true,
  size = 'md',
}) => {
  // Determine color scheme based on score
  let strokeColor = '#059669'; // Emerald
  let badgeBg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let label = 'Highly Repairable';

  if (score < 50) {
    strokeColor = '#e11d48'; // Rose
    badgeBg = 'bg-rose-50 text-rose-800 border-rose-200';
    label = 'Low Repairability';
  } else if (score < 75) {
    strokeColor = '#d97706'; // Amber
    badgeBg = 'bg-amber-50 text-amber-800 border-amber-200';
    label = 'Moderately Repairable';
  }

  // SVG Circle calculation
  const radius = size === 'lg' ? 48 : size === 'sm' ? 28 : 38;
  const strokeWidth = size === 'lg' ? 8 : size === 'sm' ? 5 : 6.5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const dimension = radius * 2 + strokeWidth * 2;

  const defaultBreakdown = breakdown || {
    partsAvailability: Math.round(score * 0.95),
    repairComplexity: Math.round(score * 0.9),
    costFeasibility: Math.round(score * 1.05),
    localServiceability: 90,
    productAgeFactor: 85,
  };

  const factors = [
    { label: 'Parts Availability', value: defaultBreakdown.partsAvailability, icon: Layers },
    { label: 'Modular Simplicity', value: defaultBreakdown.repairComplexity, icon: Wrench },
    { label: 'Cost Feasibility', value: defaultBreakdown.costFeasibility, icon: DollarSign },
    { label: 'Local Technicians', value: defaultBreakdown.localServiceability, icon: MapPin },
    { label: 'Component Lifecycle', value: defaultBreakdown.productAgeFactor, icon: Clock },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center gap-5 justify-between">
        {/* Circular Progress Gauge */}
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center shrink-0" style={{ width: dimension, height: dimension }}>
            <svg className="transform -rotate-90" width={dimension} height={dimension}>
              {/* Background ring */}
              <circle
                cx={dimension / 2}
                cy={dimension / 2}
                r={radius}
                stroke="#f1f5f9"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Progress ring */}
              <circle
                cx={dimension / 2}
                cy={dimension / 2}
                r={radius}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                {score}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                /100
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${badgeBg}`}>
                {label}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-1">Repairability Score</h4>
            <p className="text-xs text-slate-500 max-w-xs mt-0.5">
              Calculated deterministically from component modularity, spare parts availability, and teardown simplicity.
            </p>
          </div>
        </div>

        {/* Quick summary badge */}
        <div className="text-right hidden md:block">
          <span className="text-xs font-medium text-slate-500">Methodology</span>
          <p className="text-xs font-semibold text-slate-700">Deterministic Engine v2.4</p>
        </div>
      </div>

      {/* Factor Breakdown Progress Bars */}
      {showBreakdown && (
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {factors.map((factor, idx) => {
            const Icon = factor.icon;
            const val = Math.min(100, Math.max(0, factor.value));
            return (
              <div key={idx} className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <Icon className="w-3.5 h-3.5 text-slate-500" />
                    {factor.label}
                  </span>
                  <span className="font-bold text-slate-900">{val}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      val >= 75 ? 'bg-emerald-500' : val >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
