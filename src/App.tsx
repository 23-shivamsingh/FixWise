import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CopilotModal } from './components/CopilotModal';
import { QuoteScannerModal } from './components/QuoteScannerModal';
import { AuthModal } from './components/AuthModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { DiagnosePage } from './pages/DiagnosePage';
import { RepairersPage } from './pages/RepairersPage';
import { QuotesPage } from './pages/QuotesPage';
import { RepairsPage } from './pages/RepairsPage';
import { DevicesPage } from './pages/DevicesPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { ImpactPage } from './pages/ImpactPage';
import { HistoryPage } from './pages/HistoryPage';
import { RepairerPortalPage } from './pages/RepairerPortalPage';
import { AdminPage } from './pages/AdminPage';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();
  const [scannerOpen, setScannerOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <LandingPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'diagnose':
        return <DiagnosePage />;
      case 'repairers':
        return <RepairersPage />;
      case 'quotes':
        return <QuotesPage onOpenScanner={() => setScannerOpen(true)} />;
      case 'repairs':
        return <RepairsPage />;
      case 'devices':
        return <DevicesPage />;
      case 'calculator':
        return <CalculatorPage />;
      case 'impact':
        return <ImpactPage />;
      case 'history':
        return <HistoryPage />;
      case 'repairer_portal':
        return <RepairerPortalPage />;
      case 'admin_portal':
        return <AdminPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-['Inter',sans-serif] w-full max-w-full overflow-x-clip">
      {/* Navigation Header */}
      <Navbar onOpenScanner={() => setScannerOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {renderActivePage()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Clerk Authentication Modal */}
      <AuthModal />

      {/* AI Quote Fairness Scanner Modal */}
      <QuoteScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
      />

      {/* Context-Aware Floating FixWise AI Copilot */}
      <CopilotModal />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
