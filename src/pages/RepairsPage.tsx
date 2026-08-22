import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RepairBooking, RepairStatus } from '../types';
import { RepairTimeline } from '../components/RepairTimeline';
import {
  Wrench,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  FileText,
  Star,
  Sparkles,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

export const RepairsPage: React.FC = () => {
  const {
    bookings,
    activeBooking,
    setActiveBooking,
    updateBookingStatus,
    addReviewToBooking,
    setActiveTab,
  } = useApp();

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewBox, setShowReviewBox] = useState(false);

  const current = activeBooking || bookings[0];

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current) return;
    addReviewToBooking(current.id, reviewRating, reviewComment);
    setShowReviewBox(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Live Workbench Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Repair Tracking & Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Follow the physical diagnostics, part replacement, and stress benchmarking of your active repairs.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('diagnose')}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Repair Case</span>
        </button>
      </div>

      {/* Main Grid: LEFT (Active Bookings Selector & Info), RIGHT (Interactive Timeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Bookings List & Summary Card */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Bookings Selector */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Your Active & Recent Repairs ({bookings.length})
            </span>

            {bookings.map((b) => {
              const isSelected = current?.id === b.id;
              const isCompleted = b.status === 'completed';

              return (
                <div
                  key={b.id}
                  onClick={() => setActiveBooking(b)}
                  className={`bg-white rounded-2xl border-2 transition-all p-4 cursor-pointer relative ${
                    isSelected
                      ? 'border-emerald-600 ring-4 ring-emerald-500/10 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Tracking: {b.trackingCode}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 my-2.5">
                    <img
                      src={b.diagnosis.images[0]}
                      alt={b.diagnosis.deviceModel}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {b.diagnosis.identifiedIssue}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {b.diagnosis.brand} {b.diagnosis.deviceModel} • ₹{b.totalAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span className="font-semibold text-slate-700">{b.repairer.name}</span>
                    <span>Updated {b.updatedAt.split('T')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Selected Booking Card */}
          {current && (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Workshop</span>
                  <h4 className="text-sm font-black text-slate-900 mt-0.5">{current.repairer.name}</h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Authorized Amount</span>
                  <p className="text-base font-black text-slate-900">₹{current.totalAmount.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Contact & Location Strip */}
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Technician Hotline: <strong>{current.repairer.phone}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{current.repairer.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-800 font-bold">
                    {current.warrantyDays}-Day Warranty Active until {current.warrantyExpiryDate}
                  </span>
                </div>
              </div>

              {/* Review & Rating prompt when completed */}
              {current.status === 'completed' && !current.ratingGiven && (
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                  <h5 className="text-xs font-bold text-emerald-950 mb-1">
                    How was your repair experience?
                  </h5>
                  <p className="text-[11px] text-emerald-800 mb-3">
                    Leave a review to help others find trustworthy electronics specialists.
                  </p>
                  <button
                    onClick={() => setShowReviewBox(true)}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    Rate & Review Workshop
                  </button>
                </div>
              )}

              {current.ratingGiven && (
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold mb-1">
                    {[...Array(current.ratingGiven)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                    <span className="text-slate-700 ml-1">Your Verified Review</span>
                  </div>
                  <p className="text-slate-600 italic">"{current.reviewGiven}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Interactive Real-Time Timeline */}
        <div className="lg:col-span-7">
          {current ? (
            <RepairTimeline
              events={current.timeline}
              currentStatus={current.status}
              onAdvanceStatus={(next) => updateBookingStatus(current.id, next)}
              canManage={true}
            />
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">
              <p className="text-sm text-slate-500">Select an active repair to track workbench progress.</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewBox && current && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-black text-slate-900">
              Review {current.repairer.name}
            </h3>
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Feedback</label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details on turnaround speed, thermal testing, and build quality..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewBox(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
