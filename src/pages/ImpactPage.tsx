import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import {
  Leaf,
  Sparkles,
  TrendingUp,
  RotateCcw,
  ShieldCheck,
  Award,
  Recycle,
  Droplets,
  Zap,
  ArrowRight,
} from 'lucide-react';

export const ImpactPage: React.FC = () => {
  const { sustainability, setActiveTab } = useApp();

  const monthlyImpactData = [
    { month: 'Mar', wasteKg: 0.4, savingsINR: 12000, co2Kg: 7.2 },
    { month: 'Apr', wasteKg: 0.9, savingsINR: 24000, co2Kg: 16.5 },
    { month: 'May', wasteKg: 1.6, savingsINR: 42000, co2Kg: 29.4 },
    { month: 'Jun', wasteKg: 2.2, savingsINR: 58000, co2Kg: 40.5 },
    { month: 'Jul', wasteKg: 2.8, savingsINR: 71000, co2Kg: 51.8 },
    { month: 'Aug', wasteKg: sustainability.totalWasteAvoidedKg, savingsINR: sustainability.totalMoneySavedINR, co2Kg: sustainability.carbonEmissionsPreventedKg },
  ];

  const categoryDistribution = [
    { name: 'Laptops', value: 45, color: '#059669' },
    { name: 'Smartphones', value: 35, color: '#10b981' },
    { name: 'Audio / Headphones', value: 12, color: '#34d399' },
    { name: 'Tablets', value: 8, color: '#6ee7b7' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>Circular Economy Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Your Sustainability & Savings Impact
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Certified metrics tracking e-waste reduction, carbon emission abatement, and capital preserved through repair.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('diagnose')}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Diagnose Another Device</span>
        </button>
      </div>

      {/* BIG 4 IMPACT METRICS HERO */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-3">
            <Recycle className="w-5 h-5" />
          </div>
          <span className="text-3xl sm:text-4xl font-black text-slate-900 block tracking-tight">
            {sustainability.totalDevicesRepaired}
          </span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mt-1">
            Devices Restored
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            100% divert from scrap
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-3">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="text-3xl sm:text-4xl font-black text-slate-900 block tracking-tight">
            {sustainability.totalWasteAvoidedKg} kg
          </span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mt-1">
            E-Waste Avoided
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            Hazardous metals spared
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-3xl sm:text-4xl font-black text-emerald-700 block tracking-tight">
            ₹{sustainability.totalMoneySavedINR.toLocaleString('en-IN')}
          </span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mt-1">
            Net Savings
          </span>
          <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
            vs replacement costs
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-3">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-3xl sm:text-4xl font-black text-slate-900 block tracking-tight">
            {sustainability.sustainabilityImpactScore}
          </span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mt-1">
            Eco Impact Score
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            Top 5% repair contributor
          </span>
        </div>
      </div>

      {/* RECHARTS VISUALIZATION GRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Cumulative Savings & Waste Trend Area Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Cumulative E-Waste & Carbon Abatement Trend
              </h3>
              <p className="text-xs text-slate-500">Monthly kilograms of hardware diverted from landfill</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Linear Growth
            </span>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyImpactData}>
                <defs>
                  <linearGradient id="wasteGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="wasteKg"
                  stroke="#059669"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#wasteGrad)"
                  name="E-Waste Avoided (kg)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut Chart */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="pb-4 border-b border-slate-100 mb-2">
            <h3 className="text-base font-black text-slate-900">Category Share</h3>
            <p className="text-xs text-slate-500">Repaired device distribution</p>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
            {categoryDistribution.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span>{c.name}</span>
                </div>
                <span className="font-bold text-slate-900">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CERTIFIED EQUIVALENCY METRICS BANNER */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h4 className="text-base font-bold">Lifecycle Equivalency Benchmarks</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700">
            <span className="text-2xl font-black text-emerald-400 block">
              {sustainability.carbonEmissionsPreventedKg} kg CO₂
            </span>
            <span className="text-xs text-slate-300 mt-1 block font-medium">
              Equivalent to planting <strong>3.2 urban trees</strong> and eliminating 240km of automotive emissions.
            </span>
          </div>

          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700">
            <span className="text-2xl font-black text-blue-400 block">
              {sustainability.waterSavedLiters} Liters
            </span>
            <span className="text-xs text-slate-300 mt-1 block font-medium">
              Clean water saved by bypassing new semiconductor silicon wafer fabrication.
            </span>
          </div>

          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700">
            <span className="text-2xl font-black text-amber-400 block">
              +{sustainability.totalMonthsExtended} Months
            </span>
            <span className="text-xs text-slate-300 mt-1 block font-medium">
              Combined operational lifetime added across your personal electronics fleet.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
