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

export interface Notification {
  id: string;
  userId: string;
  type: 'payment_reminder' | 'payment_overdue' | 'payment_success' | 'payout_scheduled' | 'payout_received' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface SystemSettings {
  paymentReminderDays: number;
  overduePenalty: number;
  maxOverdueDays: number;
  enableNotifications: boolean;
  enableEmailNotifications: boolean;
  enableSmsNotifications: boolean;
}

export type ViewMode = 'dashboard' | 'participants' | 'contributions' | 'payouts' | 'schedule' | 'reports' | 'settings' | 'help';
export type UserRole = 'admin' | 'user';
