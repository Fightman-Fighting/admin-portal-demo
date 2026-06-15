export type Role = 'SUPER_ADMIN' | 'ORG_ADMIN' | 'ACCOUNTABILITY_PARTNER';

export type PlanId = 'free' | 'pro' | 'enterprise';
export type SubStatus = 'active' | 'past_due' | 'canceled' | 'trialing';

export interface Organization {
  id: string;
  name: string;
  domain: string;
  plan: PlanId;
  status: SubStatus;
  seats: number;
  usedSeats: number;
  createdAt: string;
  mrr: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  orgId: string;
  avatar: string;
  status: 'online' | 'idle' | 'offline';
  productivity: number; // 0-100
  password: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  orgId: string;
  url: string;
  domain: string;
  category: 'work' | 'social' | 'entertainment' | 'shopping' | 'news' | 'dev';
  durationSec: number;
  timestamp: number;
}

export interface Rule {
  id: string;
  orgId: string;
  name: string;
  category: ActivityLog['category'] | 'domain';
  target: string;
  limitMin: number;
  action: 'alert' | 'block';
  enabled: boolean;
}

export interface Notification {
  id: string;
  orgId: string;
  userId?: string;
  type: 'violation' | 'threshold' | 'billing' | 'system';
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  severity: 'low' | 'medium' | 'high';
}

export interface Subscription {
  id: string;
  orgId: string;
  plan: PlanId;
  status: SubStatus;
  amount: number;
  currentPeriodEnd: string;
  checkoutSessionId?: string;
}

export interface Invoice {
  id: string;
  orgId: string;
  amount: number;
  status: 'paid' | 'open' | 'failed';
  date: string;
  plan: PlanId;
}

export interface Assignment {
  partnerId: string;
  userId: string;
}

export interface PlanDef {
  id: PlanId;
  name: string;
  price: number;
  seats: number;
  features: string[];
  highlight?: boolean;
}
