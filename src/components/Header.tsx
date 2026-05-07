import type {} from 'react';
import { useState } from 'react';
import { ViewMode, UserRole } from '../types';
import { useNotifications } from '../contexts/NotificationContext';
import { Menu, Bell, Search } from 'lucide-react';
import NotificationPanel from './NotificationPanel';

interface HeaderProps {
  currentView: ViewMode;
  role: UserRole;
  setMobileOpen: (open: boolean) => void;
}

const viewTitles: Record<ViewMode, string> = {
  dashboard: 'Dashboard Overview',
  participants: 'Participants Management',
  contributions: 'Contribution Tracking',
  payouts: 'Payout Management',
  schedule: 'Payment Schedule',
  reports: 'Reports & Analytics',
  settings: 'System Settings',
  help: 'Help & Support',
};

export default function Header({ currentView, role, setMobileOpen }: HeaderProps) {
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white">{viewTitles[currentView]}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {role === 'admin' ? 'Administrative View' : 'Member View'} • Bookey Thrift Bank
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 rounded-xl px-3 py-2 border border-slate-700/50">
            <Search size={16} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-slate-300 placeholder:text-slate-500 outline-none w-40"
            />
          </div>

          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 text-slate-400 hover:text-white transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Current cycle badge */}
          <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-primary-600/20 to-primary-500/10 border border-primary-500/30 rounded-xl px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
            <span className="text-xs font-semibold text-primary-400">Cycle Active</span>
          </div>
        </div>
      </div>

      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </header>
  );
}
