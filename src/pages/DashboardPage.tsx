import React from 'react';
import { useApp } from '../context/AppContext';
import { DevicePassportCard } from '../components/DevicePassportCard';
import { DemoCaseSelector } from '../components/DemoCaseSelector';
import {
  Wrench,
  Sparkles,
  ShieldCheck,
  Leaf,
  DollarSign,
  Clock,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    bookings,
    userDevices,
    sustainability,
    setActiveTab,
    setActiveBooking,
    loadDemoCase,
  } = useApp();

  const activeRepairs = bookings.filter((b) => b.status !== 'completed' && b.status !== 'cancelled');
  const completedRepairs = bookings.filter((b) => b.status === 'completed');

  return (
    <div className="space-y-8 pb-16">
      {/* Top Greeting & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Personal Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Good morning, Shivam 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track active bench repairs, inspect device digital passports, and monitor your e-waste savings.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('diagnose')}
          className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-700/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>Diagnose a Problem</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* JUDGE DEMO SELECTOR */}
      <DemoCaseSelector compact={true} />

      {/* HIGHLIGHT HERO STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Workbench Repairs</span>
            <p className="text-3xl font-black text-slate-900 mt-1">{activeRepairs.length}</p>
            <span className="text-xs text-amber-600 font-semibold mt-1 inline-block">
              ● In Progress Diagnostics
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Fixes</span>
            <p className="text-3xl font-black text-slate-900 mt-1">{completedRepairs.length + 5}</p>
            <span className="text-xs text-emerald-700 font-semibold mt-1 inline-block">
              ✓ Active Warranties Active
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Money Saved</span>
            <p className="text-3xl font-black text-emerald-700 mt-1">
              ₹{sustainability.totalMoneySavedINR.toLocaleString('en-IN')}
            </p>
            <span className="text-xs text-slate-500 font-medium mt-1 inline-block">
              vs Buying Replacement Units
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ACTIVE REPAIRS STRIP */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">Active Repair Orders</h3>
            <p className="text-xs text-slate-500">Live telemetry from technician service benches</p>
          </div>
          <button
            onClick={() => setActiveTab('repairs')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            View Live Tracker <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeRepairs.map((b) => (
            <div
              key={b.id}
              onClick={() => {
                setActiveBooking(b);
                setActiveTab('repairs');
              }}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <img
                    src={b.diagnosis.images[0]}
                    alt={b.diagnosis.deviceModel}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Tracking #{b.trackingCode}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">{b.diagnosis.identifiedIssue}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {b.diagnosis.brand} {b.diagnosis.deviceModel} • {b.repairer.name}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 shrink-0">
                  {b.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Authorized: <strong>₹{b.totalAmount.toLocaleString('en-IN')}</strong></span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  Track Timeline <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REPAIR SUSTAINABILITY IMPACT WIDGET */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
              Personal Sustainability Passport
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Your Environmental & Economic Impact
            </h3>
            <p className="text-xs text-emerald-100 max-w-xl leading-relaxed font-medium">
              By repairing rather than replacing, you've prevented toxic heavy metals from entering landfills and saved capital.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('impact')}
            className="px-5 py-2.5 bg-white hover:bg-emerald-50 text-emerald-950 rounded-xl text-xs font-black transition-all shadow-md shrink-0"
          >
            Open Full Impact Dashboard
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-emerald-700/60">
          <div>
            <span className="text-2xl sm:text-3xl font-black block">
              {sustainability.totalDevicesRepaired}
            </span>
            <span className="text-xs text-emerald-200">Devices Restored</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black block">
              {sustainability.totalWasteAvoidedKg} kg
            </span>
            <span className="text-xs text-emerald-200">E-Waste Avoided</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black block">
              ₹{sustainability.totalMoneySavedINR.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-emerald-200">Capital Preserved</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black block">
              +{sustainability.totalMonthsExtended} mo
            </span>
            <span className="text-xs text-emerald-200">Lifespan Extended</span>
          </div>
        </div>
      </div>

      {/* REGISTERED DIGITAL DEVICE PASSPORTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">Your Registered Device Passports</h3>
            <p className="text-xs text-slate-500">Hardware health scores and lifetime component rework logs</p>
          </div>
          <button
            onClick={() => setActiveTab('devices')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            Manage All Devices <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {userDevices.map((dev) => (
            <DevicePassportCard
              key={dev.id}
              device={dev}
              onDiagnoseNow={() => setActiveTab('diagnose')}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
