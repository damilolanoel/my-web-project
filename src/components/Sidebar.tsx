import React from 'react';
import { ViewMode, UserRole, User } from '../types';
import {
  LayoutDashboard,
  Users,
  Wallet,
  ArrowDownToLine,
  CalendarClock,
  BarChart3,
  Settings,
  Shield,
  User,
  LogOut,
  X,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  role: UserRole;
  currentUser: User | null;
  onLogout: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const navItems: { view: ViewMode; label: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
  { view: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { view: 'participants', label: 'Participants', icon: <Users size={20} /> },
  { view: 'contributions', label: 'Contributions', icon: <Wallet size={20} /> },
  { view: 'payouts', label: 'Payouts', icon: <ArrowDownToLine size={20} /> },
  { view: 'schedule', label: 'Schedule', icon: <CalendarClock size={20} /> },
  { view: 'reports', label: 'Reports', icon: <BarChart3 size={20} />, adminOnly: true },
  { view: 'settings', label: 'Settings', icon: <Settings size={20} />, adminOnly: true },
  { view: 'help', label: 'Help & Support', icon: <HelpCircle size={20} /> },
];

export default function Sidebar({ currentView, setCurrentView, role, currentUser, onLogout, mobileOpen, setMobileOpen }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-slate-700/50 z-50 transition-transform duration-300 flex flex-col
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center text-lg font-bold text-slate-900">
                B
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">Bookey</h1>
                <p className="text-xs text-slate-400 -mt-0.5">Thrift Bank</p>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-slate-800 text-slate-400"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center text-sm font-bold text-slate-900">
              {role === 'admin' ? <Shield size={16} /> : <User size={16} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">
                {role === 'admin' ? 'Administrator' : 'User'}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {role === 'admin' ? 'Full Access' : 'View Only'}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-2">Menu</p>
          {navItems
            .filter(item => !item.adminOnly || role === 'admin')
            .map(item => (
              <button
                key={item.view}
                onClick={() => {
                  setCurrentView(item.view);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  currentView === item.view
                    ? 'bg-gradient-to-r from-primary-600/20 to-primary-500/10 text-primary-400 border border-primary-500/20'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <span className={currentView === item.view ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300'}>
                  {item.icon}
                </span>
                {item.label}
                {currentView === item.view && (
                  <ChevronRight size={14} className="ml-auto text-primary-500" />
                )}
              </button>
            ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center text-sm font-bold text-slate-900">
              {currentUser?.username?.charAt(0).toUpperCase() || (role === 'admin' ? 'A' : 'U')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {currentUser?.username || (role === 'admin' ? 'System Admin' : 'User')}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {role === 'admin' ? 'admin@bookey.ng' : `${currentUser?.username || 'user'}@bookey.ng`}
              </p>
            </div>
            <LogOut size={16} className="text-slate-500 hover:text-slate-300 cursor-pointer flex-shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
}
