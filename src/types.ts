export interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: number; // 1-10 rotation position
  avatar: string;
  joinDate: string;
}

export interface User {
  id: string;
  participantId: string;
  username: string;
  password: string; // In production, hash this
  role: UserRole;
}

export interface Contribution {
  id: string;
  participantId: string;
  month: number; // 1-10
  amount: number;
  operationalCharge: number;
  totalPaid: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
}

export interface Payout {
  id: string;
  participantId: string;
  month: number;
  amount: number;
  date: string;
  status: 'paid' | 'scheduled' | 'pending';
}

export interface MonthData {
  month: number;
  label: string;
  startDate: string;
  endDate: string;
  recipientId: string;
  totalCollected: number;
  operationalCharge: number;
  payoutAmount: number;
  status: 'completed' | 'active' | 'upcoming';
}

export type ViewMode = 'dashboard' | 'participants' | 'contributions' | 'payouts' | 'schedule' | 'reports' | 'settings';
export type UserRole = 'admin' | 'user';
