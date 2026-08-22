import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Repairer } from '../types';
import { Map } from '../components/Map';
import {
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  Filter,
  CheckCircle2,
  Sparkles,
  Award,
  ChevronRight
} from 'lucide-react';

export const RepairersPage: React.FC = () => {
  const {
    repairers,
    selectedRepairer,
    setSelectedRepairer,
    userLocation,
    setActiveTab,
    currentDiagnosis,
  } = useApp();

  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');

  const filteredRepairers = repairers.filter((rep) => {
    if (verifiedOnly && !rep.verified) return false;
    if (rep.distanceKm > maxDistance) return false;
    if (selectedSpecialty !== 'all') {
      const match = rep.specialties.some((s) => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Local Repair Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Discover Nearby Electronics Labs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse authenticated micro-soldering labs, view trust scores, and get direct quotes for {currentDiagnosis?.deviceModel || 'your device'}.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('quotes')}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <span>Compare Active Quotes</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <span>Verified Labs Only</span>
          </label>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2 text-slate-600">
            <span className="font-semibold">Max Distance:</span>
            <select
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900"
            >
              <option value={3}>Within 3 km</option>
              <option value={5}>Within 5 km</option>
              <option value={10}>Within 10 km</option>
              <option value={20}>Within 20 km</option>
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2 text-slate-600">
            <span className="font-semibold">Specialty:</span>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900"
            >
              <option value="all">All Specialties</option>
              <option value="thermal">Thermal & Cooling</option>
              <option value="display">Screen / Display</option>
              <option value="battery">Battery & Power</option>
              <option value="micro-soldering">Micro-soldering</option>
            </select>
          </div>
        </div>

        <span className="text-slate-400 font-medium">
          Showing {filteredRepairers.length} workshops near {userLocation.city}
        </span>
      </div>

      {/* Split Screen Layout (LEFT: Cards List, RIGHT: Interactive Map) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Repairer Cards */}
        <div className="lg:col-span-6 space-y-4 max-h-[750px] overflow-y-auto pr-1">
          {filteredRepairers.map((rep) => {
            const isSelected = selectedRepairer?.id === rep.id;

            return (
              <div
                key={rep.id}
                onClick={() => setSelectedRepairer(rep)}
                className={`bg-white rounded-3xl border-2 transition-all duration-200 card-hover p-5 sm:p-6 cursor-pointer relative ${
                  isSelected
                    ? 'border-emerald-600 ring-4 ring-emerald-500/10 shadow-lg'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={rep.logo}
                      alt={rep.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-black text-slate-900">{rep.name}</h3>
                        {rep.verified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{rep.tagline}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-600">
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 mr-0.5" />
                          {rep.rating}
                        </span>
                        <span className="text-slate-400">({rep.reviewCount} reviews)</span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-700">{rep.distanceKm} km away</span>
                      </div>
                    </div>
                  </div>

                  {/* Trust Score Badge */}
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center shrink-0">
                    <span className="text-sm font-black text-emerald-900 leading-none">
                      {rep.trustScore}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest mt-0.5">
                      Trust
                    </span>
                  </div>
                </div>

                {/* Specs Strip */}
                <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 rounded-xl p-2 text-center">
                    <span className="text-[10px] text-slate-400 block font-medium">Est. Price</span>
                    <span className="font-bold text-slate-900">{rep.priceRange}</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2 text-center">
                    <span className="text-[10px] text-slate-400 block font-medium">Turnaround</span>
                    <span className="font-bold text-slate-900">{rep.avgTurnaroundDays} Days Avg</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2 text-center">
                    <span className="text-[10px] text-slate-400 block font-medium">Warranty</span>
                    <span className="font-bold text-emerald-700">{rep.warrantyDays} Days</span>
                  </div>
                </div>

                {/* Specialties Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {rep.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Featured review snippet */}
                {rep.reviews[0] && (
                  <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-100 text-xs text-slate-600 mb-4">
                    <span className="italic leading-relaxed block">"{rep.reviews[0].comment}"</span>
                    <span className="text-[10px] text-slate-400 font-bold mt-1 block">
                      — {rep.reviews[0].userName} ({rep.reviews[0].deviceRepaired})
                    </span>
                  </div>
                )}

                {/* Action button */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {rep.address.split(',')[0]}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRepairer(rep);
                      setActiveTab('quotes');
                    }}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <span>Request Quote / Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Interactive Leaflet OpenStreetMap */}
        <div className="lg:col-span-6 sticky top-24 h-[650px] rounded-3xl overflow-hidden shadow-md">
          <Map
            repairers={filteredRepairers}
            selectedRepairer={selectedRepairer}
            onSelectRepairer={(rep) => setSelectedRepairer(rep)}
            userLocation={userLocation}
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};
