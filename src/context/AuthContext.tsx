import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  UserButton,
  useUser,
  useClerk,
} from '@clerk/clerk-react';

const CLERK_PUBLISHABLE_KEY =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_CLERK_PUBLISHABLE_KEY || '';
const isClerkConfigured =
  Boolean(CLERK_PUBLISHABLE_KEY) &&
  CLERK_PUBLISHABLE_KEY !== 'pk_test_placeholder_key' &&
  !CLERK_PUBLISHABLE_KEY.includes('placeholder');

export interface AuthContextType {
  isConfigured: boolean;
  isSignedIn: boolean;
  user: {
    id?: string;
    fullName?: string | null;
    email?: string | null;
    imageUrl?: string | null;
  } | null;
  openSignIn: () => void;
  openSignUp: () => void;
  openUserProfile: () => void;
  signOut: () => Promise<void>;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'signin' | 'signup';
  setAuthModalMode: (mode: 'signin' | 'signup') => void;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Inner component that safely uses useUser and useClerk hooks when ClerkProvider is active
const ClerkAuthConsumer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut, openUserProfile: clerkOpenUserProfile } = useClerk();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  // Synchronize authenticated Clerk user with PostgreSQL backend
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const email = user.primaryEmailAddress?.emailAddress || '';
      const name = user.fullName || user.firstName || 'FixWise User';
      const avatar = user.imageUrl || '';
      const clerkId = user.id;

      setSyncStatus('syncing');

      fetch('/api/users/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkId,
          email,
          name,
          avatar,
        }),
      })
        .then((res) => {
          if (res.ok) {
            setSyncStatus('synced');
          } else {
            setSyncStatus('error');
          }
        })
        .catch(() => {
          // Backend might not be running yet in pure client mode
          setSyncStatus('error');
        });
    } else if (!isSignedIn) {
      setSyncStatus('idle');
    }
  }, [isLoaded, isSignedIn, user]);

  const openSignIn = () => {
    setAuthModalMode('signin');
    setAuthModalOpen(true);
  };

  const openSignUp = () => {
    setAuthModalMode('signup');
    setAuthModalOpen(true);
  };

  const openUserProfile = () => {
    try {
      if (clerkOpenUserProfile) {
        clerkOpenUserProfile();
      }
    } catch (e) {
      console.warn('Could not open clerk profile:', e);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setAuthModalOpen(false);
  };

  const authValue: AuthContextType = {
    isConfigured: true,
    isSignedIn: Boolean(isSignedIn),
    user: user
      ? {
          id: user.id,
          fullName: user.fullName || user.firstName,
          email: user.primaryEmailAddress?.emailAddress,
          imageUrl: user.imageUrl,
        }
      : null,
    openSignIn,
    openSignUp,
    openUserProfile,
    signOut: handleSignOut,
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    syncStatus,
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

// Fallback provider when Clerk Publishable Key is not yet configured by user
const DemoFallbackAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [mockSignedIn, setMockSignedIn] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  const [mockUser, setMockUser] = useState({
    id: 'demo_user_clerk_123',
    fullName: 'Priya Sharma (Demo)',
    email: 'priya.sharma@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  });

  const openSignIn = () => {
    setAuthModalMode('signin');
    setAuthModalOpen(true);
  };

  const openSignUp = () => {
    setAuthModalMode('signup');
    setAuthModalOpen(true);
  };

  const openUserProfile = () => {
    setAuthModalOpen(true);
  };

  const signOut = async () => {
    setMockSignedIn(false);
    setAuthModalOpen(false);
  };

  const handleMockSignIn = (email: string, name: string) => {
    setMockUser({
      id: `clerk_demo_${Date.now()}`,
      fullName: name,
      email,
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });
    setMockSignedIn(true);
    setAuthModalOpen(false);
    setSyncStatus('synced');
  };

  const authValue: AuthContextType = {
    isConfigured: false,
    isSignedIn: mockSignedIn,
    user: mockSignedIn ? mockUser : null,
    openSignIn,
    openSignUp,
    openUserProfile,
    signOut,
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    syncStatus,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
      {/* Demo Modal when Clerk key is absent */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                  FW
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {authModalMode === 'signin' ? 'Sign In to FixWise AI' : 'Create FixWise Account'}
                  </h3>
                  <span className="text-xs text-slate-500">Clerk Authentication Flow</span>
                </div>
              </div>
              <button
                onClick={() => setAuthModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl mb-4 text-xs text-amber-800 leading-relaxed">
              <strong>💡 Live Authentication Notice:</strong> Add your Clerk Publishable Key (<code>VITE_CLERK_PUBLISHABLE_KEY</code>) to <code>.env</code> to connect your live Clerk instance with Google OAuth. For this demo, you can sign in directly below!
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleMockSignIn('priya.sharma@example.com', 'Priya Sharma')}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-2 text-[10px] uppercase font-bold text-slate-400">or demo user</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <button
                onClick={() => handleMockSignIn('technician@techfixpro.in', 'Rajesh Kumar (Lead Tech)')}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Sign in as Technician / Workshop
              </button>

              <button
                onClick={() => handleMockSignIn('priya.sharma@example.com', 'Priya Sharma')}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Sign in as Consumer (Priya Sharma)
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (isClerkConfigured) {
    return (
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <ClerkAuthConsumer>{children}</ClerkAuthConsumer>
      </ClerkProvider>
    );
  }

  return <DemoFallbackAuthProvider>{children}</DemoFallbackAuthProvider>;
};

export function useFixWiseAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useFixWiseAuth must be used within an AuthProvider');
  }
  return context;
}
