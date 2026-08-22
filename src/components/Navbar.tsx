import React, { useState, useRef, useEffect } from 'react';
import { useApp, UserRole } from '../context/AppContext';
import { useFixWiseAuth } from '../context/AuthContext';
import {
  Wrench,
  RotateCcw,
  Sparkles,
  Bell,
  CheckCircle2,
  FileSearch,
  ChevronDown,
  LogIn,
  LogOut,
  Menu,
  X,
  History,
  Smartphone,
  Calculator,
  Leaf,
  LayoutDashboard,
  Store,
  Layers,
} from 'lucide-react';

interface NavbarProps {
  onOpenScanner: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenScanner }) => {
  const {
    activeTab,
    setActiveTab,
    currentRole,
    setCurrentRole,
    notifications,
    markNotificationsAsRead,
  } = useApp();

  const {
    isSignedIn,
    user,
    openSignIn,
    signOut,
    syncStatus,
  } = useFixWiseAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Primary desktop tabs
  const primaryTabs = [
    { id: 'home', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'diagnose', label: 'Diagnose' },
    { id: 'repairers', label: 'Repairers' },
    { id: 'quotes', label: 'Quotes' },
    { id: 'repairs', label: 'Track Repairs' },
    { id: 'devices', label: 'Passports' },
  ];

  if (currentRole === 'repairer') {
    primaryTabs.push({ id: 'repairer_portal', label: 'Lab Workbench' });
  } else if (currentRole === 'admin') {
    primaryTabs.push({ id: 'admin_portal', label: 'Admin Analytics' });
  }

  // Secondary tools in More dropdown
  const secondaryTabs = [
    { id: 'calculator', label: 'Calculator', icon: Calculator, desc: 'Repair vs Replace Economics' },
    { id: 'impact', label: 'Impact', icon: Leaf, desc: 'E-Waste & CO2 Avoided' },
    { id: 'history', label: 'History', icon: History, desc: 'Completed Repairs & Records' },
  ];

  const isSecondaryActive = secondaryTabs.some((t) => t.id === activeTab);

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    setRoleDropdownOpen(false);
    if (newRole === 'repairer') {
      setActiveTab('repairer_portal');
    } else if (newRole === 'admin') {
      setActiveTab('admin_portal');
    } else {
      setActiveTab('dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs w-full">
      <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-5">
        <div className="flex items-center justify-between h-16 sm:h-17 gap-2 lg:gap-3">
          
          {/* Left: Brand Logo & Desktop Navigation Links */}
          <div className="flex items-center gap-2 lg:gap-3 xl:gap-5 min-w-0">
            {/* Brand Logo & Tagline */}
            <div
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 cursor-pointer group shrink-0"
            >
              <div className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl bg-emerald-700 group-hover:bg-emerald-800 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 transition-transform group-hover:scale-105 shrink-0">
                <div className="relative flex items-center justify-center">
                  <RotateCcw className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-200" />
                  <Wrench className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white absolute" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-black tracking-tight text-slate-900 leading-tight font-['Plus_Jakarta_Sans',sans-serif]">
                  FixWise<span className="text-emerald-600">AI</span>
                </span>
                <span className="text-[9.5px] text-slate-400 font-medium tracking-tight hidden 2xl:block">
                  Repair smarter. Replace less.
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {primaryTabs.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => setActiveTab(link.id)}
                    className={`px-2 xl:px-2.5 py-1.5 rounded-lg text-[11.5px] xl:text-xs font-bold transition-all duration-150 whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 font-extrabold ring-1 ring-emerald-200/60 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-emerald-50/50'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}

              {/* Secondary More Dropdown (Shown on desktop for Consumer/User role) */}
              {currentRole === 'user' && (
                <div className="relative shrink-0" ref={moreRef}>
                  <button
                    onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                    className={`px-2 xl:px-2.5 py-1.5 rounded-lg text-[11.5px] xl:text-xs font-bold transition-all duration-150 flex items-center gap-1 whitespace-nowrap ${
                      isSecondaryActive
                        ? 'bg-emerald-50 text-emerald-800 font-extrabold ring-1 ring-emerald-200/60 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-emerald-50/50'
                    }`}
                  >
                    <span>
                      {isSecondaryActive
                        ? secondaryTabs.find((t) => t.id === activeTab)?.label || 'More'
                        : 'More'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {moreDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in duration-150">
                      <div className="text-[10px] uppercase font-bold text-slate-400 px-2.5 py-1">
                        Tools & Records
                      </div>
                      {secondaryTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isTabActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveTab(tab.id);
                              setMoreDropdownOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-start gap-2.5 transition-all duration-150 ${
                              isTabActive
                                ? 'bg-emerald-50 text-emerald-800 font-bold ring-1 ring-emerald-200/50'
                                : 'hover:bg-slate-50 hover:text-slate-900 text-slate-700'
                            }`}
                          >
                            <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isTabActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                            <div>
                              <p className="font-bold leading-tight">{tab.label}</p>
                              <p className="text-[10px] text-slate-400 leading-snug">{tab.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>

          {/* Right Controls & Auth */}
          <div className="flex items-center gap-1 sm:gap-1.5 xl:gap-2 shrink-0">
            {/* AI Quote Scanner Trigger */}
            <button
              onClick={onOpenScanner}
              className="h-8.5 sm:h-9 px-2 sm:px-2.5 xl:px-3 rounded-xl text-[11.5px] xl:text-xs font-bold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all duration-150 flex items-center gap-1.5 shadow-2xs hover:shadow-sm shrink-0"
              title="Scan Repair Quotation / Invoice with AI"
            >
              <FileSearch className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="hidden xl:inline">Scan Quote</span>
            </button>

            {/* Notifications Bell */}
            <div className="relative shrink-0" ref={notifRef}>
              <button
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  if (!notifDropdownOpen) markNotificationsAsRead();
                }}
                className="h-8.5 w-8.5 sm:h-9 sm:w-9 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 hover:border-slate-300 transition-all duration-150 relative flex items-center justify-center border border-slate-200/70 shrink-0"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-76 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    <span className="text-[10px] text-slate-400 font-medium">Real-time alerts</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (n.linkTab) setActiveTab(n.linkTab);
                          setNotifDropdownOpen(false);
                        }}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/70 hover:border-emerald-200 border border-transparent cursor-pointer transition-all duration-150 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{n.title}</span>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-snug">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Persona Switcher */}
            <div className="relative shrink-0" ref={roleRef}>
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="h-8.5 sm:h-9 px-2 sm:px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 hover:border-slate-300 text-slate-800 text-[11.5px] xl:text-xs font-bold flex items-center gap-1.5 transition-all duration-150 border border-slate-200 shrink-0"
                title="Switch persona for evaluation"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    currentRole === 'user' ? 'bg-emerald-500' : currentRole === 'repairer' ? 'bg-blue-500' : 'bg-purple-500'
                  }`}
                />
                <span className="capitalize hidden md:inline text-[11.5px] xl:text-xs font-bold">{currentRole}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in duration-150">
                  <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 block">
                    Switch Persona:
                  </span>
                  <button
                    onClick={() => handleRoleChange('user')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                      currentRole === 'user' ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>👤 Consumer / User</span>
                    {currentRole === 'user' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('repairer')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                      currentRole === 'repairer' ? 'bg-blue-50 text-blue-800' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>🛠️ Repair Workshop</span>
                    {currentRole === 'repairer' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                      currentRole === 'admin' ? 'bg-purple-50 text-purple-800' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>📊 Admin Analytics</span>
                    {currentRole === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* Clerk Authentication Controls */}
            {isSignedIn && user ? (
              <div className="relative shrink-0" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="h-8.5 sm:h-9 flex items-center gap-1.5 p-1 pl-1.5 pr-2 rounded-xl border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 shrink-0"
                >
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.fullName || 'User'}
                      className="w-5.5 h-5.5 rounded-full object-cover ring-1 ring-emerald-500 shrink-0"
                    />
                  ) : (
                    <div className="w-5.5 h-5.5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {user.fullName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="text-[11.5px] xl:text-xs font-bold text-slate-800 max-w-[70px] truncate hidden sm:inline">
                    {user.fullName?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in duration-150">
                    <div className="flex items-center gap-2.5 pb-2.5 mb-2 border-b border-slate-100">
                      {user.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt="avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                          {user.fullName?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {user.fullName || 'FixWise Member'}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {user.email || 'authenticated'}
                        </p>
                      </div>
                    </div>

                    <div className="mb-2 px-2 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-[10px] font-medium flex items-center justify-between">
                      <span>PostgreSQL DB Sync:</span>
                      <span className="font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        {syncStatus === 'synced' ? 'Active' : syncStatus}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('devices');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Passports & Devices</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('history');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                    >
                      <History className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Repair History</span>
                    </button>

                    <div className="pt-2 mt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          signOut();
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openSignIn}
                className="h-8.5 sm:h-9 px-2 sm:px-2.5 xl:px-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-[11.5px] xl:text-xs font-bold flex items-center gap-1.5 transition-all duration-150 shadow-2xs hover:shadow-xs shrink-0"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Primary Diagnose CTA */}
            <button
              onClick={() => setActiveTab('diagnose')}
              className="h-8.5 sm:h-9 px-2.5 sm:px-3 xl:px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-[11.5px] xl:text-xs font-bold transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-md shadow-emerald-700/20 flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>Diagnose</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-8.5 w-8.5 sm:h-9 sm:w-9 rounded-xl text-slate-700 hover:bg-slate-100 hover:border-slate-300 flex items-center justify-center shrink-0 border border-slate-200/80 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-1.5 max-h-[80vh] overflow-y-auto shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1">
            Primary Navigation
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {primaryTabs.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between min-h-[44px] ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/60 font-extrabold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              );
            })}
          </div>

          <div className="text-[10px] uppercase font-bold text-slate-400 px-3 pt-3 pb-1 border-t border-slate-100 mt-2">
            Tools & Records
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {secondaryTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 min-h-[44px] ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/60 font-extrabold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                  <div className="min-w-0">
                    <span className="block truncate">{tab.label}</span>
                    <span className="text-[10px] text-slate-400 font-normal block truncate">{tab.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
