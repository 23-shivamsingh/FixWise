import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RepairStatus } from '../types';
import {
  Wrench,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Camera,
  ChevronRight,
  TrendingUp,
  Award,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const RepairerPortalPage: React.FC = () => {
  const { bookings, updateBookingStatus, setActiveBooking, setActiveTab } = useApp();

  const activeJobs = bookings.filter((b) => b.status !== 'cancelled');

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

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-2">
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

        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl">
            TechFix Pro Labs (Verified ID #8491)
          </span>
        </div>
      </div>

      {/* Workshop Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Bench Jobs</span>
          <p className="text-3xl font-black text-slate-900 mt-1">{activeJobs.length}</p>
          <span className="text-xs text-blue-600 font-semibold mt-1 block">In Progress</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Turnaround</span>
          <p className="text-3xl font-black text-slate-900 mt-1">1.4 Days</p>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">Top 5% Speed</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Trust Index</span>
          <p className="text-3xl font-black text-emerald-700 mt-1">98/100</p>
          <span className="text-xs text-slate-500 font-medium mt-1 block">Zero Warranty Disputes</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue Payouts</span>
          <p className="text-3xl font-black text-slate-900 mt-1">₹48,200</p>
          <span className="text-xs text-slate-500 font-medium mt-1 block">This Month</span>
        </div>
      </div>

      {/* Assigned Repair Jobs Queue */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-slate-900">Assigned Customer Repair Jobs</h3>

        <div className="space-y-4">
          {activeJobs.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={b.diagnosis.images[0]}
                    alt={b.diagnosis.deviceModel}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Tracking #{b.trackingCode}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5">
                      {b.diagnosis.identifiedIssue}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Customer: <strong>{b.customerName}</strong> ({b.customerPhone})
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Job Payout</span>
                  <span className="text-xl font-black text-slate-900">
                    ₹{b.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Status Update Controls */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Current Workbench Step: <strong className="text-emerald-800 uppercase">{b.status.replace(/_/g, ' ')}</strong>
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Select a step to broadcast progress to customer:
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {statusOptions.map((opt) => {
                    const isCurrent = b.status === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => updateBookingStatus(b.id, opt.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-left truncate ${
                          isCurrent
                            ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/20'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Technician Notes & Action */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500 font-medium">
                  Address: {b.customerAddress}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveBooking(b);
                    setActiveTab('repairs');
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl font-bold transition-colors flex items-center gap-1.5"
                >
                  <span>Open Full Job Record</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
