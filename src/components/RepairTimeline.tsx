import React from 'react';
import { TimelineEvent, RepairStatus } from '../types';
import { CheckCircle2, Clock, Circle, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';

interface RepairTimelineProps {
  events: TimelineEvent[];
  currentStatus: RepairStatus;
  onAdvanceStatus?: (nextStatus: RepairStatus) => void;
  canManage?: boolean;
}

export const RepairTimeline: React.FC<RepairTimelineProps> = ({
  events,
  currentStatus,
  onAdvanceStatus,
  canManage = false,
}) => {
  const statusFlow: RepairStatus[] = [
    'requested',
    'repairer_accepted',
    'device_received',
    'diagnosis_confirmed',
    'in_progress',
    'quality_check',
    'ready_for_pickup',
    'completed'
  ];

  const currentIdx = statusFlow.indexOf(currentStatus);
  const nextStatus = currentIdx >= 0 && currentIdx < statusFlow.length - 1 ? statusFlow[currentIdx + 1] : null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 mb-6">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            Real-Time Tracking
          </span>
          <h4 className="text-lg font-black text-slate-900 mt-1.5 tracking-tight">
            Repair Progress Timeline
          </h4>
        </div>

        {/* Demo/Repairer step advancement button */}
        {nextStatus && (
          <button
            type="button"
            onClick={() => onAdvanceStatus && onAdvanceStatus(nextStatus)}
            className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
            title="Advance timeline step for demonstration"
          >
            Advance to Next Step: {nextStatus.replace(/_/g, ' ')}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Timeline items */}
      <div className="relative pl-6 md:pl-8 space-y-6 before:absolute before:left-[11px] md:before:left-[15px] before:top-3 before:bottom-3 before:w-[2px] before:bg-slate-200">
        {events.map((ev, index) => {
          const isCompleted = ev.completed;
          const isCurrent = ev.current;

          return (
            <div key={index} className="relative group">
              {/* Bullet indicator */}
              <div
                className={`absolute -left-6 md:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-50'
                    : isCurrent
                    ? 'bg-emerald-700 text-white ring-4 ring-emerald-200 animate-subtle-pulse'
                    : 'bg-white border-2 border-slate-300 text-slate-300'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isCurrent ? (
                  <Circle className="w-2.5 h-2.5 fill-white" />
                ) : (
                  <Circle className="w-2 h-2" />
                )}
              </div>

              {/* Event card content */}
              <div
                className={`rounded-2xl p-4 border transition-all ${
                  isCurrent
                    ? 'bg-emerald-50/50 border-emerald-500/50 shadow-sm'
                    : isCompleted
                    ? 'bg-white border-slate-200/90'
                    : 'bg-slate-50/50 border-dashed border-slate-200 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <h5
                      className={`text-xs md:text-sm font-bold ${
                        isCurrent
                          ? 'text-emerald-950'
                          : isCompleted
                          ? 'text-slate-900'
                          : 'text-slate-500'
                      }`}
                    >
                      {ev.label}
                    </h5>
                    {isCurrent && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                        In Progress Now
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 shrink-0">
                    {ev.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                  {ev.description}
                </p>

                {ev.proofImageUrl && (
                  <div className="mt-2.5">
                    <img
                      src={ev.proofImageUrl}
                      alt="Repair workbench proof"
                      className="w-32 h-20 object-cover rounded-lg border border-slate-200"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
