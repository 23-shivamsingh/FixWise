import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Leaf,
  Users,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Activity,
  Layers
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { setActiveTab } = useApp();

  const volumeTrend = [
    { month: 'Jan', requests: 45, completed: 38 },
    { month: 'Feb', requests: 78, completed: 64 },
    { month: 'Mar', requests: 120, completed: 102 },
    { month: 'Apr', requests: 185, completed: 154 },
    { month: 'May', requests: 270, completed: 230 },
    { month: 'Jun', requests: 360, completed: 310 },
    { month: 'Jul', requests: 440, completed: 375 },
    { month: 'Aug', requests: 482, completed: 392 },
  ];

  const cityDistribution = [
    { city: 'Bengaluru', count: 186, color: '#059669' },
    { city: 'Delhi NCR', count: 124, color: '#10b981' },
    { city: 'Mumbai', count: 92, color: '#34d399' },
    { city: 'Hyderabad', count: 52, color: '#6ee7b7' },
    { city: 'Pune', count: 28, color: '#a7f3d0' },
  ];

  const failureModes = [
    { issue: 'Thermal Exhaust Blockage / Paste Dryout', category: 'Laptop', count: 142, trend: '+28% (Seasonal Heat)' },
    { issue: 'AMOLED Screen Crack / Flex Cable Tear', category: 'Smartphone', count: 118, trend: '+14% Drops' },
    { issue: 'Swollen Li-Ion Cell (Hazard Flagged)', category: 'Battery', count: 64, trend: '98% Tech Intercept' },
    { issue: 'USB-C / Power Delivery Port Oxidation', category: 'All', count: 58, trend: 'Fast 24h Turnaround' },
    { issue: 'Headphone ANC Driver / Battery Degradation', category: 'Audio', count: 42, trend: '88% Saved vs Replace' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold mb-2">
            <Activity className="w-3.5 h-3.5 text-purple-600" />
            <span>Platform Intelligence & Executive Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            FixWise AI Platform Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ecosystem overview: diagnostics volume, regional technician performance, and AI safety alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl">
            Live Network Status: 100% Operational
          </span>
        </div>
      </div>

      {/* BIG 4 EXECUTIVE METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold mb-3">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-3xl font-black text-slate-900 block">1,284</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mt-1">
            Registered Consumers
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            +32% MoM growth
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold mb-3">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="text-3xl font-black text-slate-900 block">482</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mt-1">
            Diagnosis Requests
          </span>
          <span className="text-[11px] text-blue-700 font-semibold mt-1 block">
            67 active in workbench
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-3">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="text-3xl font-black text-emerald-800 block">1.84 Tons</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mt-1">
            E-Waste Diverted
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            Certified zero landfill
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-3xl font-black text-slate-900 block">₹18.4 Lakhs</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mt-1">
            Consumer Money Saved
          </span>
          <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
            Avg ₹4,800 saved per job
          </span>
        </div>
      </div>

      {/* AI FAILURE SURGE INSIGHT CARD */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold tracking-tight">
            FixWise AI Hardware Trend Synthesizer
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <span className="text-emerald-400 font-extrabold uppercase tracking-wider block mb-1">
              Thermal Degradation Spike
            </span>
            <p className="text-slate-300 leading-relaxed font-medium">
              Laptop thermal throttle requests rose 28% across Bengaluru & Delhi due to seasonal ambient spikes. Recommending deep radiator flushing before motherboard solder crack occurs.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <span className="text-amber-400 font-extrabold uppercase tracking-wider block mb-1">
              Safety Intercepts
            </span>
            <p className="text-slate-300 leading-relaxed font-medium">
              64 lithium pouch swelling cases were successfully intercepted by the AI Safety Guardrail, instructing users not to attempt DIY puncturing or home battery removal.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <span className="text-blue-400 font-extrabold uppercase tracking-wider block mb-1">
              Repair Preference Ratio
            </span>
            <p className="text-slate-300 leading-relaxed font-medium">
              86% of users who used the Repair vs Replace ROI calculator chose to repair rather than replace, generating ₹14.2L in local technician commerce.
            </p>
          </div>
        </div>
      </div>

      {/* VOLUME & GEOGRAPHY CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-black text-slate-900 mb-1">
            Monthly Request & Completion Growth
          </h3>
          <p className="text-xs text-slate-500 mb-4">Total platform diagnostics and verified completions</p>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeTrend}>
                <defs>
                  <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="requests" stroke="#059669" fill="url(#reqGrad)" name="Diagnosed Requests" />
                <Area type="monotone" dataKey="completed" stroke="#3b82f6" fill="#bfdbfe" name="Completed Bench Repairs" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-black text-slate-900 mb-1">Regional Marketplace Volume</h3>
          <p className="text-xs text-slate-500 mb-4">Requests by metro hub</p>

          <div className="space-y-3 pt-2 text-xs font-medium">
            {cityDistribution.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="font-bold">{item.city}</span>
                  <span>{item.count} jobs ({Math.round((item.count / 482) * 100)}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(item.count / 482) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAILURE MODES TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-black text-slate-900 mb-4">
          Top Identified Failure Modes & AI Diagnosis Patterns
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Detected Hardware Fault</th>
                <th className="py-3 px-4">Device Family</th>
                <th className="py-3 px-4">Incident Count</th>
                <th className="py-3 px-4">AI Telemetry Observation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {failureModes.map((fm, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{fm.issue}</td>
                  <td className="py-3 px-4 font-semibold text-emerald-800">{fm.category}</td>
                  <td className="py-3 px-4 font-bold">{fm.count} Cases</td>
                  <td className="py-3 px-4 text-slate-500">{fm.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
