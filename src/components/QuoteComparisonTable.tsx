import React from 'react';
import { Quote } from '../types';
import { Star, ShieldCheck, Clock, Check, ArrowRight, Award, Zap, Tag } from 'lucide-react';

interface QuoteComparisonTableProps {
  quotes: Quote[];
  selectedQuote: Quote | null;
  onSelectQuote: (quote: Quote) => void;
  onProceedToBooking: (quote: Quote) => void;
}

export const QuoteComparisonTable: React.FC<QuoteComparisonTableProps> = ({
  quotes,
  selectedQuote,
  onSelectQuote,
  onProceedToBooking,
}) => {
  if (!quotes || quotes.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <p className="text-sm text-slate-500">No quotes received yet for this case.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cards Layout for all devices (responsive grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quotes.map((quote) => {
          const isSelected = selectedQuote?.id === quote.id;

          return (
            <div
              key={quote.id}
              onClick={() => onSelectQuote(quote)}
              className={`rounded-2xl border-2 transition-all duration-200 card-hover p-5 flex flex-col justify-between cursor-pointer relative ${
                isSelected
                  ? 'bg-emerald-50/30 border-emerald-600 ring-4 ring-emerald-500/10 shadow-lg'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md'
              }`}
            >
              {/* Highlight Badge */}
              {quote.isBestValue && (
                <div className="absolute -top-3 left-4 bg-emerald-700 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-300" />
                  Best Value
                </div>
              )}
              {quote.isCheapest && !quote.isBestValue && (
                <div className="absolute -top-3 left-4 bg-blue-700 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  Lowest Price
                </div>
              )}
              {quote.isFastest && !quote.isBestValue && !quote.isCheapest && (
                <div className="absolute -top-3 left-4 bg-amber-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Fastest 24h
                </div>
              )}

              <div>
                {/* Repairer header */}
                <div className="flex items-center gap-2.5 mt-1">
                  <img
                    src={quote.repairerLogo}
                    alt={quote.repairerName}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 truncate">
                      {quote.repairerName}
                    </h5>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <span className="flex items-center text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                        {quote.repairerRating}
                      </span>
                      <span>•</span>
                      <span>{quote.repairerDistanceKm} km</span>
                    </div>
                  </div>
                </div>

                {/* Price Display */}
                <div className="my-4 pb-3 border-b border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">
                      ₹{quote.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">all incl.</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>Parts: ₹{quote.partsCost.toLocaleString('en-IN')}</span>
                    <span>Labor: ₹{quote.laborCost.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Turnaround:
                    </span>
                    <span className="font-bold text-slate-800">
                      {quote.turnaroundDays} {quote.turnaroundDays === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                      Warranty:
                    </span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {quote.warrantyDays} Days
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Experience:</span>
                    <span className="font-medium text-slate-700">{quote.repairerExperienceYears} yrs</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-500">Fairness Index:</span>
                    <span className="font-extrabold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                      {quote.fairnessScore}/100
                    </span>
                  </div>
                </div>

                {/* Included services snippet */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
                  {quote.includedServices.slice(0, 2).map((srv, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600 truncate">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{srv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectQuote(quote);
                    onProceedToBooking(quote);
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                    isSelected
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20'
                      : 'bg-slate-900 hover:bg-black text-white'
                  }`}
                >
                  Book with this Quote
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
