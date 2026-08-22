import React, { useState } from 'react';
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
  Legend,
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
  Layers,
  Download,
  Calendar,
  RefreshCw,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Server,
  Zap,
  Globe,
  Radio,
  Check,
  X,
  Droplets,
  Award,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { setActiveTab } = useApp();

  // Interactive state
  const [dateRange, setDateRange] = useState<string>('Last 30 Days');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [alertFilter, setAlertFilter] = useState<'all' | 'high' | 'medium' | 'info'>('all');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastRefreshed(`Today at ${timeStr}`);
      showToast('Live ecosystem telemetry refreshed.');
    }, 500);
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value,Period\n' +
      'Registered Consumers,1284,Last 30 Days\n' +
      'Diagnosis Requests,482,Last 30 Days\n' +
      'E-Waste Diverted (Tons),1.84,Last 30 Days\n' +
      'Consumer Money Saved (INR),1840000,Last 30 Days\n' +
      'CO2 Avoided (Tons),4.7,Last 30 Days\n' +
      'AI Diagnosis Accuracy,94.2%,Last 30 Days\n' +
      'Platform Uptime,99.98%,Last 30 Days\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fixwise-platform-analytics-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Platform Analytics Report exported successfully (CSV).');
  };

  // Chart Data
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

  const repairVsReplaceData = [
    { name: 'Chose Repair', value: 86, color: '#059669' },
    { name: 'Chose Replacement', value: 14, color: '#94a3b8' },
  ];

  const categoryDistributionData = [
    { name: 'Laptops', value: 44, color: '#059669' },
    { name: 'Smartphones', value: 32, color: '#3b82f6' },
    { name: 'Audio / Headphones', value: 14, color: '#8b5cf6' },
    { name: 'Tablets & Other', value: 10, color: '#f59e0b' },
  ];

  // Regional Performance Table Data
  const regionalPerformance = [
    { region: 'Bengaluru', requests: 186, completed: 142, avgTime: '1.4 days', successRate: '94%', activeRepairers: 42, rating: '4.8 ★' },
    { region: 'Delhi NCR', requests: 124, completed: 91, avgTime: '1.7 days', successRate: '91%', activeRepairers: 31, rating: '4.7 ★' },
    { region: 'Mumbai', requests: 108, completed: 79, avgTime: '1.6 days', successRate: '93%', activeRepairers: 28, rating: '4.8 ★' },
    { region: 'Hyderabad', requests: 52, completed: 41, avgTime: '1.9 days', successRate: '89%', activeRepairers: 16, rating: '4.6 ★' },
    { region: 'Pune', requests: 28, completed: 22, avgTime: '1.8 days', successRate: '92%', activeRepairers: 12, rating: '4.7 ★' },
  ];

  // Safety & Platform Alerts Data
  const platformAlerts = [
    {
      id: 'alt-1',
      severity: 'high',
      title: 'Lithium Battery Swelling Detected in 7 Recent Diagnoses',
      description: 'AI Multimodal Vision intercepted high-risk battery swelling cases. Automatic warnings dispatched to users against puncturing.',
      timestamp: '14 min ago',
      region: 'Bengaluru / Delhi NCR',
      category: 'Smartphone & Tablet',
      action: 'Enforce fireproof ESD containment bag for courier pickups.',
    },
    {
      id: 'alt-2',
      severity: 'medium',
      title: 'Thermal Degradation Request Spike (+28%)',
      description: 'Increased ambient heat in North & South metro zones is triggering heavy CPU/GPU throttling across Dell, Lenovo, and Apple devices.',
      timestamp: '2 hours ago',
      region: 'Bengaluru & Delhi',
      category: 'Laptops',
      action: 'Broadcasted thermal repaste advisory to 148 verified workshops.',
    },
    {
      id: 'alt-3',
      severity: 'info',
      title: 'Repair Preference Ratio Reached All-Time High (86%)',
      description: 'Users who interact with the Repair vs Replace ROI calculator choose repair in 86 of 100 cases, generating ₹14.2L in local technician commerce.',
      timestamp: '5 hours ago',
      region: 'All Metro Zones',
      category: 'Platform-wide',
      action: 'Expanding parts courier routing to ensure sub-24h turnarounds.',
    },
  ];

  const filteredAlerts = platformAlerts.filter((a) => {
    if (alertFilter === 'all') return true;
    return a.severity === alertFilter;
  });

  return (
    <div className="space-y-7 pb-20">
      {/* TOAST */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER WITH CONTROLS */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold mb-1.5">
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

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            <span className="text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              <span>Live Network Status: 100% Operational</span>
            </span>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 90 Days">Last 90 Days</option>
                <option value="Year-to-Date">Year-to-Date</option>
              </select>
            </div>

            <span className="text-[11px] text-slate-400 font-medium">
              Telemetry synced: <strong className="text-slate-600">{lastRefreshed}</strong>
            </span>
          </div>

          <button
            onClick={handleExport}
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
            <span>Export Analytics Report</span>
          </button>
        </div>
      </div>

      {/* BIG 4 EXECUTIVE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Registered Consumers */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Registered Consumers
            </span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <span className="text-3xl font-black text-slate-900 block mt-2">1,284</span>
          <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-100">
            <span className="text-emerald-700 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +32% MoM growth
            </span>
            <span className="text-slate-400 font-medium">+312 new</span>
          </div>
        </div>

        {/* Card 2: Diagnosis Requests */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Diagnosis Requests
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Wrench className="w-4.5 h-4.5" />
            </div>
          </div>
          <span className="text-3xl font-black text-slate-900 block mt-2">482</span>
          <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-100">
            <span className="text-blue-700 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +18% MoM
            </span>
            <span className="text-slate-600 font-semibold">67 active on bench</span>
          </div>
        </div>

        {/* Card 3: E-Waste Diverted */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              E-Waste Diverted
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Leaf className="w-4.5 h-4.5" />
            </div>
          </div>
          <span className="text-3xl font-black text-emerald-800 block mt-2">1.84 Tons</span>
          <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-100">
            <span className="text-emerald-700 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +24% vs last mo
            </span>
            <span className="text-emerald-800 font-semibold">Certified 0 Landfill</span>
          </div>
        </div>

        {/* Card 4: Consumer Money Saved */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Consumer Money Saved
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
          </div>
          <span className="text-3xl font-black text-slate-900 block mt-2">₹18.4 Lakhs</span>
          <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-100">
            <span className="text-slate-700 font-bold">Avg ₹4,800 saved / job</span>
            <span className="text-emerald-700 font-medium">+₹3.2L</span>
          </div>
        </div>
      </div>

      {/* AI HARDWARE TREND SYNTHESIZER (Polished Dark Section) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold tracking-tight">
              FixWise AI Hardware Trend Synthesizer
            </h3>
          </div>
          <span className="text-xs font-bold bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 px-3 py-1 rounded-full self-start sm:self-auto">
            Gemini Multimodal Telemetry Model v2.4 Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Insight 1: Thermal */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-emerald-400 font-extrabold uppercase tracking-wider">
                  Thermal Degradation Spike
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  AI Confidence: 94%
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed font-medium">
                Laptop thermal throttle requests rose 28% across Bengaluru & Delhi due to seasonal ambient spikes. Recommending deep radiator flushing before motherboard solder crack occurs.
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 text-[11px] text-emerald-300 font-semibold">
              💡 Action: Increased cooling inspection steps on bench.
            </div>
          </div>

          {/* Insight 2: Safety */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-amber-400 font-extrabold uppercase tracking-wider">
                  Safety Intercepts
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                  AI Confidence: 99.2%
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed font-medium">
                64 lithium pouch swelling cases were successfully intercepted by the AI Safety Guardrail, instructing users not to attempt DIY puncturing or home battery removal.
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 text-[11px] text-amber-300 font-semibold">
              🛡️ Action: Auto-routing to certified fireproof stations.
            </div>
          </div>

          {/* Insight 3: ROI */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-blue-400 font-extrabold uppercase tracking-wider">
                  Repair Preference Ratio
                </span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">
                  AI Confidence: 91%
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed font-medium">
                86% of users who used the Repair vs Replace ROI calculator chose to repair rather than replace, generating ₹14.2L in local technician commerce.
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 text-[11px] text-blue-300 font-semibold">
              📈 Action: Expanding local spare-parts courier lines.
            </div>
          </div>
        </div>
      </div>

      {/* MAIN ANALYTICS GRID (4 Charts: Growth, Regional, Decision, Device) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Monthly Growth */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-black text-slate-900">
              Monthly Request & Completion Growth
            </h3>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              81.3% Completion Rate
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Platform diagnostics volume vs verified bench repair completions
          </p>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeTrend}>
                <defs>
                  <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="requests" stroke="#059669" strokeWidth={2.5} fill="url(#reqGrad)" name="Diagnosed Requests" />
                <Area type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={2.5} fill="url(#compGrad)" name="Completed Bench Repairs" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Regional Marketplace Volume */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 mb-1">
              Regional Marketplace Volume
            </h3>
            <p className="text-xs text-slate-500 mb-4">Requests distributed by metro hub</p>

            <div className="space-y-3 pt-1 text-xs font-medium">
              {cityDistribution.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-bold">{item.city}</span>
                    <span>
                      {item.count} jobs ({Math.round((item.count / 482) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
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

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Metros Active: <strong>5 Hubs</strong></span>
            <span className="text-emerald-700 font-bold">148 Certified Techs</span>
          </div>
        </div>

        {/* Chart 3: Repair vs Replace Decisions */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-black text-slate-900">
              Repair vs Replace Decisions
            </h3>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg">
              86% Circular Economy
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">Consumer decision outcomes after AI ROI analysis</p>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-6 h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={repairVsReplaceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {repairVsReplaceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="sm:col-span-6 space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <div className="flex items-center justify-between font-bold text-sm">
                  <span>Chose Repair</span>
                  <span>86%</span>
                </div>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Saved ₹18.4L in hardware replacement costs.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700">
                <div className="flex items-center justify-between font-bold text-sm">
                  <span>Chose Replace</span>
                  <span>14%</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Old devices routed to certified zero-landfill e-recyclers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 4: Device Category Distribution */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-black text-slate-900">
              Device Category Distribution
            </h3>
            <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-lg">
              Laptops Leading
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">Diagnostic volume by hardware class</p>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-6 h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="sm:col-span-6 space-y-2 text-xs">
              {categoryDistributionData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PLATFORM HEALTH & SYSTEM SLA METRICS */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Platform Health & Telemetry Benchmarks
            </h3>
            <p className="text-xs text-slate-500">
              Core SLA indicators: AI diagnostic accuracy, technician availability, and uptime.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl self-start sm:self-auto">
            All SLA Targets Met
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              AI Diagnosis Accuracy
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">94.2%</span>
              <span className="text-[10px] text-emerald-700 font-bold">Target: &gt;90%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: '94.2%' }} />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Successful Repair Rate
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">91.8%</span>
              <span className="text-[10px] text-emerald-700 font-bold">Target: &gt;88%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '91.8%' }} />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Technician Availability
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">87%</span>
              <span className="text-[10px] text-slate-500 font-bold">12 Metro Zones</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: '87%' }} />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Customer Satisfaction
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-700">4.8 / 5.0</span>
              <span className="text-[10px] text-emerald-700 font-bold">0 Disputes</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: '96%' }} />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Platform Uptime
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">99.98%</span>
              <span className="text-[10px] text-emerald-700 font-bold">SLA: 99.9%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: '99.98%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* REGIONAL PERFORMANCE TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Regional Marketplace Performance Telemetry
            </h3>
            <p className="text-xs text-slate-500">
              Metro-level diagnostic conversion, turnaround speed, and technician density.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
            5 Active Metros
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4 rounded-l-xl">Region Hub</th>
                <th className="py-3 px-4">Diagnosis Requests</th>
                <th className="py-3 px-4">Repairs Completed</th>
                <th className="py-3 px-4">Avg Repair Time</th>
                <th className="py-3 px-4">Repair Success Rate</th>
                <th className="py-3 px-4">Active Repairers</th>
                <th className="py-3 px-4 rounded-r-xl">Customer Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {regionalPerformance.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {row.region}
                  </td>
                  <td className="py-3.5 px-4 font-bold">{row.requests} Cases</td>
                  <td className="py-3.5 px-4 text-emerald-800 font-bold">{row.completed} Units</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{row.avgTime}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {row.successRate}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">{row.activeRepairers} Shops</td>
                  <td className="py-3.5 px-4 font-black text-slate-900">{row.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI SAFETY & PLATFORM ALERTS SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4.5 h-4.5 text-amber-600" />
              <h3 className="text-base font-black text-slate-900">
                AI Safety & Platform Alerts
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live automated safety guardrails, battery hazard detections, and ecosystem notices.
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setAlertFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                alertFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setAlertFilter('high')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                alertFilter === 'high' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              High
            </button>
            <button
              onClick={() => setAlertFilter('medium')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                alertFilter === 'medium' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setAlertFilter('info')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                alertFilter === 'info' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Info
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const isHigh = alert.severity === 'high';
            const isMedium = alert.severity === 'medium';

            const badgeBg = isHigh
              ? 'bg-red-50 border-red-200 text-red-800'
              : isMedium
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-blue-50 border-blue-200 text-blue-800';

            return (
              <div
                key={alert.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-slate-300 transition-all text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md font-extrabold uppercase text-[10px] border ${badgeBg}`}>
                      {alert.severity} Priority
                    </span>
                    <h4 className="font-bold text-slate-900">{alert.title}</h4>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{alert.timestamp}</span>
                </div>

                <p className="text-slate-600 font-medium leading-relaxed">{alert.description}</p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-[11px]">
                  <span className="text-slate-500">
                    Affected: <strong>{alert.category}</strong> ({alert.region})
                  </span>
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Recommended Action: {alert.action}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ENVIRONMENTAL IMPACT HIGHLIGHT SECTION */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-300" />
            <h3 className="text-base font-bold tracking-tight">
              Platform Environmental & Social Impact Summary
            </h3>
          </div>
          <span className="text-xs font-bold bg-emerald-800 text-emerald-200 border border-emerald-700 px-3 py-1 rounded-full self-start sm:self-auto">
            UN SDG 12: Responsible Consumption
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider block">
              E-Waste Prevented
            </span>
            <span className="text-3xl font-black text-white block mt-1">1.84 Tons</span>
            <span className="text-[11px] text-emerald-300 font-medium block mt-0.5">Certified 0 landfill</span>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider block">
              Devices Repaired
            </span>
            <span className="text-3xl font-black text-white block mt-1">326 Units</span>
            <span className="text-[11px] text-emerald-300 font-medium block mt-0.5">Life extended ~2.4 yrs</span>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider block">
              CO₂ Avoided
            </span>
            <span className="text-3xl font-black text-white block mt-1">4.7 Tons</span>
            <span className="text-[11px] text-emerald-300 font-medium block mt-0.5">Manufacturing offset</span>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider block">
              Water Conserved
            </span>
            <span className="text-3xl font-black text-white block mt-1">142,000 L</span>
            <span className="text-[11px] text-emerald-300 font-medium block mt-0.5">Mining & wafer wash</span>
          </div>
        </div>
      </div>
    </div>
  );
};
