import React, { useState, useEffect } from 'react';
import { Contribution } from '../types';
import { participants, formatCurrency } from '../data';
import { useNotifications } from '../contexts/NotificationContext';
import { CheckCircle2, CreditCard, Wallet } from 'lucide-react';

interface PaymentPageProps {
  contributions: Contribution[];
  setContributions: React.Dispatch<React.SetStateAction<Contribution[]>>;
  onBack: () => void;
}

export default function PaymentPage({ contributions, setContributions, onBack }: PaymentPageProps) {
  const [contribution, setContribution] = useState<Contribution | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const contributionId = urlParams.get('contributionId');
    const userId = urlParams.get('userId');

    if (contributionId && userId) {
      const found = contributions.find(c => c.id === contributionId && c.participantId === userId);
      if (found) {
        setContribution(found);
      }
    }
  }, [contributions]);

  const handlePayment = async () => {
    if (!contribution) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setContributions(prev => prev.map(c =>
        c.id === contribution.id ? { ...c, status: 'paid' as const } : c
      ));

      setIsSuccess(true);
      setIsProcessing(false);

      // Add success notification
      addNotification({
        userId: contribution.participantId,
        type: 'payment_success',
        title: 'Payment Successful',
        message: `Your contribution of ${formatCurrency(contribution.totalPaid)} has been processed successfully.`,
        actionUrl: '#contributions',
      });

      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname);
    }, 3000);
  };

  if (!contribution) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Invalid Payment Link</h1>
          <p className="text-slate-400 mb-6">This payment link is invalid or has expired.</p>
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const participant = participants.find(p => p.id === contribution.participantId);

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-500/10 flex items-center justify-center mb-4">
              <CheckCircle2 size={32} className="text-primary-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-slate-400 mb-6">Your contribution has been recorded.</p>
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center text-2xl font-bold text-slate-900 mx-auto mb-4">
              B
            </div>
            <h1 className="text-2xl font-bold text-slate-200 mb-2">Complete Payment</h1>
            <p className="text-sm text-slate-400">Secure payment for your thrift contribution</p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">{participant?.avatar}</span>
                <div>
                  <p className="text-sm font-medium text-white">{participant?.name}</p>
                  <p className="text-xs text-slate-500">Month {contribution.month} Contribution</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-400 mb-1">{formatCurrency(contribution.totalPaid)}</p>
                <p className="text-xs text-slate-500">
                  {formatCurrency(contribution.amount)} + {formatCurrency(contribution.operationalCharge)} operational charge
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <CreditCard size={20} className="text-slate-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Bank Transfer</p>
                  <p className="text-xs text-slate-500">Manual bank transfer</p>
                </div>
                <div className="w-4 h-4 rounded-full bg-primary-500"></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold transition-colors"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Wallet size={20} />
                  Complete Payment
                </>
              )}
            </button>

            <button
              onClick={onBack}
              className="w-full px-6 py-3 rounded-xl bg-slate-700/50 text-slate-300 hover:bg-slate-700/70 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}