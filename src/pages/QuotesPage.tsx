import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useFixWiseAuth } from '../context/AuthContext';
import { Quote } from '../types';
import { QuoteComparisonTable } from '../components/QuoteComparisonTable';
import confetti from 'canvas-confetti';
import {
  FileSearch,
  Sparkles,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  X,
  Phone,
  User,
  ArrowRight,
  Award,
  LogIn
} from 'lucide-react';

interface QuotesPageProps {
  onOpenScanner: () => void;
}

export const QuotesPage: React.FC<QuotesPageProps> = ({ onOpenScanner }) => {
  const {
    availableQuotes,
    selectedQuote,
    setSelectedQuote,
    currentDiagnosis,
    repairers,
    bookRepair,
    setActiveTab,
  } = useApp();

  const { isSignedIn, user, openSignIn } = useFixWiseAuth();

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [targetQuoteForBooking, setTargetQuoteForBooking] = useState<Quote | null>(null);
  const [customerName, setCustomerName] = useState('Shivam Sharma');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [customerAddress, setCustomerAddress] = useState('Tower 4, Apt 802, Green Glen Layout, Bellandur, Bengaluru');
  const [preferredDate, setPreferredDate] = useState('2026-08-24');
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 01:00 PM');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (isSignedIn && user?.fullName) {
      setCustomerName(user.fullName);
    }
  }, [isSignedIn, user]);

  const handleOpenBooking = (quote: Quote) => {
    setTargetQuoteForBooking(quote);
    setBookingModalOpen(true);
    setBookingSuccess(false);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetQuoteForBooking) return;

    const rep = repairers.find((r) => r.id === targetQuoteForBooking.repairerId) || repairers[0];

    bookRepair({
      repairer: rep,
      quote: targetQuoteForBooking,
      customerName,
      customerPhone,
      customerAddress,
      preferredDate,
      timeSlot,
    });

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#34d399', '#f59e0b'],
      });
    } catch (e) {}

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingModalOpen(false);
      setActiveTab('repairs');
    }, 1800);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Deterministic Quote Scoring Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Transparent Quote Comparison
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Quotes for {currentDiagnosis?.brand} {currentDiagnosis?.deviceModel} scored by price, warranty, turnaround time, and technician reputation.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onOpenScanner}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <FileSearch className="w-4 h-4 text-emerald-600" />
            <span>Scan an External Bill / Quote</span>
          </button>
        </div>
      </div>

      {/* Diagnosis Reference Header Card */}
      {currentDiagnosis && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <img
              src={currentDiagnosis.images[0]}
              alt={currentDiagnosis.deviceModel}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200"
            />
            <div>
              <span className="font-bold text-slate-900 text-sm block">
                {currentDiagnosis.identifiedIssue}
              </span>
              <span className="text-slate-500 font-medium">
                {currentDiagnosis.deviceModel} • AI Benchmark: ₹{currentDiagnosis.estimatedRepairCostMin.toLocaleString('en-IN')} – ₹{currentDiagnosis.estimatedRepairCostMax.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="bg-emerald-50 text-emerald-800 font-extrabold px-2.5 py-1 rounded-full border border-emerald-200">
              Save ₹{currentDiagnosis.estimatedSavings.toLocaleString('en-IN')} vs Replace
            </span>
          </div>
        </div>
      )}

      {/* Side-by-Side Quote Comparison Cards */}
      <QuoteComparisonTable
        quotes={availableQuotes}
        selectedQuote={selectedQuote}
        onSelectQuote={(q) => setSelectedQuote(q)}
        onProceedToBooking={handleOpenBooking}
      />

      {/* Comparison Specifications Matrix Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Detailed Itemization & Service Guarantee Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Repair Workshop</th>
                <th className="py-3 px-4">All-Inclusive Price</th>
                <th className="py-3 px-4">Parts vs Labor</th>
                <th className="py-3 px-4">Turnaround</th>
                <th className="py-3 px-4">Warranty</th>
                <th className="py-3 px-4">Distance</th>
                <th className="py-3 px-4">Fairness Score</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {availableQuotes.map((q) => (
                <tr
                  key={q.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    q.isBestValue ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{q.repairerName}</span>
                      {q.isBestValue && (
                        <span className="bg-emerald-700 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded">
                          Best Value
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                    ₹{q.price.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    ₹{q.partsCost} / ₹{q.laborCost}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {q.turnaroundDays} {q.turnaroundDays === 1 ? 'Day' : 'Days'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                      {q.warrantyDays} Days
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{q.repairerDistanceKm} km</td>
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-slate-900">{q.fairnessScore}/100</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenBooking(q)}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                      Book Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1-CLICK BOOKING CONFIRMATION MODAL */}
      {bookingModalOpen && targetQuoteForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Confirm Repair Booking
                  </h3>
                  <p className="text-xs text-slate-500">
                    Zero upfront charge • Pay after quality benchmark verification
                  </p>
                </div>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            {!bookingSuccess ? (
              <form onSubmit={handleConfirmBooking} className="p-6 space-y-4 overflow-y-auto">
                {/* Summary Box */}
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">
                      Selected Workshop
                    </span>
                    <h4 className="text-sm font-black text-slate-900 mt-0.5">
                      {targetQuoteForBooking.repairerName}
                    </h4>
                    <span className="text-xs text-emerald-700 font-semibold">
                      {targetQuoteForBooking.warrantyDays}-Day Zero-Deductible Warranty
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total Quoted</span>
                    <p className="text-xl font-black text-slate-900">
                      ₹{targetQuoteForBooking.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Customer Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number for Pickup SMS</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pickup / Delivery Address</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Preferred Date</label>
                      <input
                        type="date"
                        required
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Time Slot</label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option>09:00 AM - 11:00 AM</option>
                        <option>11:00 AM - 01:00 PM</option>
                        <option>02:00 PM - 04:00 PM</option>
                        <option>05:00 PM - 07:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-700/20 transition-all flex items-center gap-1.5"
                  >
                    <span>Authorize & Confirm Booking</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Repair Confirmed!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your case has been transmitted to {targetQuoteForBooking.repairerName}. Directing you to live workbench tracking...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
