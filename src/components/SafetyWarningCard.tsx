import React from 'react';
import { SafetyRiskLevel } from '../types';
import { AlertTriangle, Flame, ShieldAlert, Zap, Droplets, CheckCircle2, ShieldCheck } from 'lucide-react';

interface SafetyWarningCardProps {
  safetyRisk: SafetyRiskLevel;
  hazardType?: 'swollen_battery' | 'liquid_damage' | 'spark_hazard' | 'high_voltage' | 'overheating' | 'none';
  warningText?: string;
  professionalRepairRecommended?: boolean;
}

export const SafetyWarningCard: React.FC<SafetyWarningCardProps> = ({
  safetyRisk,
  hazardType = 'none',
  warningText,
  professionalRepairRecommended = true,
}) => {
  if (safetyRisk === 'safe') {
    return (
      <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
              Safe to Handle
            </span>
            <span className="text-xs text-emerald-700">No active electrical or chemical hazards detected</span>
          </div>
          <p className="text-xs text-emerald-900 mt-1 font-medium leading-relaxed">
            {warningText || 'Device is physically safe for user inspection and basic troubleshooting.'}
          </p>
        </div>
      </div>
    );
  }

  const isCritical = safetyRisk === 'dangerous_stop_using';
  const isModerate = safetyRisk === 'professional_recommended' || safetyRisk === 'low_risk';

  const getHazardIcon = () => {
    switch (hazardType) {
      case 'swollen_battery':
        return <Flame className="w-5 h-5" />;
      case 'spark_hazard':
      case 'high_voltage':
        return <Zap className="w-5 h-5" />;
      case 'liquid_damage':
        return <Droplets className="w-5 h-5" />;
      case 'overheating':
        return <Flame className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={`rounded-2xl p-4.5 border transition-all ${
        isCritical
          ? 'bg-rose-50/90 border-rose-300 ring-2 ring-rose-200/60 shadow-sm'
          : 'bg-amber-50/80 border-amber-200/90'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
            isCritical
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 animate-subtle-pulse'
              : 'bg-amber-500 text-white shadow-sm'
          }`}
        >
          {getHazardIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                isCritical
                  ? 'bg-rose-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}
            >
              {isCritical ? '⚠️ CRITICAL SAFETY WARNING' : '⚡ SAFETY ADVISORY'}
            </span>
            <span
              className={`text-xs font-semibold ${
                isCritical ? 'text-rose-900' : 'text-amber-900'
              }`}
            >
              {isCritical ? 'Stop using device immediately' : 'Professional Inspection Recommended'}
            </span>
          </div>

          <p className="text-xs font-medium text-slate-800 leading-relaxed mt-1.5">
            {warningText ||
              'This hardware issue involves components that can be damaged by improper handling or present fire/shock hazards.'}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60 text-[11px] font-medium text-slate-600">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Do not puncture or squeeze chassis
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Keep away from heat sources
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Use certified ESD bench
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
