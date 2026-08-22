import React from 'react';
import { UserDevice } from '../types';
import { ShieldCheck, Battery, Cpu, Activity, Wrench, Sparkles, QrCode, Award } from 'lucide-react';

interface DevicePassportCardProps {
  device: UserDevice;
  onDiagnoseNow?: () => void;
}

export const DevicePassportCard: React.FC<DevicePassportCardProps> = ({
  device,
  onDiagnoseNow,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md card-hover transition-all duration-200 relative overflow-hidden flex flex-col justify-between">
      {/* Top Passport Ribbon */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            Digital Repair Passport • ID #{device.id.substring(4, 9).toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Verified Hardware
        </div>
      </div>

      {/* Main Info */}
      <div className="my-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-lg font-black text-slate-900 tracking-tight">
              {device.name}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {device.brand} • {device.model} • Purchased {device.purchaseDate}
            </p>
          </div>

          {/* Circular Health Badge */}
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center shrink-0">
            <span className="text-base font-black text-emerald-900 leading-none">
              {device.overallHealthScore}
            </span>
            <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider mt-0.5">
              Health
            </span>
          </div>
        </div>

        {/* Health Factor Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
              <Battery className="w-3.5 h-3.5 text-emerald-600" />
              <span>Battery</span>
            </div>
            <p className="text-sm font-extrabold text-slate-900 mt-1">{device.batteryHealth}%</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>Compute</span>
            </div>
            <p className="text-sm font-extrabold text-slate-900 mt-1">{device.performanceScore}%</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
              <Activity className="w-3.5 h-3.5 text-purple-600" />
              <span>Chassis</span>
            </div>
            <p className="text-sm font-extrabold text-slate-900 mt-1">{device.physicalCondition}%</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
              <Wrench className="w-3.5 h-3.5 text-amber-600" />
              <span>Repairable</span>
            </div>
            <p className="text-sm font-extrabold text-slate-900 mt-1">{device.repairabilityScore}%</p>
          </div>
        </div>

        {/* Repair History & Parts replaced in passport */}
        <div className="bg-slate-50/70 rounded-2xl p-3.5 border border-slate-200/80 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="font-semibold text-slate-700">Verified Service Count:</span>
            <span className="font-bold text-slate-900">{device.repairsCount} Repair Events</span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span className="font-semibold text-slate-700">Lifetime Repair Spend:</span>
            <span className="font-bold text-slate-900">₹{device.totalRepairSpend.toLocaleString('en-IN')}</span>
          </div>

          {device.partsReplaced.length > 0 && (
            <div className="pt-2 border-t border-slate-200/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Parts Log:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {device.partsReplaced.map((part, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-medium bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                  >
                    ✓ {part}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-semibold">
          <Award className="w-3.5 h-3.5 text-emerald-600" />
          <span>{device.carbonAvoidedKg} kg CO₂ saved</span>
        </div>

        {onDiagnoseNow && (
          <button
            type="button"
            onClick={onDiagnoseNow}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 shadow-sm flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Check Health
          </button>
        )}
      </div>
    </div>
  );
};
