import { useMemo } from 'react';
import { Contribution, Payout } from '../types';
import {
  participants,
  generateMonthData,
  formatCurrency,
  formatDate,
  getCurrentMonth,
} from '../data';
import {
  Wallet,
  ArrowDownToLine,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Crown,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface UserDashboardProps {
  setCurrentView: (view: any) => void;
  contributions: Contribution[];
  payouts: Payout[];
}

export default function UserDashboard({ setCurrentView, contributions, payouts }: UserDashboardProps) {
  // Simulating logged-in user as User A (position 1)
  const user = participants[0];
  const currentMonth = getCurrentMonth();
  const monthData = useMemo(() => generateMonthData(), []);

  const myContributions = contributions.filter(c => c.participantId === user.id);
  const myPayout = payouts.find(p => p.participantId === user.id)!;
  const totalPaid = myContributions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.totalPaid, 0);
  const remaining = 1008000 - totalPaid;

  const isMyPayoutMonth = user.position === currentMonth;

  const chartData = myContributions.map(c => ({
    name: monthData[c.month - 1]?.label.split(' ')[0].substring(0, 3) || `M${c.month}`,
    amount: c.status === 'paid' ? c.totalPaid : 0,
    cumulative: myContributions
      .filter(cc => cc.month <= c.month && cc.status === 'paid')
      .reduce((sum, cc) => sum + cc.totalPaid, 0),
  }));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="glass-card rounded-2xl p-6 border border-primary-500/20 bg-gradient-to-r from-primary-500/5 via-gold-500/5 to-accent-500/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center text-3xl">
              {user.avatar}
            </div>
            <div>
              <p className="text-xs text-slate-400">Welcome back</p>
              <h3 className="text-xl font-bold text-white">{user.name}</h3>
              <p className="text-sm text-slate-400">Position #{user.position} • User {user.id}</p>
            </div>
          </div>
          {isMyPayoutMonth && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500/20 border border-gold-500/30 animate-pulse-glow">
              <Crown size={16} className="text-gold-400" />
              <span className="text-sm font-bold text-gold-400">It's Your Payout Month! 🎉</span>
            </div>
          )}
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-primary-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary-500/10">
              <Wallet size={20} className="text-primary-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Total Paid</p>
              <p className="text-xl font-bold text-white">{formatCurrency(totalPaid)}</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-700/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent-500/10">
              <TrendingUp size={20} className="text-accent-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Remaining</p>
              <p className="text-xl font-bold text-white">{formatCurrency(Math.max(remaining, 0))}</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-gold-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gold-500/10">
              <ArrowDownToLine size={20} className="text-gold-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">My Payout</p>
              <p className="text-xl font-bold text-gold-400">{formatCurrency(1000000)}</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-700/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10">
              <Calendar size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Payout Month</p>
              <p className="text-xl font-bold text-white">Month {user.position}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Contribution Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-700/30">
          <h4 className="text-white font-semibold mb-4">My Contribution Progress</h4>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCumUser" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '12px', color: '#f8fafc' }}
                  formatter={(value: any) => [formatCurrency(Number(value)), '']}
                />
                <Area type="monotone" dataKey="cumulative" stroke="#22c55e" strokeWidth={2} fill="url(#colorCumUser)" name="Cumulative" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payout Card */}
        <div className="glass-card rounded-2xl p-6 border border-gold-500/20 bg-gradient-to-br from-gold-500/5 to-transparent">
          <h4 className="text-white font-semibold mb-4">My Payout Details</h4>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-gold-500 to-accent-500 flex items-center justify-center text-3xl">
              💰
            </div>
            <div>
              <p className="text-3xl font-bold text-gold-400">{formatCurrency(1000000)}</p>
              <p className="text-sm text-slate-400 mt-1">
                Month {user.position} • {monthData[user.position - 1]?.label}
              </p>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${
              myPayout.status === 'paid'
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                : 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
            }`}>
              {myPayout.status === 'paid' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
              <span className="text-sm font-semibold">
                {myPayout.status === 'paid' ? 'Received' : 'Scheduled'}
              </span>
            </div>
            <p className="text-xs text-slate-400">Due: {formatDate(myPayout.date)}</p>
          </div>
        </div>
      </div>

      {/* My Contribution History */}
      <div className="glass-card rounded-2xl border border-slate-700/30 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/30 flex items-center justify-between">
          <h4 className="text-white font-semibold">My Contribution History</h4>
          <button
            onClick={() => setCurrentView('contributions')}
            className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
          >
            View All <ArrowRight size={12} />
          </button>
        </div>
        <div className="divide-y divide-slate-700/20">
          {myContributions.map(c => {
            const month = monthData[c.month - 1];
            return (
              <div key={c.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    c.status === 'paid'
                      ? 'bg-primary-500/10'
                      : c.status === 'pending'
                      ? 'bg-accent-500/10'
                      : 'bg-slate-800'
                  }`}>
                    {c.status === 'paid' ? (
                      <CheckCircle2 size={18} className="text-primary-400" />
                    ) : c.status === 'pending' ? (
                      <Clock size={18} className="text-accent-400" />
                    ) : (
                      <AlertCircle size={18} className="text-slate-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{month?.label || `Month ${c.month}`}</p>
                    <p className="text-xs text-slate-400">
                      {c.operationalCharge > 0
                        ? `₦100,000 + ₦8,000 operational charge`
                        : '₦100,000 contribution'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{formatCurrency(c.totalPaid)}</p>
                  <span className={`text-xs font-medium ${
                    c.status === 'paid' ? 'text-primary-400' :
                    c.status === 'pending' ? 'text-accent-400' : 'text-slate-500'
                  }`}>
                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="px-6 py-4 border-t border-slate-700/30 bg-slate-800/20">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Total over 10 months</span>
            <span className="text-lg font-bold text-white">{formatCurrency(1008000)}</span>
          </div>
        </div>
      </div>

      {/* Group Rotation */}
      <div className="glass-card rounded-2xl p-6 border border-slate-700/30">
        <h4 className="text-white font-semibold mb-4">Rotation Schedule</h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {participants.map(p => {
            const isMe = p.id === user.id;
            const isPast = p.position < currentMonth;
            const isCurrent = p.position === currentMonth;

            return (
              <div
                key={p.id}
                className={`p-3 rounded-xl text-center transition-all ${
                  isMe
                    ? 'bg-gradient-to-br from-primary-500/20 to-gold-500/10 border-2 border-primary-500/50'
                    : isCurrent
                    ? 'bg-gold-500/10 border border-gold-500/30'
                    : isPast
                    ? 'bg-primary-500/5 border border-primary-500/10'
                    : 'bg-slate-800/30 border border-slate-700/20'
                }`}
              >
                <span className="text-2xl">{p.avatar}</span>
                <p className="text-xs text-white font-medium mt-1">{p.name.split(' ')[0]}</p>
                <p className="text-[10px] text-slate-400">Month {p.position}</p>
                {isPast && <CheckCircle2 size={12} className="text-primary-400 mx-auto mt-1" />}
                {isCurrent && <Clock size={12} className="text-gold-400 mx-auto mt-1 animate-pulse" />}
                {isMe && <span className="text-[10px] text-primary-400 font-bold">YOU</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
