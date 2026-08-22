import React from 'react';
import { useApp } from '../context/AppContext';
import { DemoCaseSelector } from '../components/DemoCaseSelector';
import { RepairVsReplaceCard } from '../components/RepairVsReplaceCard';
import { RepairabilityGauge } from '../components/RepairabilityGauge';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Leaf,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Smartphone,
  Laptop,
  Headphones,
  DollarSign,
  Clock,
  Award,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveTab, loadDemoCase } = useApp();

  return (
    <div className="space-y-12 sm:space-y-18 pb-12">
      {/* HERO SECTION */}
      <section className="pt-2 sm:pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Hero Left Column (Copy & Primary CTAs) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Tagline pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Repair smarter. Replace less.</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
              Before You Replace It, Know Your{' '}
              <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy decoration-2">
                Repair Options
              </span>
              .
            </h1>

            {/* Short Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
              Upload a photo, understand the problem, compare repair options, and make a smarter repair decision with AI.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('diagnose')}
                className="px-7 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-700/25 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Diagnose a Problem</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  loadDemoCase('demo-laptop-overheating');
                }}
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 rounded-2xl font-bold text-sm shadow-xs hover:shadow-sm transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
              >
                <span>Try Judge Demo</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-extrabold">
                  Instant 🏆
                </span>
              </button>
            </div>

            {/* Key Micro-trust stats */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="text-xl sm:text-2xl font-black text-slate-900 block">74%</span>
                <span className="text-xs text-slate-500 font-medium">Avg Savings vs Replace</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-slate-900 block">&lt; 18min</span>
                <span className="text-xs text-slate-500 font-medium">Quote Turnaround</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-slate-900 block">100%</span>
                <span className="text-xs text-slate-500 font-medium">Deterministic Rules</span>
              </div>
            </div>
          </div>

          {/* Hero Right Column: Interactive Live Repair-Analysis Showcase Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl p-5 sm:p-6 relative overflow-hidden transition-all hover:border-emerald-500/50">
              {/* Top Card Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    FixWise AI Visual Analysis
                  </span>
                </div>
                <span className="text-[11px] font-extrabold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  94% Confidence
                </span>
              </div>

              {/* Device Photo & Issue */}
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80"
                  alt="Dell XPS 15 laptop"
                  className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    Laptop • Dell XPS 15
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug mt-0.5 truncate">
                    Thermal Exhaust Blockage
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                      Low Safety Risk
                    </span>
                    <span>•</span>
                    <span>Modularity: High</span>
                  </div>
                </div>
              </div>

              {/* Repairability Gauge Mini */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/80 p-3 rounded-2xl">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Repairability Score
                  </span>
                  <span className="text-xs font-bold text-slate-800">Highly Repairable</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-emerald-700">86</span>
                  <span className="text-xs font-bold text-slate-400">/100</span>
                </div>
              </div>

              {/* Repair vs Replace Comparison Box */}
              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">
                    Repair Cost
                  </span>
                  <span className="text-xl font-black text-slate-900 mt-1 block">
                    ₹6,500
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold">+24 months life</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Replace New
                  </span>
                  <span className="text-xl font-black text-slate-900 mt-1 block">
                    ₹80,000
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">+4 years life</span>
                </div>
              </div>

              {/* Recommendation Callout */}
              <div className="bg-emerald-700 text-white rounded-2xl p-3.5 flex items-center justify-between shadow-md shadow-emerald-700/20">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-200 block">
                      Recommended
                    </span>
                    <span className="text-sm font-black tracking-tight">REPAIR THIS DEVICE</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-200 block">Net Savings</span>
                  <span className="text-sm font-extrabold text-white">₹73,500</span>
                </div>
              </div>

              {/* Card Footer CTA */}
              <button
                onClick={() => loadDemoCase('demo-laptop-overheating')}
                className="w-full mt-3 py-2 text-center text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors flex items-center justify-center gap-1"
              >
                Inspect full diagnostic breakdown <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 1-CLICK JUDGE DEMO SELECTOR BAR */}
      <section>
        <DemoCaseSelector />
      </section>

      {/* SECTION 1: THE CORE PROBLEM */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            The Repair Dilemma
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Broken Device → Uncertainty → Unnecessary Replacement
          </h2>
          <p className="text-sm text-slate-600">
            Consumers discard perfectly fixable electronics simply because diagnosing hardware is opaque and repair quotes lack transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm card-hover hover:border-emerald-500/40 transition-all duration-200 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">What broke?</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1.5">
              AI computer vision inspects the physical damage, isolates faulty sub-assemblies, and checks for battery or electrical safety risks.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm card-hover hover:border-emerald-500/40 transition-all duration-200 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Is repair worth it?</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1.5">
              Deterministic engines calculate the Repairability Score (0–100) and compare exact lifecycle ownership costs vs buying new.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm card-hover hover:border-emerald-500/40 transition-all duration-200 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Who should repair it?</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1.5">
              Discover verified local electronics labs, compare transparent quotes for Best Value, and track real-time bench repair steps.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW FIXWISE WORKS (4-STEP CLEAN PIPELINE) */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1.5">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
            Streamlined Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            How FixWise Works in 4 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white font-black text-sm flex items-center justify-center shadow-sm">
              1
            </div>
            <h4 className="text-sm font-bold text-slate-900">Upload Photo</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Snap a picture of the broken device or describe the symptoms in a few words.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white font-black text-sm flex items-center justify-center shadow-sm">
              2
            </div>
            <h4 className="text-sm font-bold text-slate-900">AI Diagnosis</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Identify the damaged component, check safety hazard levels, and inspect DIY steps.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white font-black text-sm flex items-center justify-center shadow-sm">
              3
            </div>
            <h4 className="text-sm font-bold text-slate-900">Compare Quotes</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Receive verified quotes ranked by Best Value, Lowest Price, and Fastest Turnaround.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white font-black text-sm flex items-center justify-center shadow-sm">
              4
            </div>
            <h4 className="text-sm font-bold text-slate-900">Repair & Track</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Book in 1-click, follow real-time workbench updates, and receive an active warranty pass.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: REPAIR VS REPLACE SHOWCASE */}
      <section className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1 mb-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
            Key Decision Differentiator
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Deterministic Decision Engine
          </h2>
        </div>

        <RepairVsReplaceCard
          repairCost={6500}
          replacementCost={80000}
          expectedLifeExtensionMonths={24}
          expectedReplacementLifeYears={4}
          verdict="REPAIR"
          verdictReason="Repairing saves ₹73,500 (92%) compared to purchasing a new unit, restoring full computing performance with 24 months of expected life extension."
          estimatedSavings={73500}
          onExploreRepairers={() => setActiveTab('repairers')}
        />
      </section>

      {/* SECTION 4: REPAIRABILITY SCORE SECTION */}
      <section className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1 mb-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
            Hardware Intelligence
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Transparent Repairability Scoring
          </h2>
        </div>

        <RepairabilityGauge
          score={86}
          breakdown={{
            partsAvailability: 92,
            repairComplexity: 80,
            costFeasibility: 96,
            localServiceability: 95,
            productAgeFactor: 88,
          }}
          showBreakdown={true}
        />
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
        <div className="max-w-2xl mx-auto space-y-5 relative z-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-700">
            Zero Guesswork • High Savings
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Got a Broken Device Right Now?
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 font-medium">
            Upload a photo in 10 seconds to discover what is wrong, whether it's safe to use, and how much you can save.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('diagnose')}
              className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl font-black text-sm shadow-xl transition-all hover:scale-105 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Start Free Diagnosis</span>
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold text-sm transition-all"
            >
              Open Repair vs Replace Calculator
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
