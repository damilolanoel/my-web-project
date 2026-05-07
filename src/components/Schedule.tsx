import { useMemo } from 'react';
import {
  participants,
  generateMonthData,
  formatCurrency,
  formatDate,
  getCurrentMonth,
} from '../data';
import {
  CheckCircle2,
  Clock,
  CalendarDays,
  ArrowRight,
  Info,
} from 'lucide-react';

export default function Schedule() {
  const monthData = useMemo(() => generateMonthData(), []);
  const currentMonth = getCurrentMonth();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Info Banner */}
      <div className="glass-card rounded-2xl p-5 border border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-indigo-500/5">
        <div className="flex items-start gap-3">
          <Info size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-semibold">Payment Schedule Overview</p>
            <p className="text-sm text-slate-400 mt-1">
              The contribution cycle runs from <span className="text-white">May 2026</span> to <span className="text-white">February 2027</span>.
              Each participant contributes <span className="text-primary-400">₦108,000</span> in Month 1 (includes ₦8,000 operational charge)
              and <span className="text-primary-400">₦100,000</span> in subsequent months.
              One member receives <span className="text-gold-400">₦1,000,000</span> each month.
              Payments are due on or before the last day of each month.
            </p>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {monthData.map((month) => {
          const recipient = participants.find(p => p.id === month.recipientId)!;
          const isCurrent = month.month === currentMonth;

          return (
            <div
              key={month.month}
              className={`glass-card rounded-2xl overflow-hidden border transition-all hover:scale-[1.01] ${
                isCurrent
                  ? 'border-gold-500/40 ring-1 ring-gold-500/20'
                  : month.status === 'completed'
                  ? 'border-primary-500/20'
                  : 'border-slate-700/30'
              }`}
            >
              {/* Header */}
              <div className={`px-5 py-3 flex items-center justify-between ${
                isCurrent
                  ? 'bg-gradient-to-r from-gold-500/15 to-accent-500/10'
                  : month.status === 'completed'
                  ? 'bg-primary-500/5'
                  : 'bg-slate-800/30'
              }`}>
                <div className="flex items-center gap-2">
                  {month.status === 'completed' && <CheckCircle2 size={16} className="text-primary-400" />}
                  {isCurrent && <Clock size={16} className="text-gold-400 animate-pulse" />}
                  {month.status === 'upcoming' && <CalendarDays size={16} className="text-slate-500" />}
                  <span className="text-sm font-bold text-white">Month {month.month}</span>
                  <span className="text-xs text-slate-400">• {month.label}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  month.status === 'completed'
                    ? 'bg-primary-500/20 text-primary-400'
                    : isCurrent
                    ? 'bg-gold-500/20 text-gold-400'
                    : 'bg-slate-700 text-slate-400'
                }`}>
                  {month.status === 'completed' ? 'COMPLETED' : isCurrent ? 'ACTIVE' : 'UPCOMING'}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                {/* Recipient */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gold-500/5 border border-gold-500/10">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-accent-500 flex items-center justify-center text-xl">
                    {recipient.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gold-400 font-medium">Receives Payout</p>
                    <p className="text-sm text-white font-bold">{recipient.name}</p>
                  </div>
                  <p className="text-lg font-bold text-gold-400">{formatCurrency(month.payoutAmount)}</p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-800/50">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Contribution</p>
                    <p className="text-sm font-bold text-white mt-1">
                      {month.month === 1 ? '₦108,000' : '₦100,000'}
                    </p>
                    <p className="text-[10px] text-slate-400">per member</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/50">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total Collected</p>
                    <p className="text-sm font-bold text-white mt-1">{formatCurrency(month.totalCollected)}</p>
                    <p className="text-[10px] text-slate-400">from 10 members</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/50">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Op. Charge</p>
                    <p className="text-sm font-bold text-white mt-1">
                      {month.operationalCharge > 0 ? formatCurrency(month.operationalCharge) : '—'}
                    </p>
                    <p className="text-[10px] text-slate-400">{month.month === 1 ? '₦8,000 × 10' : 'None'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/50">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Due Date</p>
                    <p className="text-sm font-bold text-white mt-1">{formatDate(month.endDate)}</p>
                    <p className="text-[10px] text-slate-400">last day of month</p>
                  </div>
                </div>

                {/* All participants mini */}
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Contributing Members</p>
                  <div className="flex items-center gap-1">
                    {participants.map(p => (
                      <div
                        key={p.id}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                          p.id === month.recipientId
                            ? 'bg-gold-500/20 border border-gold-500/30 ring-1 ring-gold-500/20'
                            : 'bg-slate-800 border border-slate-700/50'
                        }`}
                        title={p.name}
                      >
                        {p.avatar}
                      </div>
                    ))}
                    <ArrowRight size={14} className="text-slate-500 ml-1" />
                    <span className="text-xs text-gold-400 font-medium ml-1">{recipient.name.split(' ')[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="glass-card rounded-2xl p-6 border border-slate-700/30">
        <h3 className="text-lg font-bold text-white mb-4">Cycle Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-xl bg-slate-800/50">
            <p className="text-2xl font-bold text-primary-400">10</p>
            <p className="text-xs text-slate-400 mt-1">Total Months</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-slate-800/50">
            <p className="text-2xl font-bold text-gold-400">{formatCurrency(10000000)}</p>
            <p className="text-xs text-slate-400 mt-1">Total Payouts</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-slate-800/50">
            <p className="text-2xl font-bold text-accent-400">{formatCurrency(80000)}</p>
            <p className="text-xs text-slate-400 mt-1">Total Op. Charges</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-slate-800/50">
            <p className="text-2xl font-bold text-white">{formatCurrency(1008000)}</p>
            <p className="text-xs text-slate-400 mt-1">Total per Member</p>
          </div>
        </div>
      </div>
    </div>
  );
}
