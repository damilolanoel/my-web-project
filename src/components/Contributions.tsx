import React, { useState, useMemo } from 'react';
import { UserRole, Contribution } from '../types';
import { useNotifications } from '../contexts/NotificationContext';
import {
  participants,
  generateMonthData,
  formatCurrency,
  formatDate,
  getCurrentMonth,
} from '../data';
import { exportContributions } from '../utils/export';
import {
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  ChevronDown,
  Wallet,
  TrendingUp,
  CreditCard,
} from 'lucide-react';

interface ContributionsProps {
  role: UserRole;
  contributions: Contribution[];
  setContributions: React.Dispatch<React.SetStateAction<Contribution[]>>;
}

interface PaymentModalProps {
  contribution: Contribution;
  participant: any;
  onClose: () => void;
  onPaymentSuccess: (contributionId: string) => void;
}

function PaymentModal({ contribution, participant, onClose, onPaymentSuccess }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');

  const handlePayment = async () => {
    setStep('processing');
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setStep('success');
      setIsProcessing(false);
      setTimeout(() => {
        onPaymentSuccess(contribution.id);
        onClose();
      }, 2000);
    }, 3000);
  };

  const monthData = generateMonthData();
  const month = monthData[contribution.month - 1];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl p-6 border border-slate-700/30 max-w-md w-full">
        {step === 'details' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Make Payment</h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-500/10 flex items-center justify-center mb-4">
                  <CreditCard size={32} className="text-primary-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  {month?.label} Contribution
                </h4>
                <p className="text-sm text-slate-400">
                  Position #{participant.position} • {participant.name}
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Contribution:</span>
                  <span className="text-sm text-white">{formatCurrency(contribution.amount)}</span>
                </div>
                {contribution.operationalCharge > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400">Operational Charge:</span>
                    <span className="text-sm text-white">{formatCurrency(contribution.operationalCharge)}</span>
                  </div>
                )}
                <div className="border-t border-slate-700/50 pt-2 flex justify-between">
                  <span className="text-sm font-semibold text-white">Total:</span>
                  <span className="text-sm font-semibold text-primary-400">{formatCurrency(contribution.totalPaid)}</span>
                </div>
              </div>

              <div className="bg-accent-500/10 border border-accent-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-accent-400">
                  <Clock size={16} />
                  <span className="text-sm font-medium">Due: {formatDate(contribution.date)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-700/50 text-slate-300 hover:bg-slate-700/70 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-colors"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </>
        )}

        {step === 'processing' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-500/10 flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-400 border-t-transparent"></div>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Processing Payment</h4>
            <p className="text-sm text-slate-400">Please wait while we process your payment...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-500/10 flex items-center justify-center mb-4">
              <CheckCircle2 size={32} className="text-primary-400" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Payment Successful!</h4>
            <p className="text-sm text-slate-400">Your contribution has been recorded.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Contributions({ role, contributions, setContributions }: ContributionsProps) {
  const [filterMonth, setFilterMonth] = useState<number>(getCurrentMonth() || 1);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [paymentModal, setPaymentModal] = useState<{ isOpen: boolean; contribution?: Contribution }>({ isOpen: false });
  const monthData = useMemo(() => generateMonthData(), []);
  const { addNotification } = useNotifications();

  const handleTogglePaid = (id: string) => {
    setContributions(prev => prev.map(c => {
      if (c.id !== id) return c;
      return {
        ...c,
        status: c.status === 'paid' ? 'pending' : 'paid',
      };
    }));
  };

  const handleGenerateLink = async (contribution: Contribution) => {
    const participant = participants.find(p => p.id === contribution.participantId);
    const paymentLink = `${window.location.origin}/pay?contributionId=${contribution.id}&userId=${contribution.participantId}&amount=${contribution.totalPaid}&month=${contribution.month}`;

    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(paymentLink);
      addNotification({
        userId: 'admin',
        type: 'system_alert',
        title: 'Payment Link Generated',
        message: `Payment link for ${participant?.name}'s ${monthData[contribution.month - 1]?.label} contribution has been copied to clipboard.`,
        actionUrl: '#contributions',
      });
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      alert(`Payment Link: ${paymentLink}`);
    }
  };

  const handlePaymentSuccess = (contributionId: string) => {
    const contribution = contributions.find(c => c.id === contributionId);
    setContributions(prev => prev.map(c => 
      c.id === contributionId ? { ...c, status: 'paid' as const } : c
    ));

    // Add success notification
    if (contribution) {
      const month = monthData[contribution.month - 1];
      const participant = participants.find(p => p.id === contribution.participantId);
      addNotification({
        userId: contribution.participantId,
        type: 'payment_success',
        title: 'Payment Successful',
        message: `Your ${month?.label} contribution of ${formatCurrency(contribution.totalPaid)} has been processed successfully.`,
        actionUrl: '#contributions',
      });
    }
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
          <button
            onClick={() => exportContributions(filtered, participants)}
            className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-colors"
          >
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
                        <div className="flex gap-2">
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
                          <button
                            onClick={() => handleGenerateLink(c)}
                            className="px-3 py-1.5 rounded-lg bg-gold-600/20 text-gold-400 text-xs font-medium hover:bg-gold-600/30 transition-colors border border-gold-500/20"
                          >
                            Generate Link
                          </button>
                        </div>
                      </td>
                    )}
                    {role === 'user' && c.status === 'pending' && (
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setPaymentModal({ isOpen: true, contribution: c })}
                          className="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-xs font-medium transition-colors"
                        >
                          Pay Now
                        </button>
                      </td>
                    )}
                    {role === 'user' && c.status !== 'pending' && (
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-500">—</span>
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

      {paymentModal.isOpen && paymentModal.contribution && (
        <PaymentModal
          contribution={paymentModal.contribution}
          participant={participants.find(p => p.id === paymentModal.contribution.participantId)!}
          onClose={() => setPaymentModal({ isOpen: false })}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
