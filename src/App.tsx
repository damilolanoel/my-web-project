import { useState } from 'react';
import { ViewMode, UserRole } from './types';
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

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [role, setRole] = useState<UserRole>('admin');
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderView = () => {
    // User role sees different dashboard
    if (role === 'user' && currentView === 'dashboard') {
      return <UserDashboard setCurrentView={setCurrentView} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard role={role} setCurrentView={setCurrentView} />;
      case 'participants':
        return <Participants role={role} />;
      case 'contributions':
        return <Contributions role={role} />;
      case 'payouts':
        return <Payouts role={role} />;
      case 'schedule':
        return <Schedule />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard role={role} setCurrentView={setCurrentView} />;
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
