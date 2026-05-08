import { Participant, User, Contribution, Payout, MonthData } from './types';

const AVATARS = ['👤', '👩', '👨', '👩‍💼', '👨‍💼', '👩‍💻', '👨‍💻', '👩‍🎓', '👨‍🎓', '👩‍🔬'];

export const participants: Participant[] = [
  { id: 'A', name: 'Adebayo Oluwaseun', email: 'adebayo@email.com', phone: '+234 801 234 5678', position: 1, avatar: AVATARS[0], joinDate: '2026-04-15' },
  { id: 'B', name: 'Blessing Okafor', email: 'blessing@email.com', phone: '+234 802 345 6789', position: 2, avatar: AVATARS[1], joinDate: '2026-04-16' },
  { id: 'C', name: 'Chidera Nwosu', email: 'chidera@email.com', phone: '+234 803 456 7890', position: 3, avatar: AVATARS[2], joinDate: '2026-04-17' },
  { id: 'D', name: 'Damilola Adesanya', email: 'damilola@email.com', phone: '+234 804 567 8901', position: 4, avatar: AVATARS[3], joinDate: '2026-04-18' },
  { id: 'E', name: 'Emeka Eze', email: 'emeka@email.com', phone: '+234 805 678 9012', position: 5, avatar: AVATARS[4], joinDate: '2026-04-19' },
  { id: 'F', name: 'Fatima Ibrahim', email: 'fatima@email.com', phone: '+234 806 789 0123', position: 6, avatar: AVATARS[5], joinDate: '2026-04-20' },
  { id: 'G', name: 'Gbenga Adeyemi', email: 'gbenga@email.com', phone: '+234 807 890 1234', position: 7, avatar: AVATARS[6], joinDate: '2026-04-21' },
  { id: 'H', name: 'Halima Mohammed', email: 'halima@email.com', phone: '+234 808 901 2345', position: 8, avatar: AVATARS[7], joinDate: '2026-04-22' },
  { id: 'I', name: 'Ikenna Obi', email: 'ikenna@email.com', phone: '+234 809 012 3456', position: 9, avatar: AVATARS[8], joinDate: '2026-04-23' },
  { id: 'J', name: 'Jumoke Balogun', email: 'jumoke@email.com', phone: '+234 810 123 4567', position: 10, avatar: AVATARS[9], joinDate: '2026-04-24' },
];

export const users: User[] = [
  { id: 'admin', participantId: '', username: 'admin', password: 'admin123', role: 'admin' }, // password: admin123
  { id: 'A', participantId: 'A', username: 'adebayo', password: 'pass123', role: 'user' }, // password: pass123
  { id: 'B', participantId: 'B', username: 'blessing', password: 'pass123', role: 'user' },
  { id: 'C', participantId: 'C', username: 'chidera', password: 'pass123', role: 'user' },
  { id: 'D', participantId: 'D', username: 'damilola', password: 'pass123', role: 'user' },
  { id: 'E', participantId: 'E', username: 'emeka', password: 'pass123', role: 'user' },
  { id: 'F', participantId: 'F', username: 'fatima', password: 'pass123', role: 'user' },
  { id: 'G', participantId: 'G', username: 'gbenga', password: 'pass123', role: 'user' },
  { id: 'H', participantId: 'H', username: 'halima', password: 'pass123', role: 'user' },
  { id: 'I', participantId: 'I', username: 'ikenna', password: 'pass123', role: 'user' },
  { id: 'J', participantId: 'J', username: 'jumoke', password: 'pass123', role: 'user' },
];

export async function hashPassword(password: string): Promise<string> {
  // For demo purposes, return plain text
  return password;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // For demo purposes, compare plain text
  return password === hashedPassword;
}

const MONTH_LABELS = [
  'May 2026', 'June 2026', 'July 2026', 'August 2026', 'September 2026',
  'October 2026', 'November 2026', 'December 2026', 'January 2027', 'February 2027'
];

const MONTH_DATES: [string, string][] = [
  ['2026-05-01', '2026-05-31'],
  ['2026-06-01', '2026-06-30'],
  ['2026-07-01', '2026-07-31'],
  ['2026-08-01', '2026-08-31'],
  ['2026-09-01', '2026-09-30'],
  ['2026-10-01', '2026-10-31'],
  ['2026-11-01', '2026-11-30'],
  ['2026-12-01', '2026-12-31'],
  ['2027-01-01', '2027-01-31'],
  ['2027-02-01', '2027-02-28'],
];

export function getCurrentMonth(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  
  // May 2026 = month 1, June 2026 = month 2, ... Feb 2027 = month 10
  if (year === 2026) {
    if (month >= 4 && month <= 11) return month - 3; // May(4)->1, Jun(5)->2, ..., Dec(11)->8
  }
  if (year === 2027) {
    if (month === 0) return 9;  // Jan 2027
    if (month === 1) return 10; // Feb 2027
  }
  
  // Before cycle starts
  if (year < 2026 || (year === 2026 && month < 4)) return 0;
  // After cycle ends
  return 11;
}

export function getMonthStatus(monthNum: number): 'completed' | 'active' | 'upcoming' {
  const current = getCurrentMonth();
  if (monthNum < current) return 'completed';
  if (monthNum === current) return 'active';
  return 'upcoming';
}

export function generateMonthData(): MonthData[] {
  return Array.from({ length: 10 }, (_, i) => {
    const monthNum = i + 1;
    const status = getMonthStatus(monthNum);
    const isFirstMonth = monthNum === 1;
    
    return {
      month: monthNum,
      label: MONTH_LABELS[i],
      startDate: MONTH_DATES[i][0],
      endDate: MONTH_DATES[i][1],
      recipientId: participants[i].id,
      totalCollected: isFirstMonth ? 1080000 : 1000000,
      operationalCharge: isFirstMonth ? 80000 : 0,
      payoutAmount: 1000000,
      status,
    };
  });
}

export function generateContributions(): Contribution[] {
  const contributions: Contribution[] = [];
  const currentMonth = getCurrentMonth();
  
  for (let month = 1; month <= 10; month++) {
    for (const participant of participants) {
      const isFirstMonth = month === 1;
      const amount = 100000;
      const operationalCharge = isFirstMonth ? 8000 : 0;
      const totalPaid = amount + operationalCharge;
      
      let status: 'paid' | 'pending' | 'overdue' = 'pending';
      if (month < currentMonth) {
        status = 'paid';
      } else if (month === currentMonth) {
        // Simulate some paid, some pending for current month
        status = participant.position <= 7 ? 'paid' : 'pending';
      }
      
      contributions.push({
        id: `C-${month}-${participant.id}`,
        participantId: participant.id,
        month,
        amount,
        operationalCharge,
        totalPaid,
        date: MONTH_DATES[month - 1][1],
        status,
      });
    }
  }
  
  return contributions;
}

export function generatePayouts(): Payout[] {
  const currentMonth = getCurrentMonth();
  
  return participants.map((p, i) => {
    const month = i + 1;
    let status: 'paid' | 'scheduled' | 'pending' = 'scheduled';
    if (month < currentMonth) status = 'paid';
    else if (month === currentMonth) status = 'pending';
    
    return {
      id: `P-${month}`,
      participantId: p.id,
      month,
      amount: 1000000,
      date: MONTH_DATES[i][1],
      status,
    };
  });
}

export function formatCurrency(amount: number): string {
  return '₦' + amount.toLocaleString('en-NG');
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
