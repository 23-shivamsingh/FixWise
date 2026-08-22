import React, { useState } from 'react';
import { analyzeQuoteDocument } from '../lib/gemini';
import { uploadImage } from '../lib/storage';
import { QuoteScanResult } from '../types';
import { FileSearch, Upload, CheckCircle2, AlertTriangle, X, Sparkles, Receipt, ArrowRight } from 'lucide-react';

interface QuoteScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuoteScannerModal: React.FC<QuoteScannerModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [result, setResult] = useState<QuoteScanResult | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const uploaded = await uploadImage(file);
      setPreviewImage(uploaded.url);

      const scan = await analyzeQuoteDocument(uploaded.url, 'Laptop / Smartphone estimate');
      setResult(scan);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunDemoScan = async () => {
    setLoading(true);
    // Simulate invoice image
    setPreviewImage('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80');
    setTimeout(async () => {
      const scan = await analyzeQuoteDocument('', 'MacBook Screen Replacement');
      setResult(scan);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 md:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                AI Quote & Bill Fairness Scanner
              </h3>
              <p className="text-xs text-slate-500">
                Upload a repair shop quotation, bill, or estimate to evaluate pricing fairness.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!result && !loading && (
            <div className="space-y-4">
              {/* Dropzone */}
              <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-emerald-50/20 group">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-emerald-700 mb-3 group-hover:scale-105 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Upload Quotation Image or Bill</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Supports PNG, JPG, or screenshot of WhatsApp estimates. Our AI extracts line items automatically.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="flex items-center justify-center gap-2">
                <span className="h-px w-16 bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">or</span>
                <span className="h-px w-16 bg-slate-200" />
              </div>

              <button
                type="button"
                onClick={handleRunDemoScan}
                className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Try Sample Repair Estimate Scan
              </button>
            </div>
          )}

          {/* Loading Animation */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                <Sparkles className="w-6 h-6 text-emerald-700 absolute inset-0 m-auto" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Scanning Invoice Line Items...</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Benchmarking parts cost and labor rates against regional wholesale indexes.
                </p>
              </div>
            </div>
          )}

          {/* Result View */}
          {result && !loading && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Fairness Score Hero */}
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-emerald-300 shadow-sm flex flex-col items-center justify-center shrink-0">
                    <span className="text-2xl font-black text-emerald-800 leading-none">
                      {result.fairnessScore}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">
                      /100
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2.5 py-0.5 rounded-full">
                      {result.totalFairness}
                    </span>
                    <h4 className="text-base font-black text-slate-900 mt-1">
                      {result.shopName}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium">{result.summary}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Detected Total</span>
                  <p className="text-xl font-black text-slate-900">
                    ₹{result.detectedTotal.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Line Items Breakdown */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 font-medium">Parts</span>
                  <p className="text-sm font-black text-slate-900 mt-0.5">₹{result.detectedPartsCost}</p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded mt-1 inline-block">
                    {result.partsFairness}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 font-medium">Labor & Bench</span>
                  <p className="text-sm font-black text-slate-900 mt-0.5">₹{result.detectedLaborCost}</p>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded mt-1 inline-block">
                    {result.laborFairness}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 font-medium">GST / Taxes</span>
                  <p className="text-sm font-black text-slate-900 mt-0.5">₹{result.detectedTaxCost}</p>
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded mt-1 inline-block">
                    {result.serviceFairness}
                  </span>
                </div>
              </div>

              {/* Flagged items */}
              {result.flaggedItems.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <h5 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    AI Diagnostic Observations
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {result.flaggedItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Reset button */}
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setPreviewImage(null);
                }}
                className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Scan Another Quotation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
