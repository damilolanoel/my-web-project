import { useMemo } from 'react';
import { UserRole } from '../types';
import {
  participants,
  generateContributions,
  generatePayouts,
  generateMonthData,
  formatCurrency,
  getCurrentMonth,
} from '../data';
import {
  Users,
  Wallet,
  ArrowDownToLine,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  CalendarClock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

interface DashboardProps {
  role: UserRole;
  setCurrentView: (view: any) => void;
}

export default function Dashboard({ role, setCurrentView }: DashboardProps) {
  const currentMonth = getCurrentMonth();
  const contributions = useMemo(() => generateContributions(), []);
  const payouts = useMemo(() => generatePayouts(), []);
  const monthData = useMemo(() => generateMonthData(), []);

  const totalContributed = contributions
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.totalPaid, 0);

  const totalPayouts = payouts
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingContributions = contributions.filter(
    c => c.month === currentMonth && c.status === 'pending'
  ).length;

  const paidContributions = contributions.filter(
    c => c.month === currentMonth && c.status === 'paid'
  ).length;

  const currentRecipient = participants.find(
    p => p.position === currentMonth
  );

  const nextRecipient = participants.find(
    p => p.position === currentMonth + 1
  );

  const chartData = monthData.map(m => ({
    name: m.label.split(' ')[0].substring(0, 3),
    collected: m.status === 'completed' ? m.totalCollected : m.status === 'active' ? m.totalCollected * 0.7 : 0,
    payout: m.status === 'completed' ? m.payoutAmount : 0,
    opCharge: m.operationalCharge,
  }));

  const pieData = [
    { name: 'Paid', value: paidContributions, color: '#22c55e' },
    { name: 'Pending', value: pendingContributions, color: '#f97316' },
    { name: 'Upcoming', value: Math.max(0, 10 - paidContributions - pendingContributions), color: '#475569' },
  ].filter(d => d.value > 0);

  const cumulativeData = monthData.map((m, i) => ({
    name: m.label.split(' ')[0].substring(0, 3),
    total: monthData
      .slice(0, i + 1)
      .filter(md => md.status === 'completed')
      .reduce((sum, md) => sum + md.totalCollected, 0),
  }));

  const stats = [
    {
      label: 'Total Contributed',
      value: formatCurrency(totalContributed),
      icon: <Wallet size={22} />,
      color: 'from-primary-500 to-emerald-600',
      bgColor: 'from-primary-500/10 to-emerald-600/10',
      borderColor: 'border-primary-500/20',
    },
    {
      label: 'Total Payouts',
      value: formatCurrency(totalPayouts),
      icon: <ArrowDownToLine size={22} />,
      color: 'from-gold-500 to-amber-600',
      bgColor: 'from-gold-500/10 to-amber-600/10',
      borderColor: 'border-gold-500/20',
    },
    {
      label: 'Active Members',
      value: '10',
      icon: <Users size={22} />,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-500/10 to-indigo-600/10',
      borderColor: 'border-blue-500/20',
    },
    {
      label: 'Current Month',
      value: currentMonth > 0 && currentMonth <= 10 ? `Month ${currentMonth}` : 'Not Started',
      icon: <Calendar size={22} />,
      color: 'from-accent-500 to-red-600',
      bgColor: 'from-accent-500/10 to-red-600/10',
      borderColor: 'border-accent-500/20',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`glass-card rounded-2xl p-5 border ${stat.borderColor} hover:scale-[1.02] transition-transform cursor-pointer`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.bgColor}`}>
                <span className={`bg-gradient-to-br ${stat.color} bg-clip-text`}>
                  {stat.icon}
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-primary-400">
              <TrendingUp size={12} />
              <span>On track</span>
            </div>
          </div>
        ))}
      </div>

      {/* Current Month Status + Recipient */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Current Month Card */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-700/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Current Month Progress</h3>
            <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-xs font-semibold">
              {currentMonth > 0 && currentMonth <= 10
                ? monthData[currentMonth - 1]?.label
                : 'Cycle Not Started'}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Contributions Received</span>
              <span className="text-white font-semibold">{paidContributions}/10</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-gold-500 rounded-full transition-all duration-1000"
                style={{ width: `${(paidContributions / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* Mini participant status */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {participants.map(p => {
              const contrib = contributions.find(
                c => c.participantId === p.id && c.month === currentMonth
              );
              const isPaid = contrib?.status === 'paid';
              const isPending = contrib?.status === 'pending';

              return (
                <div
                  key={p.id}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                    isPaid
                      ? 'bg-primary-500/10 border border-primary-500/30'
                      : isPending
                      ? 'bg-accent-500/10 border border-accent-500/30'
                      : 'bg-slate-800/50 border border-slate-700/30'
                  }`}
                >
                  <span className="text-lg">{p.avatar}</span>
                  <span className="text-[10px] font-medium text-slate-300">{p.id}</span>
                  {isPaid && <CheckCircle2 size={12} className="text-primary-400" />}
                  {isPending && <Clock size={12} className="text-accent-400" />}
                  {!isPaid && !isPending && <AlertCircle size={12} className="text-slate-600" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recipient Card */}
        <div className="glass-card rounded-2xl p-6 border border-gold-500/20 bg-gradient-to-br from-gold-500/5 to-transparent">
          <h3 className="text-lg font-bold text-white mb-4">Monthly Payout</h3>
          
          {currentRecipient ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-gold-500 to-accent-500 flex items-center justify-center text-3xl mb-3">
                {currentRecipient.avatar}
              </div>
              <p className="text-white font-bold text-lg">{currentRecipient.name}</p>
              <p className="text-slate-400 text-sm">Position #{currentRecipient.position}</p>
              <div className="mt-4 p-3 rounded-xl bg-gold-500/10 border border-gold-500/20">
                <p className="text-xs text-gold-400 mb-1">Payout Amount</p>
                <p className="text-2xl font-bold text-gold-400">{formatCurrency(1000000)}</p>
              </div>
              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-slate-400">
                <Calendar size={12} />
                <span>Due: {monthData[currentMonth - 1]?.endDate || 'TBD'}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-slate-400">Cycle not started yet</p>
              <p className="text-xs text-slate-500 mt-1">Starts May 2026</p>
            </div>
          )}

          {nextRecipient && (
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <p className="text-xs text-slate-500 mb-2">Next Month</p>
              <div className="flex items-center gap-3">
                <span className="text-xl">{nextRecipient.avatar}</span>
                <div>
                  <p className="text-sm text-white font-medium">{nextRecipient.name}</p>
                  <p className="text-xs text-slate-400">Position #{nextRecipient.position}</p>
                </div>
                <ArrowRight size={14} className="ml-auto text-slate-500" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-700/30">
          <h3 className="text-lg font-bold text-white mb-4">Monthly Collections & Payouts</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '12px', color: '#f8fafc' }}
                  formatter={(value: any) => [formatCurrency(Number(value)), '']}
                />
                <Bar dataKey="collected" fill="#22c55e" radius={[6, 6, 0, 0]} name="Collected" />
                <Bar dataKey="payout" fill="#eab308" radius={[6, 6, 0, 0]} name="Payout" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass-card rounded-2xl p-6 border border-slate-700/30">
          <h3 className="text-lg font-bold text-white mb-4">Payment Status</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '12px', color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-xs text-slate-400">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cumulative Chart */}
      {role === 'admin' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-700/30">
          <h3 className="text-lg font-bold text-white mb-4">Cumulative Collections</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumulativeData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `₦${(v / 1000000).toFixed(1)}M`} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '12px', color: '#f8fafc' }}
                  formatter={(value: any) => [formatCurrency(Number(value)), 'Cumulative']}
                />
                <Area type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={2} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setCurrentView('contributions')}
          className="glass-card rounded-2xl p-5 border border-slate-700/30 hover:border-primary-500/30 transition-all text-left group"
        >
          <Wallet size={24} className="text-primary-400 mb-3" />
          <h4 className="text-white font-semibold">View Contributions</h4>
          <p className="text-xs text-slate-400 mt-1">Track all member payments</p>
          <ArrowRight size={14} className="text-slate-500 group-hover:text-primary-400 mt-3 transition-colors" />
        </button>
        <button
          onClick={() => setCurrentView('payouts')}
          className="glass-card rounded-2xl p-5 border border-slate-700/30 hover:border-gold-500/30 transition-all text-left group"
        >
          <ArrowDownToLine size={24} className="text-gold-400 mb-3" />
          <h4 className="text-white font-semibold">View Payouts</h4>
          <p className="text-xs text-slate-400 mt-1">Monitor payout schedule</p>
          <ArrowRight size={14} className="text-slate-500 group-hover:text-gold-400 mt-3 transition-colors" />
        </button>
        <button
          onClick={() => setCurrentView('schedule')}
          className="glass-card rounded-2xl p-5 border border-slate-700/30 hover:border-accent-500/30 transition-all text-left group"
        >
          <CalendarClock size={24} className="text-accent-400 mb-3" />
          <h4 className="text-white font-semibold">Payment Schedule</h4>
          <p className="text-xs text-slate-400 mt-1">View full rotation timeline</p>
          <ArrowRight size={14} className="text-slate-500 group-hover:text-accent-400 mt-3 transition-colors" />
        </button>
      </div>
    </div>
  );
}
