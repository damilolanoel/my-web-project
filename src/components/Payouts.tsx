import { useMemo } from 'react';
import { UserRole } from '../types';
import {
  participants,
  generatePayouts,
  generateMonthData,
  formatCurrency,
  formatDate,
  getCurrentMonth,
} from '../data';
import {
  CheckCircle2,
  Clock,
  CalendarDays,
  ArrowDownToLine,
  Banknote,
  TrendingUp,
} from 'lucide-react';

interface PayoutsProps {
  role: UserRole;
}

export default function Payouts({ role }: PayoutsProps) {
  const payouts = useMemo(() => generatePayouts(), []);
  const monthData = useMemo(() => generateMonthData(), []);
  const currentMonth = getCurrentMonth();

  const totalPaidOut = payouts
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalRemaining = payouts
    .filter(p => p.status !== 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-primary-500/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary-500/10">
              <ArrowDownToLine size={22} className="text-primary-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Total Paid Out</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalPaidOut)}</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-gold-500/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gold-500/10">
              <Banknote size={22} className="text-gold-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Remaining</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalRemaining)}</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-700/30">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-accent-500/10">
              <TrendingUp size={22} className="text-accent-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Per Payout</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(1000000)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payout Timeline */}
      <div className="glass-card rounded-2xl p-6 border border-slate-700/30">
        <h3 className="text-lg font-bold text-white mb-6">Payout Timeline</h3>
        
        <div className="space-y-4">
          {payouts.map((payout, i) => {
            const p = participants.find(part => part.id === payout.participantId)!;
            const month = monthData[i];
            const isCurrent = payout.month === currentMonth;

            return (
              <div
                key={payout.id}
                className={`relative flex items-start gap-4 p-4 rounded-2xl transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-r from-gold-500/10 to-accent-500/5 border border-gold-500/30'
                    : payout.status === 'paid'
                    ? 'bg-primary-500/5 border border-primary-500/20'
                    : 'bg-slate-800/30 border border-slate-700/20'
                }`}
              >
                {/* Timeline Connector */}
                {i < payouts.length - 1 && (
                  <div className="absolute left-[2.15rem] top-[4.5rem] w-0.5 h-[calc(100%-2rem)] bg-slate-700/50" />
                )}

                {/* Icon */}
                <div className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  payout.status === 'paid'
                    ? 'bg-primary-500 text-white'
                    : isCurrent
                    ? 'bg-gold-500 text-slate-900'
                    : 'bg-slate-700 text-slate-400'
                }`}>
                  {payout.status === 'paid' ? (
                    <CheckCircle2 size={18} />
                  ) : isCurrent ? (
                    <Clock size={18} />
                  ) : (
                    <CalendarDays size={18} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{p.avatar}</span>
                        <p className="text-white font-semibold">{p.name}</p>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700 text-slate-300">
                          User {p.id}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-500/20 text-gold-400 animate-pulse">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 mt-1">
                        {month?.label} • Due by {formatDate(payout.date)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">{formatCurrency(payout.amount)}</p>
                        <p className={`text-xs font-semibold ${
                          payout.status === 'paid' ? 'text-primary-400' :
                          isCurrent ? 'text-gold-400' : 'text-slate-500'
                        }`}>
                          {payout.status === 'paid' ? '✅ Paid' :
                           isCurrent ? '⏳ Processing' : '📅 Scheduled'}
                        </p>
                      </div>

                      {role === 'admin' && payout.status !== 'paid' && isCurrent && (
                        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-accent-500 text-slate-900 text-sm font-bold hover:opacity-90 transition-opacity">
                          Process Payout
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
