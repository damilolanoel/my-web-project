import { Contribution, Notification } from '../types';
import { generateMonthData, getCurrentMonth } from '../data';

export function generatePaymentReminders(contributions: Contribution[], addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void) {
  const currentMonth = getCurrentMonth();
  const monthData = generateMonthData();
  const today = new Date();
  const threeDaysFromNow = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));

  contributions.forEach(contribution => {
    if (contribution.status === 'pending') {
      const dueDate = new Date(contribution.date);
      const month = monthData[contribution.month - 1];

      // Check if payment is due within 3 days
      if (dueDate >= today && dueDate <= threeDaysFromNow) {
        const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

        addNotification({
          userId: contribution.participantId,
          type: 'payment_reminder',
          title: 'Payment Due Soon',
          message: `Your ${month?.label} contribution of ₦${contribution.totalPaid.toLocaleString()} is due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}.`,
          actionUrl: '#contributions',
        });
      }

      // Check if payment is overdue
      if (dueDate < today) {
        addNotification({
          userId: contribution.participantId,
          type: 'payment_overdue',
          title: 'Payment Overdue',
          message: `Your ${month?.label} contribution of ₦${contribution.totalPaid.toLocaleString()} is overdue. Please make payment immediately to avoid penalties.`,
          actionUrl: '#contributions',
        });
      }
    }
  });
}

export function generatePayoutNotifications(payouts: any[], addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void) {
  const currentMonth = getCurrentMonth();

  payouts.forEach(payout => {
    if (payout.status === 'scheduled' && payout.month === currentMonth) {
      addNotification({
        userId: payout.participantId,
        type: 'payout_scheduled',
        title: 'Payout Scheduled',
        message: `Your payout of ₦${payout.amount.toLocaleString()} is scheduled for this month. Congratulations!`,
        actionUrl: '#payouts',
      });
    }

    if (payout.status === 'paid' && payout.month === currentMonth) {
      addNotification({
        userId: payout.participantId,
        type: 'payout_received',
        title: 'Payout Received',
        message: `Your payout of ₦${payout.amount.toLocaleString()} has been processed successfully.`,
        actionUrl: '#payouts',
      });
    }
  });
}