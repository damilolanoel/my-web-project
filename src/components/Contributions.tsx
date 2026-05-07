import React, { useState, useMemo } from 'react';
import { UserRole, Contribution } from '../types';
import {
  participants,
  generateMonthData,
  formatCurrency,
  formatDate,
  getCurrentMonth,
} from '../data';
import {
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  ChevronDown,
  Wallet,
  TrendingUp,
} from 'lucide-react';

interface ContributionsProps {
  role: UserRole;
  contributions: Contribution[];
  setContributions: React.Dispatch<React.SetStateAction<Contribution[]>>;
}

export default function Contributions({ role, contributions, setContributions }: ContributionsProps) {
  const [filterMonth, setFilterMonth] = useState<number>(getCurrentMonth() || 1);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const monthData = useMemo(() => generateMonthData(), []);

  const handleTogglePaid = (id: string) => {
    setContributions(prev => prev.map(c => {
      if (c.id !== id) return c;
      return {
        ...c,
        status: c.status === 'paid' ? 'pending' : 'paid',
      };
    }));
  };

  const filtered = contributions.filter(c => {
    if (c.month !== filterMonth) return false;
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    return true;
  });

  const currentMonthData = monthData[filterMonth - 1];
  const totalCollected = filtered
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.totalPaid, 0);
  const paidCount = filtered.filter(c => c.status === 'paid').length;
  const pendingCount = filtered.filter(c => c.status === 'pending').length;

  const statusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle2 size={14} className="text-primary-400" />;
      case 'pending': return <Clock size={14} className="text-accent-400" />;
      case 'overdue': return <AlertTriangle size={14} className="text-red-400" />;
      default: return null;
    }
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: 'bg-primary-500/20 text-primary-400 border-primary-500/30',
      pending: 'bg-accent-500/20 text-accent-400 border-accent-500/30',
      overdue: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${styles[status]}`}>
        {statusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-primary-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-500/10">
              <Wallet size={20} className="text-primary-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Total Collected</p>
              <p className="text-lg font-bold text-white">{formatCurrency(totalCollected)}</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-700/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-500/10">
              <CheckCircle2 size={20} className="text-primary-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Paid</p>
              <p className="text-lg font-bold text-white">{paidCount}/10</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-700/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent-500/10">
              <Clock size={20} className="text-accent-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Pending</p>
              <p className="text-lg font-bold text-white">{pendingCount}</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-700/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gold-500/10">
              <TrendingUp size={20} className="text-gold-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Op. Charge</p>
              <p className="text-lg font-bold text-white">{formatCurrency(currentMonthData?.operationalCharge || 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative">
          <select
            value={filterMonth}
            onChange={e => setFilterMonth(Number(e.target.value))}
            className="appearance-none bg-slate-800/80 border border-slate-700/50 rounded-xl px-4 py-2.5 pr-10 text-sm text-white outline-none focus:border-primary-500/50 cursor-pointer"
          >
            {monthData.map(m => (
              <option key={m.month} value={m.month}>{m.label} (Month {m.month})</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="appearance-none bg-slate-800/80 border border-slate-700/50 rounded-xl px-4 py-2.5 pr-10 text-sm text-white outline-none focus:border-primary-500/50 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
          <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>

        {role === 'admin' && (
          <button className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-colors">
            <Download size={14} />
            Export CSV
          </button>
        )}
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl border border-slate-700/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left text-xs text-slate-400 font-semibold uppercase tracking-wider px-6 py-4">Participant</th>
                <th className="text-left text-xs text-slate-400 font-semibold uppercase tracking-wider px-6 py-4">Contribution</th>
                <th className="text-left text-xs text-slate-400 font-semibold uppercase tracking-wider px-6 py-4">Op. Charge</th>
                <th className="text-left text-xs text-slate-400 font-semibold uppercase tracking-wider px-6 py-4">Total</th>
                <th className="text-left text-xs text-slate-400 font-semibold uppercase tracking-wider px-6 py-4">Due Date</th>
                <th className="text-left text-xs text-slate-400 font-semibold uppercase tracking-wider px-6 py-4">Status</th>
                {role === 'admin' && (
                  <th className="text-left text-xs text-slate-400 font-semibold uppercase tracking-wider px-6 py-4">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const p = participants.find(p => p.id === c.participantId)!;
                return (
                  <tr
                    key={c.id}
                    className="border-b border-slate-700/20 hover:bg-slate-800/30 transition-colors"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{p.avatar}</span>
                        <div>
                          <p className="text-sm font-medium text-white">{p.name}</p>
                          <p className="text-xs text-slate-500">User {p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-medium">{formatCurrency(c.amount)}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {c.operationalCharge > 0 ? (
                        <span className="text-accent-400">{formatCurrency(c.operationalCharge)}</span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-semibold">{formatCurrency(c.totalPaid)}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{formatDate(c.date)}</td>
                    <td className="px-6 py-4">{statusBadge(c.status)}</td>
                    {role === 'admin' && (
                      <td className="px-6 py-4">
                        {c.status !== 'paid' ? (
                          <button
                            onClick={() => handleTogglePaid(c.id)}
                            className="px-3 py-1.5 rounded-lg bg-primary-600/20 text-primary-400 text-xs font-medium hover:bg-primary-600/30 transition-colors border border-primary-500/20"
                          >
                            Mark Paid
                          </button>
                        ) : (
                          <button
                            onClick={() => handleTogglePaid(c.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-700/20 text-slate-300 text-xs font-medium hover:bg-slate-700/30 transition-colors border border-slate-600/30"
                          >
                            Mark Unpaid
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-700/30 bg-slate-800/20">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Showing {filtered.length} contributions for {currentMonthData?.label}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">
                Expected: <span className="text-white font-semibold">{formatCurrency(currentMonthData?.totalCollected || 0)}</span>
              </span>
              <span className="text-sm text-slate-400">
                Collected: <span className="text-primary-400 font-semibold">{formatCurrency(totalCollected)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
