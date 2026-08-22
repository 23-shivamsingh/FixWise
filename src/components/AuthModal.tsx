import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { useFixWiseAuth } from '../context/AuthContext';
import { X, ShieldCheck } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isConfigured, authModalOpen, setAuthModalOpen, authModalMode, setAuthModalMode } =
    useFixWiseAuth();

  if (!authModalOpen || !isConfigured) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-4 sm:p-6 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
              FW
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span>FixWise AI Security</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </h3>
              <p className="text-[11px] text-slate-500">
                {authModalMode === 'signin' ? 'Sign in with Google or Email' : 'Create your secure account'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Embedded Clerk Component */}
        <div className="flex justify-center">
          {authModalMode === 'signin' ? (
            <SignIn
              routing="hash"
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'shadow-none p-0 border-0',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                },
              }}
            />
          ) : (
            <SignUp
              routing="hash"
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'shadow-none p-0 border-0',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                },
              }}
            />
          )}
        </div>

        {/* Switch mode */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-center">
          {authModalMode === 'signin' ? (
            <p className="text-xs text-slate-600">
              Don't have an account?{' '}
              <button
                onClick={() => setAuthModalMode('signup')}
                className="font-bold text-emerald-700 hover:underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-600">
              Already have an account?{' '}
              <button
                onClick={() => setAuthModalMode('signin')}
                className="font-bold text-emerald-700 hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
