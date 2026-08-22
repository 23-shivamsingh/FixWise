import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { RepairStatus, RepairBooking } from '../types';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Wrench,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Search,
  Filter,
  Calendar,
  RefreshCw,
  MessageSquare,
  FileText,
  Printer,
  ChevronRight,
  Package,
  Layers,
  Send,
  X,
  Phone,
  MapPin,
  Flame,
  Check,
} from 'lucide-react';

interface ExtendedRepairJob extends RepairBooking {
  priority: 'High' | 'Medium' | 'Normal';
  benchNumber: string;
  assignedTech: string;
  targetETA: string;
  lastBroadcastMinutesAgo: number;
  partsStatus: { name: string; inStock: boolean }[];
  customerAuthorized: boolean;
}

export const RepairerPortalPage: React.FC = () => {
  const { bookings, updateBookingStatus, setActiveBooking, setActiveTab, addNotification } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('This Week');
  const [activePipelineFilter, setActivePipelineFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');

  // Interactive Modals / Messages
  const [messageModalJob, setMessageModalJob] = useState<ExtendedRepairJob | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [notesModalJob, setNotesModalJob] = useState<ExtendedRepairJob | null>(null);
  const [benchNote, setBenchNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
      showToast('Live workbench telemetry refreshed successfully.');
    }, 500);
  };

  const statusOptions: { id: RepairStatus; label: string }[] = [
    { id: 'requested', label: '1. Requested' },
    { id: 'repairer_accepted', label: '2. Accepted' },
    { id: 'device_received', label: '3. Received' },
    { id: 'diagnosis_confirmed', label: '4. Diagnosis Confirmed' },
    { id: 'in_progress', label: '5. In Progress' },
    { id: 'quality_check', label: '6. Quality Check' },
    { id: 'ready_for_pickup', label: '7. Ready for Pickup' },
    { id: 'completed', label: '8. Completed' },
  ];

  // Pipeline Counts
  const pipelineCounts = useMemo(() => {
    return {
      all: 37,
      requested: 3,
      repairer_accepted: 2,
      device_received: 4,
      diagnosis_confirmed: 2,
      in_progress: 5,
      quality_check: 1,
      ready_for_pickup: 2,
      completed: 18,
    };
  }, []);

  // Enrich bookings with operational shop floor data
  const enrichedJobs: ExtendedRepairJob[] = useMemo(() => {
    const defaultJobs: ExtendedRepairJob[] = bookings.map((b, idx) => {
      const isFirst = idx === 0;
      return {
        ...b,
        priority: isFirst ? 'High' : idx === 1 ? 'Normal' : 'Medium',
        benchNumber: isFirst ? 'Bench #4' : `Bench #${(idx % 6) + 1}`,
        assignedTech: isFirst ? 'Rohit Sharma (Master Tech)' : 'Kiran Verma (Micro-Soldering)',
        targetETA: isFirst ? 'Today, 06:30 PM' : 'Tomorrow, 11:00 AM',
        lastBroadcastMinutesAgo: isFirst ? 18 : 45,
        partsStatus: isFirst
          ? [
              { name: 'Arctic MX-6 TIM', inStock: true },
              { name: 'OEM Blower Assembly', inStock: true },
            ]
          : [
              { name: 'Reinforced Swivel Arm', inStock: true },
              { name: 'Strain Relief Cable', inStock: true },
            ],
        customerAuthorized: true,
      };
    });

    // Add extra operational demo jobs if active list is small
    if (defaultJobs.length < 3) {
      const extraJob: ExtendedRepairJob = {
        id: 'bk-extra-1',
        caseId: 'case-demo-iphone-screen',
        diagnosis: {
          id: 'diag-extra',
          deviceCategory: 'smartphone',
          deviceModel: 'iPhone 14 Pro',
          brand: 'Apple',
          purchaseYear: 2023,
          originalPrice: 119000,
          userDescription: 'Front OLED glass spiderweb crack on top corner.',
          images: ['https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=600&q=80'],
          identifiedIssue: 'Super Retina XDR Outer Glass Fracture (OLED & TrueTone intact)',
          possibleCauses: ['Impact stress concentration on aluminum bezel perimeter'],
          severity: 'medium',
          confidence: 0.96,
          safetyRisk: 'low_risk',
          professionalRepairRecommended: true,
          estimatedRepairCostMin: 3800,
          estimatedRepairCostMax: 6200,
          replacementCostEstimate: 119000,
          expectedLifeExtensionMonths: 36,
          expectedReplacementLifeYears: 4,
          repairabilityScore: 84,
          repairabilityBreakdown: {
            partsAvailability: 90,
            repairComplexity: 82,
            costFeasibility: 94,
            localServiceability: 92,
            productAgeFactor: 88,
          },
          repairVsReplaceVerdict: 'REPAIR',
          verdictReason: 'Replacing front glass saves ₹112,800 vs device replacement.',
          estimatedSavings: 112800,
          troubleshootingSteps: [],
          timestamp: new Date().toISOString(),
        },
        repairer: bookings[0]?.repairer || {
          id: 'rep-1',
          name: 'TechFix Pro Labs',
          tagline: 'Component Level Tech',
          logo: '',
          rating: 4.9,
          reviewCount: 312,
          verified: true,
          distanceKm: 1.2,
          lat: 12.9716,
          lng: 77.5946,
          address: 'Indiranagar, Bengaluru',
          city: 'Bengaluru',
          phone: '+91 98450 12890',
          yearsInBusiness: 8,
          trustScore: 98,
          trustBreakdown: { verification: 98, reviewsScore: 98, completionRate: 98, quoteAccuracy: 96, warrantyPerformance: 98 },
          priceRange: '₹1,500 – ₹7,500',
          avgTurnaroundDays: 1.4,
          warrantyDays: 90,
          specialties: ['OLED Screens', 'Thermal Systems'],
          certifications: ['IPC-7711/7721'],
          reviews: [],
        },
        quote: {
          id: 'qt-extra',
          repairCaseId: 'case-demo-iphone-screen',
          repairerId: 'rep-1',
          repairerName: 'TechFix Pro Labs',
          repairerLogo: '',
          repairerRating: 4.9,
          repairerDistanceKm: 1.2,
          repairerExperienceYears: 8,
          price: 4500,
          partsCost: 3000,
          laborCost: 1500,
          turnaroundDays: 1,
          warrantyDays: 90,
          notes: 'Includes vacuum OCA lamination and dust-free chamber curing.',
          includedServices: ['OCA Glass Lamination', 'TrueTone Calibration', 'IP68 Water Resistance Gasket Re-seal'],
          fairnessScore: 96,
          status: 'accepted',
          createdAt: new Date().toISOString(),
        },
        customerName: 'Ananya Deshmukh',
        customerPhone: '+91 98201 44552',
        customerAddress: '42, 100ft Road, Indiranagar, Bengaluru',
        preferredDate: '2026-08-23',
        timeSlot: '03:00 PM - 05:00 PM',
        status: 'quality_check',
        timeline: [],
        warrantyExpiryDate: '2026-11-23',
        warrantyDays: 90,
        trackingCode: 'FW-4412-IPHN',
        paymentStatus: 'pending_on_pickup',
        totalAmount: 4500,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priority: 'Medium',
        benchNumber: 'Bench #2',
        assignedTech: 'Aman Deep (Display Specialist)',
        targetETA: 'Today, 04:00 PM',
        lastBroadcastMinutesAgo: 8,
        partsStatus: [
          { name: 'OEM Gorilla Glass Lamination', inStock: true },
          { name: 'IP68 Adhesive Frame Seal', inStock: true },
        ],
        customerAuthorized: true,
      };

      defaultJobs.push(extraJob);
    }

    return defaultJobs;
  }, [bookings]);

  // Filter Jobs
  const filteredJobs = useMemo(() => {
    return enrichedJobs.filter((job) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchTracking = job.trackingCode.toLowerCase().includes(q);
        const matchCustomer = job.customerName.toLowerCase().includes(q);
        const matchDevice = job.diagnosis.deviceModel.toLowerCase().includes(q);
        const matchIssue = job.diagnosis.identifiedIssue.toLowerCase().includes(q);
        if (!matchTracking && !matchCustomer && !matchDevice && !matchIssue) {
          return false;
        }
      }

      // Status dropdown filter
      if (statusFilter !== 'all' && job.status !== statusFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== 'all' && job.priority.toLowerCase() !== priorityFilter.toLowerCase()) {
        return false;
      }

      // Pipeline quick filter
      if (activePipelineFilter !== 'all' && job.status !== activePipelineFilter) {
        return false;
      }

      return true;
    });
  }, [enrichedJobs, searchQuery, statusFilter, priorityFilter, activePipelineFilter]);

  // Handle stage change with instant broadcast & toast
  const handleStageChange = (jobId: string, newStatus: RepairStatus) => {
    updateBookingStatus(jobId, newStatus);
    const stepLabel = statusOptions.find((s) => s.id === newStatus)?.label || newStatus;
    showToast(`Status updated to "${stepLabel}". Live telemetry broadcasted to customer.`);
    addNotification(
      'Workbench Telemetry Broadcast',
      `Job ${jobId} advanced to ${stepLabel}. Real-time tracking updated.`,
      'success',
      'repairs'
    );
  };

  const handleSendMessage = () => {
    if (!messageModalJob) return;
    showToast(`SMS & App notification sent to ${messageModalJob.customerName} (${messageModalJob.customerPhone}).`);
    setCustomMessage('');
    setMessageModalJob(null);
  };

  const handleSaveNotes = () => {
    if (!notesModalJob) return;
    showToast(`Bench test notes saved for #${notesModalJob.trackingCode}.`);
    setBenchNote('');
    setNotesModalJob(null);
  };

  // Technician Weekly Performance Chart Data
  const weeklyThroughputData = [
    { day: 'Mon', completed: 5, avgTurnaroundHours: 3.2 },
    { day: 'Tue', completed: 7, avgTurnaroundHours: 3.8 },
    { day: 'Wed', completed: 4, avgTurnaroundHours: 2.9 },
    { day: 'Thu', completed: 8, avgTurnaroundHours: 4.1 },
    { day: 'Fri', completed: 6, avgTurnaroundHours: 3.5 },
    { day: 'Sat', completed: 9, avgTurnaroundHours: 4.4 },
    { day: 'Sun', completed: 3, avgTurnaroundHours: 2.6 },
  ];

  // Category Distribution Data
  const categoryDistData = [
    { name: 'Thermal & Motherboard', value: 42, color: '#059669' },
    { name: 'OLED / Display Assembly', value: 28, color: '#10b981' },
    { name: 'Li-Ion Battery Swaps', value: 18, color: '#3b82f6' },
    { name: 'Audio Hinge & Port Rework', value: 12, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-7 pb-20">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER & CONTROL BAR */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-1.5">
              <Wrench className="w-3.5 h-3.5 text-blue-600" />
              <span>Technician Workshop Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Workbench Operations Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage incoming repair authorizations, update bench status steps, and broadcast real-time telemetry to customers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            <span className="text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>TechFix Pro Labs (Verified ID #8491)</span>
            </span>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Refresh Workbench Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Compact Filters & Search Area */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tracking #, customer, device..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="all">All Stages ({enrichedJobs.length})</option>
              <option value="requested">1. Requested</option>
              <option value="repairer_accepted">2. Accepted</option>
              <option value="device_received">3. Received</option>
              <option value="diagnosis_confirmed">4. Diagnosis Confirmed</option>
              <option value="in_progress">5. In Progress</option>
              <option value="quality_check">6. Quality Check</option>
              <option value="ready_for_pickup">7. Ready for Pickup</option>
              <option value="completed">8. Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="lg:col-span-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="normal">Normal</option>
            </select>
          </div>

          {/* Date Range Selector */}
          <div className="lg:col-span-3 flex items-center justify-between sm:justify-end gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
                <option value="All Time">All Time</option>
              </select>
            </div>

            <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap hidden xl:inline">
              Synced: <strong className="text-slate-600">{lastRefreshed}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 4 REFINED KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Bench Jobs */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Bench Jobs</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{filteredJobs.length}</p>
          <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-100">
            <span className="text-blue-700 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              2 Due Today
            </span>
            <span className="text-slate-400 font-medium">+1 incoming</span>
          </div>
        </div>

        {/* Card 2: Avg Turnaround */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Turnaround</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">1.4 Days</p>
          <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-100">
            <span className="text-emerald-700 font-bold">Top 5% Speed</span>
            <span className="text-slate-400 font-medium">-0.3d vs last month</span>
          </div>
        </div>

        {/* Card 3: Customer Trust Index */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Trust Index</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-700 mt-2">98/100</p>
          <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-100">
            <span className="text-slate-700 font-bold">4.9 ★ (312 reviews)</span>
            <span className="text-emerald-700 font-medium">0 disputes</span>
          </div>
        </div>

        {/* Card 4: Total Revenue Payouts */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue Payouts</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">₹48,200</p>
          <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-100">
            <span className="text-emerald-700 font-bold">+18% vs last month</span>
            <span className="text-slate-400 font-medium">₹9,400 in escrow</span>
          </div>
        </div>
      </div>

      {/* ACTION REQUIRED / OPERATIONAL ALERTS PANEL */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
              Workbench Action Required (4 Live Notices)
            </h3>
          </div>
          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
            Active Attention
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/80 p-3 rounded-2xl border border-amber-200 flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
            <div>
              <strong className="text-slate-900 block font-bold">2 Jobs Awaiting QC</strong>
              <p className="text-slate-600 text-[11px] mt-0.5">Dell XPS & iPhone 14 ready for thermal load run.</p>
            </div>
          </div>

          <div className="bg-white/80 p-3 rounded-2xl border border-amber-200 flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
            <div>
              <strong className="text-slate-900 block font-bold">Customer Authorized</strong>
              <p className="text-slate-600 text-[11px] mt-0.5">Shivam Sharma approved MX-6 repaste quote.</p>
            </div>
          </div>

          <div className="bg-white/80 p-3 rounded-2xl border border-amber-200 flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
            <div>
              <strong className="text-slate-900 block font-bold">Inventory Low Alert</strong>
              <p className="text-slate-600 text-[11px] mt-0.5">Arctic MX-6 (4g) has 2 units remaining on shelf.</p>
            </div>
          </div>

          <div className="bg-white/80 p-3 rounded-2xl border border-amber-200 flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
            <div>
              <strong className="text-slate-900 block font-bold">SLA On-Track</strong>
              <p className="text-slate-600 text-[11px] mt-0.5">100% of bench repairs within targeted 24h window.</p>
            </div>
          </div>
        </div>
      </div>

      {/* WORKBENCH PIPELINE OVERVIEW */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Live Workbench Pipeline Workload
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Click a stage to filter queue:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-2">
          <button
            type="button"
            onClick={() => setActivePipelineFilter('all')}
            className={`p-2.5 rounded-2xl border text-left transition-all ${
              activePipelineFilter === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">All Jobs</span>
            <span className="text-base font-black mt-0.5 block">{pipelineCounts.all}</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePipelineFilter('requested')}
            className={`p-2.5 rounded-2xl border text-left transition-all ${
              activePipelineFilter === 'requested'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">Requested</span>
            <span className="text-base font-black mt-0.5 block">{pipelineCounts.requested}</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePipelineFilter('repairer_accepted')}
            className={`p-2.5 rounded-2xl border text-left transition-all ${
              activePipelineFilter === 'repairer_accepted'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">Accepted</span>
            <span className="text-base font-black mt-0.5 block">{pipelineCounts.repairer_accepted}</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePipelineFilter('device_received')}
            className={`p-2.5 rounded-2xl border text-left transition-all ${
              activePipelineFilter === 'device_received'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">Received</span>
            <span className="text-base font-black mt-0.5 block">{pipelineCounts.device_received}</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePipelineFilter('diagnosis_confirmed')}
            className={`p-2.5 rounded-2xl border text-left transition-all ${
              activePipelineFilter === 'diagnosis_confirmed'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">Diagnosis</span>
            <span className="text-base font-black mt-0.5 block">{pipelineCounts.diagnosis_confirmed}</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePipelineFilter('in_progress')}
            className={`p-2.5 rounded-2xl border text-left transition-all ${
              activePipelineFilter === 'in_progress'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">Repair</span>
            <span className="text-base font-black mt-0.5 block">{pipelineCounts.in_progress}</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePipelineFilter('quality_check')}
            className={`p-2.5 rounded-2xl border text-left transition-all ${
              activePipelineFilter === 'quality_check'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">QC</span>
            <span className="text-base font-black mt-0.5 block">{pipelineCounts.quality_check}</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePipelineFilter('ready_for_pickup')}
            className={`p-2.5 rounded-2xl border text-left transition-all ${
              activePipelineFilter === 'ready_for_pickup'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">Ready</span>
            <span className="text-base font-black mt-0.5 block">{pipelineCounts.ready_for_pickup}</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePipelineFilter('completed')}
            className={`p-2.5 rounded-2xl border text-left transition-all ${
              activePipelineFilter === 'completed'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">Completed</span>
            <span className="text-base font-black mt-0.5 block">{pipelineCounts.completed}</span>
          </button>
        </div>
      </div>

      {/* ASSIGNED REPAIR JOBS QUEUE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Assigned Customer Repair Jobs Queue
            </h3>
            <span className="text-xs font-extrabold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'}
            </span>
          </div>

          {activePipelineFilter !== 'all' && (
            <button
              onClick={() => setActivePipelineFilter('all')}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>Clear Filter</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-3">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No repair jobs match current filters</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try resetting your search query or switching to &ldquo;All Stages&rdquo; to view workshop inventory.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setPriorityFilter('all');
                setActivePipelineFilter('all');
              }}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-colors inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredJobs.map((b) => {
              const priorityColor =
                b.priority === 'High'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : b.priority === 'Medium'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200';

              return (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all space-y-5"
                >
                  {/* Top Bar: Device, Tracking, Customer, Payout */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-start sm:items-center gap-3.5">
                      <img
                        src={b.diagnosis.images[0] || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=300&q=80'}
                        alt={b.diagnosis.deviceModel}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                            Tracking #{b.trackingCode}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase ${priorityColor}`}>
                            {b.priority} Priority
                          </span>
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                            {b.benchNumber} • {b.assignedTech}
                          </span>
                        </div>

                        <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                          {b.diagnosis.deviceModel} — {b.diagnosis.identifiedIssue}
                        </h4>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                          <span className="flex items-center gap-1">
                            👤 Customer: <strong className="text-slate-800">{b.customerName}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {b.customerPhone}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-emerald-700 font-bold">
                            ETA: {b.targetETA}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Net Job Payout</span>
                      <span className="text-2xl font-black text-slate-900">
                        ₹{b.totalAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold mt-0.5">
                        Escrow Guaranteed
                      </span>
                    </div>
                  </div>

                  {/* Operational Context: AI Diagnosis Summary, Parts & Broadcast Status */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
                      <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase text-[10px] mb-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>AI Diagnosis Summary</span>
                      </div>
                      <p className="text-slate-700 font-medium leading-relaxed">
                        {b.diagnosis.verdictReason || b.diagnosis.identifiedIssue}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
                      <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase text-[10px] mb-1">
                        <Package className="w-3 h-3 text-blue-600" />
                        <span>Required Parts Stock</span>
                      </div>
                      <div className="space-y-1">
                        {b.partsStatus.map((part, pIdx) => (
                          <div key={pIdx} className="flex items-center justify-between text-slate-700 font-medium">
                            <span className="truncate">{part.name}</span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                              ✓ Available
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
                      <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase text-[10px] mb-1">
                        <Clock className="w-3 h-3 text-purple-600" />
                        <span>Customer Telemetry Sync</span>
                      </div>
                      <p className="text-slate-700 font-medium">
                        Last broadcast <strong>{b.lastBroadcastMinutesAgo} min ago</strong>.
                      </p>
                      <span className="text-[11px] text-emerald-700 font-bold block mt-1">
                        ● Customer App Tracking Active
                      </span>
                    </div>
                  </div>

                  {/* 8-Step Interactive Workbench Stepper */}
                  <div className="bg-slate-50/90 p-4 sm:p-5 rounded-2xl border border-slate-200/90 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                        Current Stage:{' '}
                        <strong className="text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md uppercase">
                          {b.status.replace(/_/g, ' ')}
                        </strong>
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Click step button to advance workbench & broadcast to customer:
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                      {statusOptions.map((opt, stepIdx) => {
                        const isCurrent = b.status === opt.id;
                        const isPast =
                          statusOptions.findIndex((s) => s.id === b.status) > stepIdx;

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleStageChange(b.id, opt.id)}
                            className={`p-2.5 rounded-xl text-xs font-bold transition-all text-left truncate flex flex-col justify-between min-h-[58px] ${
                              isCurrent
                                ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/30'
                                : isPast
                                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className="text-[10px] font-extrabold uppercase opacity-80">
                              Step {stepIdx + 1}
                            </span>
                            <span className="truncate leading-tight mt-0.5">
                              {opt.label.replace(/^\d+\.\s*/, '')}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Technician Operations Toolbar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
                    <span className="text-slate-500 font-medium truncate flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{b.customerAddress}</span>
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setMessageModalJob(b)}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                        <span>Message Customer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setNotesModalJob(b)}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>Bench Notes</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveBooking(b);
                          setActiveTab('repairs');
                        }}
                        className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Open Full Job Record</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* LOWER TECHNICIAN ANALYTICS SECTION */}
      <div className="space-y-5 pt-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900">
            Workshop Performance & Throughput Analytics
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Key operational indicators: first-time fix rate, turnaround speed, and component distribution.
          </p>
        </div>

        {/* 6 Key Technician Performance Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Completed This Week</span>
            <span className="text-2xl font-black text-slate-900 block mt-1">42 Jobs</span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">+14% vs target</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Repair Time</span>
            <span className="text-2xl font-black text-slate-900 block mt-1">3.8 Hours</span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">Top 5% Metro</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">First-Time Fix Rate</span>
            <span className="text-2xl font-black text-emerald-700 block mt-1">96.4%</span>
            <span className="text-[10px] text-slate-500 font-bold block mt-0.5">Target: &gt;90%</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Parts In Stock</span>
            <span className="text-2xl font-black text-slate-900 block mt-1">148 Units</span>
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">99.2% OEM</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Warranty Return</span>
            <span className="text-2xl font-black text-emerald-700 block mt-1">0.8%</span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">Industry Low</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Customer Rating</span>
            <span className="text-2xl font-black text-slate-900 block mt-1">4.9 ★</span>
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">312 Reviews</span>
          </div>
        </div>

        {/* Charts: Throughput & Category Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Daily Throughput Chart */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Repair Jobs Completed vs Average Turnaround
                </h4>
                <p className="text-xs text-slate-500">Daily shop-floor output and turnaround hours</p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Weekly Efficiency: 94%
              </span>
            </div>

            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={weeklyThroughputData}>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                  <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} />
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} unit="h" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar yAxisId="left" dataKey="completed" name="Completed Jobs" fill="#059669" radius={[6, 6, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="avgTurnaroundHours" name="Avg Turnaround (Hours)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Repair Category Distribution */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 mb-1">
              Repair Category Distribution
            </h4>
            <p className="text-xs text-slate-500 mb-3">Volume by hardware specialization</p>

            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryDistData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 pt-1 text-xs">
              {categoryDistData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="truncate max-w-[150px]">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: MESSAGE CUSTOMER */}
      {messageModalJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-black text-slate-900">
                  Broadcast Update to {messageModalJob.customerName}
                </h3>
              </div>
              <button
                onClick={() => setMessageModalJob(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-500 space-y-1">
              <p>
                <strong>Tracking:</strong> #{messageModalJob.trackingCode} ({messageModalJob.diagnosis.deviceModel})
              </p>
              <p>
                <strong>Phone:</strong> {messageModalJob.customerPhone}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Quick Template Broadcast:</label>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setCustomMessage(
                      `Hello ${messageModalJob.customerName}, your ${messageModalJob.diagnosis.deviceModel} has passed thermal benchmark tests and is ready for pickup!`
                    )
                  }
                  className="text-left text-[11px] font-medium p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-700 border border-slate-200"
                >
                  ⚡ Ready for pickup / dispatch
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCustomMessage(
                      `Bench update: Thermal paste Arctic MX-6 applied. Running 30-min burn-in test now.`
                    )
                  }
                  className="text-left text-[11px] font-medium p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-700 border border-slate-200"
                >
                  🧪 Benchmark test running
                </button>
              </div>

              <textarea
                rows={3}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Type custom workbench status message to customer..."
                className="w-full p-3 rounded-xl text-xs bg-slate-50 border border-slate-200 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 mt-2"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setMessageModalJob(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Broadcast</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BENCH NOTES */}
      {notesModalJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Bench Test Logs & Notes — #{notesModalJob.trackingCode}
                </h3>
              </div>
              <button
                onClick={() => setNotesModalJob(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 block">Technician Diagnostic Checklist:</label>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5 text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Heatsink fins ultrasonic cleaned</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Arctic MX-6 TIM applied (0.15mm spread)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Fan bearing lubricated (0 RPM friction)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Idle thermals stabilized at 39°C</span>
                </div>
              </div>

              <label className="font-bold text-slate-700 block pt-1">Additional Lab Notes:</label>
              <textarea
                rows={3}
                value={benchNote}
                onChange={(e) => setBenchNote(e.target.value)}
                placeholder="Log microscope findings, voltage rails, or serial numbers..."
                className="w-full p-3 rounded-xl text-xs bg-slate-50 border border-slate-200 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setNotesModalJob(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <span>Save to Job Record</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
