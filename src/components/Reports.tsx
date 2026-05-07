import { useMemo } from 'react';
import {
  participants,
  generateContributions,
  generatePayouts,
  generateMonthData,
  formatCurrency,
  getCurrentMonth,
} from '../data';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Download,
  FileText,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export default function Reports() {
  const contributions = useMemo(() => generateContributions(), []);
  const payouts = useMemo(() => generatePayouts(), []);
  const monthData = useMemo(() => generateMonthData(), []);
  const currentMonth = getCurrentMonth();

  // Per-member contribution data
  const memberData = participants.map(p => {
    const contribs = contributions.filter(c => c.participantId === p.id && c.status === 'paid');
    const totalPaid = contribs.reduce((sum, c) => sum + c.totalPaid, 0);
    const payout = payouts.find(py => py.participantId === p.id);
    return {
      name: p.name.split(' ')[0],
      contributed: totalPaid,
      received: payout?.status === 'paid' ? payout.amount : 0,
    };
  });

  // Monthly flow data
  const flowData = monthData.map(m => ({
    name: m.label.split(' ')[0].substring(0, 3),
    inflow: m.status !== 'upcoming' ? m.totalCollected : 0,
    outflow: m.status === 'completed' ? m.payoutAmount : 0,
    opCharge: m.status !== 'upcoming' ? m.operationalCharge : 0,
  }));

  // Status distribution
  const allContribs = contributions.filter(c => c.month <= Math.max(currentMonth, 1));
  const statusData = [
    { name: 'Paid', value: allContribs.filter(c => c.status === 'paid').length, color: '#22c55e' },
    { name: 'Pending', value: allContribs.filter(c => c.status === 'pending').length, color: '#f97316' },
    { name: 'Overdue', value: allContribs.filter(c => c.status === 'overdue').length, color: '#ef4444' },
  ].filter(d => d.value > 0);

  // Compliance rate per month
  const complianceData = monthData
    .filter(m => m.status !== 'upcoming')
    .map(m => {
      const monthContribs = contributions.filter(c => c.month === m.month);
      const paid = monthContribs.filter(c => c.status === 'paid').length;
      return {
        name: m.label.split(' ')[0].substring(0, 3),
        rate: (paid / 10) * 100,
      };
    });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">Financial Reports</h3>
          <p className="text-sm text-slate-400">Comprehensive analytics and reporting</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700/50 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors">
            <FileText size={14} />
            Generate Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-500 transition-colors">
            <Download size={14} />
            Export All
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Collection Rate', value: `${Math.round((allContribs.filter(c => c.status === 'paid').length / Math.max(allContribs.length, 1)) * 100)}%`, color: 'text-primary-400' },
          { label: 'Months Completed', value: `${monthData.filter(m => m.status === 'completed').length}/10`, color: 'text-gold-400' },
          { label: 'Active Defaults', value: allContribs.filter(c => c.status === 'overdue').length.toString(), color: 'text-red-400' },
          { label: 'Op. Revenue', value: formatCurrency(80000), color: 'text-accent-400' },
        ].map((metric, i) => (
          <div key={i} className="glass-card rounded-2xl p-4 border border-slate-700/30 text-center">
            <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
            <p className="text-xs text-slate-400 mt-1">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Member Contributions */}
        <div className="glass-card rounded-2xl p-6 border border-slate-700/30">
          <h4 className="text-white font-semibold mb-4">Member Contributions vs Payouts</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '12px', color: '#f8fafc' }}
                  formatter={(value: any) => [formatCurrency(Number(value)), '']}
                />
                <Bar dataKey="contributed" fill="#22c55e" radius={[4, 4, 0, 0]} name="Contributed" />
                <Bar dataKey="received" fill="#eab308" radius={[4, 4, 0, 0]} name="Received" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cash Flow */}
        <div className="glass-card rounded-2xl p-6 border border-slate-700/30">
          <h4 className="text-white font-semibold mb-4">Monthly Cash Flow</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={flowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={(v) => `₦${(v / 1000000).toFixed(1)}M`} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '12px', color: '#f8fafc' }}
                  formatter={(value: any) => [formatCurrency(Number(value)), '']}
                />
                <Line type="monotone" dataKey="inflow" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} name="Inflow" />
                <Line type="monotone" dataKey="outflow" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} name="Outflow" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Payment Status Distribution */}
        <div className="glass-card rounded-2xl p-6 border border-slate-700/30">
          <h4 className="text-white font-semibold mb-4">Payment Status</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '12px', color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {statusData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-xs text-slate-400">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Rate */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-700/30">
          <h4 className="text-white font-semibold mb-4">Monthly Compliance Rate</h4>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '12px', color: '#f8fafc' }}
                  formatter={(value: any) => [`${Number(value).toFixed(0)}%`, 'Compliance']}
                />
                <Bar dataKey="rate" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="glass-card rounded-2xl p-6 border border-slate-700/30">
        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
          <AlertCircle size={18} className="text-accent-400" />
          Compliance Alerts
        </h4>
        <div className="space-y-2">
          {contributions
            .filter(c => c.month === currentMonth && c.status === 'pending')
            .map(c => {
              const p = participants.find(p => p.id === c.participantId)!;
              return (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-accent-500/5 border border-accent-500/10">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{p.avatar}</span>
                    <div>
                      <p className="text-sm text-white font-medium">{p.name}</p>
                      <p className="text-xs text-slate-400">Month {c.month} contribution pending</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-accent-400">{formatCurrency(c.totalPaid)}</span>
                    <button className="px-3 py-1 rounded-lg bg-accent-500/20 text-accent-400 text-xs font-medium border border-accent-500/20">
                      Send Reminder
                    </button>
                  </div>
                </div>
              );
            })}
          {contributions.filter(c => c.month === currentMonth && c.status === 'pending').length === 0 && (
            <div className="text-center py-8">
              <TrendingUp size={32} className="text-primary-400 mx-auto mb-2" />
              <p className="text-sm text-slate-400">All contributions for the current month are on track!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
