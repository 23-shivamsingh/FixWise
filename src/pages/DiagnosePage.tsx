import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DeviceCategory, DiagnosisResult } from '../types';
import { diagnoseDeviceWithAI } from '../lib/gemini';
import { uploadImage } from '../lib/storage';
import { SafetyWarningCard } from '../components/SafetyWarningCard';
import { RepairabilityGauge } from '../components/RepairabilityGauge';
import { RepairVsReplaceCard } from '../components/RepairVsReplaceCard';
import { TroubleshootingList } from '../components/TroubleshootingList';
import { DemoCaseSelector } from '../components/DemoCaseSelector';
import {
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  Watch,
  Tv,
  Sparkles,
  Upload,
  Camera,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Clock,
  Layers,
  MapPin,
  Bot,
  FileCheck2
} from 'lucide-react';

export const DiagnosePage: React.FC = () => {
  const {
    currentDiagnosis,
    setCurrentDiagnosis,
    setActiveTab,
    setCopilotOpen,
  } = useApp();

  // Multi-step state
  const [step, setStep] = useState<1 | 2 | 3 | 4>(currentDiagnosis ? 4 : 1);
  const [category, setCategory] = useState<DeviceCategory>('laptop');
  const [brand, setBrand] = useState('Dell');
  const [model, setModel] = useState('XPS 15 (9500)');
  const [purchaseYear, setPurchaseYear] = useState<number>(2022);
  const [originalPrice, setOriginalPrice] = useState<number>(110000);
  const [userDescription, setUserDescription] = useState('Laptop fans spin at max speed within 5 minutes of booting. Keyboard area gets burning hot and the system throttles heavily.');
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80'
  ]);
  const [uploading, setUploading] = useState(false);

  // Analysis loader progress state
  const [analyzingStage, setAnalyzingStage] = useState<string>('Inspecting image telemetry...');

  const deviceCategories: { id: DeviceCategory; label: string; icon: any }[] = [
    { id: 'smartphone', label: 'Smartphone', icon: Smartphone },
    { id: 'laptop', label: 'Laptop / PC', icon: Laptop },
    { id: 'tablet', label: 'Tablet / iPad', icon: Tablet },
    { id: 'headphones', label: 'Headphones', icon: Headphones },
    { id: 'smartwatch', label: 'Smartwatch', icon: Watch },
    { id: 'appliance', label: 'Appliance', icon: Tv },
  ];

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < Math.min(3, files.length); i++) {
        const res = await uploadImage(files[i]);
        newUrls.push(res.url);
      }
      setUploadedImages(newUrls);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleRunDiagnosis = async () => {
    setStep(4);
    setCurrentDiagnosis(null);

    // Multi-stage visual loader sequence
    setAnalyzingStage('Inspecting image telemetry...');
    await new Promise((r) => setTimeout(r, 600));

    setAnalyzingStage('Identifying hardware model & sub-assemblies...');
    await new Promise((r) => setTimeout(r, 600));

    setAnalyzingStage('Analyzing damage severity & electrical safety risks...');
    await new Promise((r) => setTimeout(r, 600));

    setAnalyzingStage('Running deterministic repairability engine...');
    await new Promise((r) => setTimeout(r, 600));

    setAnalyzingStage('Calculating Repair vs Replace ROI...');

    const result = await diagnoseDeviceWithAI({
      category,
      brand,
      model,
      purchaseYear,
      originalPrice,
      userDescription,
      images: uploadedImages,
    });

    setCurrentDiagnosis(result);
  };

  const handleResetDiagnosis = () => {
    setCurrentDiagnosis(null);
    setStep(1);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Visual Diagnosis & Decision Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Diagnose a Device Problem
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload hardware photos and receive instant technical analysis, safety screening, and repair cost comparison.
          </p>
        </div>

        {currentDiagnosis && (
          <button
            onClick={handleResetDiagnosis}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            New Diagnosis
          </button>
        )}
      </div>

      {/* QUICK PRESET CASES BAR */}
      <DemoCaseSelector compact={true} onCaseSelected={() => setStep(4)} />

      {/* MULTI-STEP DIAGNOSIS WIZARD */}
      {!currentDiagnosis && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
          {/* Step indicator */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
                {step}
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                {step === 1 && 'Step 1: Select Device Type'}
                {step === 2 && 'Step 2: Upload Device Photos'}
                {step === 3 && 'Step 3: Describe Symptoms'}
                {step === 4 && 'Step 4: AI Analysis in Progress'}
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Step {step} of 4</span>
          </div>

          {/* STEP 1: SELECT DEVICE */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {deviceCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                        isSelected
                          ? 'bg-emerald-50/60 border-emerald-600 ring-2 ring-emerald-500/20 text-emerald-950 font-bold'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`} />
                      <span className="text-xs">{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Brand / Manufacturer</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Dell, Apple, Samsung, Sony"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Model Name / Number</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. XPS 15 (9500), iPhone 14 Pro"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Purchase Year</label>
                  <input
                    type="number"
                    value={purchaseYear}
                    onChange={(e) => setPurchaseYear(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Original Price (₹ MRP)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  Continue to Upload <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: UPLOAD PHOTOS */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-emerald-50/20 group">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-emerald-700 mb-3 group-hover:scale-105 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Upload Broken Device Photo(s)</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Drag and drop close-up photos of screens, vents, ports, or charging indicators (up to 3 images).
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageFile}
                  className="hidden"
                />
              </label>

              {/* Uploaded Previews */}
              {uploadedImages.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-2">Selected Photo Previews:</span>
                  <div className="flex flex-wrap gap-3">
                    {uploadedImages.map((img, i) => (
                      <div key={i} className="relative w-28 h-28 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                        <img src={img} alt={`Device upload ${i}`} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                          #{i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  Continue to Problem Description <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DESCRIBE PROBLEM */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  What happened? (Describe symptoms, noises, or physical impact)
                </label>
                <textarea
                  rows={4}
                  value={userDescription}
                  onChange={(e) => setUserDescription(e.target.value)}
                  placeholder="e.g. My laptop turns on but the screen stays black. Or fans are spinning loudly with overheating."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Quick symptoms presets */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Quick Add Common Symptoms:
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    'Fans spinning at max speed',
                    'Overheating / thermal shutdown',
                    'Screen cracked but touch works',
                    'Battery drains rapidly / bulging',
                    'USB-C charging port loose',
                    'No sound from one side',
                  ].map((symptom, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setUserDescription((prev) => `${prev} ${symptom}.`)}
                      className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 rounded-full font-medium transition-colors text-slate-700"
                    >
                      + {symptom}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleRunDiagnosis}
                  className="px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-700/25 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Analyze with FixWise AI</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ANALYSIS LOADER */}
          {step === 4 && !currentDiagnosis && (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                <Sparkles className="w-8 h-8 text-emerald-700 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-900">{analyzingStage}</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Running multimodal computer vision model & deterministic hardware scoring rules...
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FULL DIAGNOSIS RESULT DASHBOARD */}
      {currentDiagnosis && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top Result Banner */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-7 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-start gap-4">
                <img
                  src={currentDiagnosis.images[0] || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80'}
                  alt={currentDiagnosis.deviceModel}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      {currentDiagnosis.brand} • {currentDiagnosis.deviceCategory}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      AI-Assisted Assessment
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
                    {currentDiagnosis.identifiedIssue}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium max-w-xl">
                    {currentDiagnosis.deviceModel} (Purchased {currentDiagnosis.purchaseYear}, MRP ₹{currentDiagnosis.originalPrice.toLocaleString('en-IN')})
                  </p>
                </div>
              </div>

              {/* Confidence & Severity Box */}
              <div className="flex items-center gap-3 self-stretch md:self-auto bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="text-center px-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Severity</span>
                  <span className={`text-xs font-black uppercase ${
                    currentDiagnosis.severity === 'critical' ? 'text-rose-600' : 'text-amber-600'
                  }`}>
                    {currentDiagnosis.severity}
                  </span>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-center px-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">AI Confidence</span>
                  <span className="text-xs font-black text-emerald-700">
                    {Math.round(currentDiagnosis.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Possible Root Causes List */}
            <div className="mt-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Isolated Possible Causes:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {currentDiagnosis.possibleCauses.map((cause, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-start gap-2 text-xs text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="font-medium leading-relaxed">{cause}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SAFETY WARNING SYSTEM */}
          <SafetyWarningCard
            safetyRisk={currentDiagnosis.safetyRisk}
            hazardType={currentDiagnosis.hazardType}
            warningText={currentDiagnosis.safetyWarningText}
            professionalRepairRecommended={currentDiagnosis.professionalRepairRecommended}
          />

          {/* REPAIRABILITY SCORE GAUGE */}
          <RepairabilityGauge
            score={currentDiagnosis.repairabilityScore}
            breakdown={currentDiagnosis.repairabilityBreakdown}
            showBreakdown={true}
          />

          {/* REPAIR VS REPLACE DECISION CARD */}
          <RepairVsReplaceCard
            repairCost={currentDiagnosis.estimatedRepairCostMax}
            replacementCost={currentDiagnosis.replacementCostEstimate}
            expectedLifeExtensionMonths={currentDiagnosis.expectedLifeExtensionMonths}
            expectedReplacementLifeYears={currentDiagnosis.expectedReplacementLifeYears}
            verdict={currentDiagnosis.repairVsReplaceVerdict}
            verdictReason={currentDiagnosis.verdictReason}
            estimatedSavings={currentDiagnosis.estimatedSavings}
            onExploreRepairers={() => setActiveTab('quotes')}
          />

          {/* DIY TROUBLESHOOTING GUIDE */}
          <TroubleshootingList steps={currentDiagnosis.troubleshootingSteps} />

          {/* ACTION CTA STRIP */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                Next Recommended Step
              </span>
              <h4 className="text-base sm:text-lg font-black mt-0.5">
                Compare Quotes from 4 Nearby Verified Technicians
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Estimated repair benchmark: ₹{currentDiagnosis.estimatedRepairCostMin.toLocaleString('en-IN')} – ₹{currentDiagnosis.estimatedRepairCostMax.toLocaleString('en-IN')} (60–120 day warranty included).
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setCopilotOpen(true)}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-700"
              >
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>Ask Copilot</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('quotes')}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <span>Compare 4 Quotes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
