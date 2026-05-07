import { useEffect, useState } from 'react';
import { ViewMode, UserRole, Contribution, Payout } from './types';
import { generateContributions, generatePayouts } from './data';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import UserDashboard from './components/UserDashboard';
import Participants from './components/Participants';
import Contributions from './components/Contributions';
import Payouts from './components/Payouts';
import Schedule from './components/Schedule';
import Reports from './components/Reports';
import Settings from './components/Settings';

const CONTRIBUTIONS_STORAGE_KEY = 'bookey-contributions';
const PAYOUTS_STORAGE_KEY = 'bookey-payouts';

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [role, setRole] = useState<UserRole>('admin');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contributions, setContributions] = useState<Contribution[]>(() =>
    loadFromStorage(CONTRIBUTIONS_STORAGE_KEY, generateContributions())
  );
  const [payouts, setPayouts] = useState<Payout[]>(() =>
    loadFromStorage(PAYOUTS_STORAGE_KEY, generatePayouts())
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(CONTRIBUTIONS_STORAGE_KEY, JSON.stringify(contributions));
  }, [contributions]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(PAYOUTS_STORAGE_KEY, JSON.stringify(payouts));
  }, [payouts]);

  const handleResetData = () => {
    if (typeof window === 'undefined') return;
    const confirmed = window.confirm('Reset all saved thrift data and return to defaults? This cannot be undone.');
    if (!confirmed) return;

    const initialContributions = generateContributions();
    const initialPayouts = generatePayouts();
    setContributions(initialContributions);
    setPayouts(initialPayouts);
    window.localStorage.removeItem(CONTRIBUTIONS_STORAGE_KEY);
    window.localStorage.removeItem(PAYOUTS_STORAGE_KEY);
  };

  const renderView = () => {
    // User role sees different dashboard
    if (role === 'user' && currentView === 'dashboard') {
      return <UserDashboard setCurrentView={setCurrentView} contributions={contributions} payouts={payouts} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard role={role} setCurrentView={setCurrentView} contributions={contributions} payouts={payouts} />;
      case 'participants':
        return <Participants role={role} contributions={contributions} payouts={payouts} />;
      case 'contributions':
        return <Contributions role={role} contributions={contributions} setContributions={setContributions} />;
      case 'payouts':
        return <Payouts role={role} payouts={payouts} setPayouts={setPayouts} />;
      case 'schedule':
        return <Schedule />;
      case 'reports':
        return <Reports contributions={contributions} payouts={payouts} />;
      case 'settings':
        return <Settings onResetData={handleResetData} />;
      default:
        return <Dashboard role={role} setCurrentView={setCurrentView} contributions={contributions} payouts={payouts} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent-500/3 rounded-full blur-3xl" />
      </div>

      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        role={role}
        setRole={setRole}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen relative">
        <Header
          currentView={currentView}
          role={role}
          setMobileOpen={setMobileOpen}
        />
        <div className="p-4 lg:p-8">
          {renderView()}
        </div>

        {/* Footer */}
        <footer className="px-4 lg:px-8 py-6 border-t border-slate-800/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center text-sm font-bold text-slate-900">
                B
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-300">Bookey Thrift Bank</p>
                <p className="text-xs text-slate-500">Contribution Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <p className="text-xs text-slate-500">Cycle: May 2026 – Feb 2027</p>
              <p className="text-xs text-slate-500">10 Members • ₦1,000,000/month</p>
            </div>
            <p className="text-xs text-slate-600">© 2026 Bookey Thrift Bank. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
