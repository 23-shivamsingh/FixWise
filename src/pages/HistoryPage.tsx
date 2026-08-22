import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  History,
  ShieldCheck,
  Download,
  Star,
  CheckCircle2,
  Calendar,
  Wrench,
  Sparkles,
  ArrowRight,
  Receipt
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { bookings, setActiveTab, setActiveBooking } = useApp();
  const [downloadedInvoiceCode, setDownloadedInvoiceCode] = useState<string | null>(null);

  const completed = bookings.filter((b) => b.status === 'completed');

  const handleDownloadInvoice = (trackingCode: string) => {
    setDownloadedInvoiceCode(trackingCode);
    setTimeout(() => setDownloadedInvoiceCode(null), 3000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
            <History className="w-3.5 h-3.5 text-emerald-600" />
            <span>Service Records & Warranty Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Repair History & Active Warranties
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official warranty certificates, bench telemetry logs, and tax invoices for all completed repairs.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('diagnose')}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Repair</span>
        </button>
      </div>

      {/* Warranty Highlights Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-black text-slate-900">
              Active Warranty Protection Active
            </h4>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Your repairs are backed by FixWise Zero-Deductible Guarantee. Free parts re-service if issues recur within coverage windows.
            </p>
          </div>
        </div>

        <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-200/60 px-3 py-1.5 rounded-xl shrink-0">
          {completed.length} Active Passports
        </span>
      </div>

      {downloadedInvoiceCode && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>GST Tax Invoice & Warranty Certificate for #{downloadedInvoiceCode} generated successfully.</span>
        </div>
      )}

      {/* History Records List */}
      <div className="space-y-4">
        {completed.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md card-hover transition-all duration-200 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={b.diagnosis.images[0]}
                  alt={b.diagnosis.deviceModel}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      ID #{b.trackingCode}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      ✓ Certified Completed
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {b.diagnosis.identifiedIssue}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {b.diagnosis.brand} {b.diagnosis.deviceModel} • Serviced by {b.repairer.name}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Invoiced</span>
                <span className="text-xl font-black text-slate-900">
                  ₹{b.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Middle telemetry & warranty status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-bold block mb-1">Service Date:</span>
                <span className="font-bold text-slate-800">{b.createdAt.split('T')[0]}</span>
              </div>

              <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200">
                <span className="text-emerald-800 font-bold block mb-1">Warranty Expiry:</span>
                <span className="font-extrabold text-emerald-950 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {b.warrantyExpiryDate} ({b.warrantyDays} Days)
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-bold block mb-1">Parts Replaced:</span>
                <span className="font-bold text-slate-800">Verified OEM Components</span>
              </div>
            </div>

            {/* Review display if exists */}
            {b.reviewGiven && (
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold mb-1">
                  {[...Array(b.ratingGiven || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                  <span className="text-slate-600 text-[11px] ml-1.5 font-medium">Your Verified Review</span>
                </div>
                <p className="text-slate-700 italic">"{b.reviewGiven}"</p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveBooking(b);
                  setActiveTab('repairs');
                }}
                className="text-emerald-700 font-bold hover:underline flex items-center gap-1 transition-colors"
              >
                Inspect Full Timeline Log <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleDownloadInvoice(b.trackingCode)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 hover:text-slate-950 text-slate-800 rounded-xl font-bold transition-all duration-150 flex items-center gap-1.5"
              >
                <Receipt className="w-3.5 h-3.5 text-slate-500" />
                <span>Download Invoice & Warranty PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
