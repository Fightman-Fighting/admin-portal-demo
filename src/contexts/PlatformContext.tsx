import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useTheme } from '@/components/theme-provider';
import {
  organizations as seedOrgs, users as seedUsers, members, genActivity, rules as seedRules,
  notifications as seedNotifs, subscriptions as seedSubs, invoices as seedInvoices, assignments, PLANS,
} from '@/lib/mockData';
import { Organization, User, ActivityLog, Rule, Notification, Subscription, Invoice, PlanId } from '@/lib/types';

interface PlatformState {
  // auth
  currentUser: User | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  register: (name: string, email: string, org: string) => void;
  // theme
  dark: boolean;
  toggleDark: () => void;
  // data
  orgs: Organization[];
  allUsers: User[];
  activity: ActivityLog[];
  rules: Rule[];
  notifications: Notification[];
  subscriptions: Subscription[];
  invoices: Invoice[];
  liveBrowsing: Record<string, { domain: string; cat: string }>;
  // actions
  toggleRule: (id: string) => void;
  addRule: (r: Omit<Rule, 'id'>) => void;
  removeRule: (id: string) => void;
  markAllRead: () => void;
  changePlan: (orgId: string, plan: PlanId) => string; // returns checkout session id
  simulatePaymentSuccess: (orgId: string) => void;
  simulateRenewal: (orgId: string) => void;
  cancelSubscription: (orgId: string) => void;
  assignedMembers: (partnerId: string) => User[];
  pushNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
}

const Ctx = createContext<PlatformState | null>(null);
export const usePlatform = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('usePlatform outside provider');
  return c;
};

const LIVE_SITES = [
  { domain: 'github.com', cat: 'dev' }, { domain: 'figma.com', cat: 'work' },
  { domain: 'youtube.com', cat: 'entertainment' }, { domain: 'slack.com', cat: 'work' },
  { domain: 'twitter.com', cat: 'social' }, { domain: 'notion.so', cat: 'work' },
  { domain: 'reddit.com', cat: 'social' }, { domain: 'stackoverflow.com', cat: 'dev' },
  { domain: 'amazon.com', cat: 'shopping' }, { domain: 'docs.google.com', cat: 'work' },
];

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme } = useTheme();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [orgs, setOrgs] = useState(seedOrgs);
  const [allUsers, setAllUsers] = useState(seedUsers);
  const [activity, setActivity] = useState<ActivityLog[]>(() => genActivity());
  const [rules, setRules] = useState(seedRules);
  const [notifications, setNotifications] = useState(seedNotifs);
  const [subscriptions, setSubscriptions] = useState(seedSubs);
  const [invoices, setInvoices] = useState(seedInvoices);
  const [liveBrowsing, setLiveBrowsing] = useState<Record<string, { domain: string; cat: string }>>({});
  const tick = useRef(0);

  const dark = useMemo(() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, [theme]);

  // realtime engine: every 3s push activity + update live browsing + maybe alert
  useEffect(() => {
    const onlineMembers = members.filter((m) => m.status !== 'offline');
    const id = setInterval(() => {
      tick.current++;
      setLiveBrowsing(() => {
        const next: Record<string, { domain: string; cat: string }> = {};
        onlineMembers.forEach((m, i) => {
          if ((i + tick.current) % 3 !== 0) {
            next[m.id] = LIVE_SITES[(i + tick.current) % LIVE_SITES.length];
          }
        });
        return next;
      });
      // push a new activity log
      const m = members[(tick.current * 5) % members.length];
      const s = LIVE_SITES[(tick.current * 3) % LIVE_SITES.length];
      const log: ActivityLog = {
        id: `live_${Date.now()}`, userId: m.id, orgId: m.orgId, domain: s.domain,
        url: `https://${s.domain}/`, category: s.cat as ActivityLog['category'],
        durationSec: 60 + (tick.current % 20) * 30, timestamp: Date.now(),
      };
      setActivity((prev) => [log, ...prev].slice(0, 400));
      // occasional violation alert
      if (tick.current % 5 === 0 && (s.cat === 'entertainment' || s.cat === 'social')) {
        const n: Notification = {
          id: `live_n_${Date.now()}`, orgId: m.orgId, userId: m.id, type: 'violation',
          title: 'Live rule alert', body: `${m.name} is browsing ${s.domain} (${s.cat})`,
          timestamp: Date.now(), read: false, severity: s.cat === 'entertainment' ? 'high' : 'medium',
        };
        setNotifications((prev) => [n, ...prev].slice(0, 60));
      }
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const u = seedUsers.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
    if (!u) return { ok: false, error: 'No account found for that email' };
    if (password && password !== u.password) return { ok: false, error: 'Incorrect password' };
    setCurrentUser(u);
    return { ok: true };
  }, []);

  const logout = useCallback(() => setCurrentUser(null), []);
  const register = useCallback((name: string, email: string, org: string) => {
    const newOrg: Organization = {
      id: `org_${Date.now()}`, name: org, domain: email.split('@')[1] || 'demo.io', plan: 'free',
      status: 'active', seats: 5, usedSeats: 1, createdAt: new Date().toISOString().slice(0, 10), mrr: 0,
    };
    const newUser: User = { id: `u_${Date.now()}`, name, email, role: 'ORG_ADMIN', orgId: newOrg.id, avatar: `https://i.pravatar.cc/150?u=${email}`, status: 'online', productivity: 0, password: 'demo' };
    setOrgs((p) => [newOrg, ...p]);
    setAllUsers((p) => [...p, newUser]);
    setSubscriptions((p) => [{ id: `sub_${newOrg.id}`, orgId: newOrg.id, plan: 'free', status: 'active', amount: 0, currentPeriodEnd: '2026-12-31' }, ...p]);
    setCurrentUser(newUser);
  }, []);

  const toggleDark = useCallback(() => {
    setTheme(dark ? 'light' : 'dark');
  }, [dark, setTheme]);
  const toggleRule = useCallback((id: string) => setRules((p) => p.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r)), []);
  const addRule = useCallback((r: Omit<Rule, 'id'>) => setRules((p) => [{ ...r, id: `r_${Date.now()}` }, ...p]), []);
  const removeRule = useCallback((id: string) => setRules((p) => p.filter((r) => r.id !== id)), []);
  const markAllRead = useCallback(() => setNotifications((p) => p.map((n) => ({ ...n, read: true }))), []);

  const pushNotification = useCallback((n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    setNotifications((p) => [{ ...n, id: `n_${Date.now()}`, timestamp: Date.now(), read: false }, ...p]);
  }, []);

  const changePlan = useCallback((orgId: string, plan: PlanId) => {
    const sessionId = `cs_test_${Math.random().toString(36).slice(2, 12)}`;
    const price = PLANS.find((p) => p.id === plan)!.price;
    setSubscriptions((p) => p.map((s) => s.orgId === orgId ? { ...s, plan, status: 'trialing', amount: price, checkoutSessionId: sessionId } : s));
    return sessionId;
  }, []);

  const simulatePaymentSuccess = useCallback((orgId: string) => {
    setSubscriptions((p) => p.map((s) => s.orgId === orgId ? { ...s, status: 'active' } : s));
    setOrgs((p) => p.map((o) => {
      if (o.id !== orgId) return o;
      const sub = seedSubs.find((s) => s.orgId === orgId);
      return o;
    }));
    setSubscriptions((cur) => {
      const sub = cur.find((s) => s.orgId === orgId);
      if (sub) {
        setOrgs((p) => p.map((o) => o.id === orgId ? { ...o, plan: sub.plan, status: 'active', mrr: sub.amount } : o));
        setInvoices((iv) => [{ id: `in_${1044 + iv.length}`, orgId, amount: sub.amount, status: 'paid', date: new Date().toISOString().slice(0, 10), plan: sub.plan }, ...iv]);
      }
      return cur;
    });
    pushNotification({ orgId, type: 'billing', title: 'Payment succeeded', body: 'Checkout completed - subscription is now active.', severity: 'low' });
  }, [pushNotification]);

  const simulateRenewal = useCallback((orgId: string) => {
    setSubscriptions((cur) => {
      const sub = cur.find((s) => s.orgId === orgId);
      if (sub) setInvoices((iv) => [{ id: `in_${1044 + iv.length}`, orgId, amount: sub.amount, status: 'paid', date: new Date().toISOString().slice(0, 10), plan: sub.plan }, ...iv]);
      return cur.map((s) => s.orgId === orgId ? { ...s, status: 'active', currentPeriodEnd: '2026-08-15' } : s);
    });
    pushNotification({ orgId, type: 'billing', title: 'Subscription renewed', body: 'Recurring payment processed for the next billing cycle.', severity: 'low' });
  }, [pushNotification]);

  const cancelSubscription = useCallback((orgId: string) => {
    setSubscriptions((p) => p.map((s) => s.orgId === orgId ? { ...s, status: 'canceled' } : s));
    setOrgs((p) => p.map((o) => o.id === orgId ? { ...o, status: 'canceled' } : o));
    pushNotification({ orgId, type: 'billing', title: 'Subscription canceled', body: 'Plan will downgrade to Free at period end.', severity: 'medium' });
  }, [pushNotification]);

  const assignedMembers = useCallback((partnerId: string) => {
    const ids = assignments.filter((a) => a.partnerId === partnerId).map((a) => a.userId);
    return allUsers.filter((u) => ids.includes(u.id));
  }, [allUsers]);

  return (
    <Ctx.Provider value={{
      currentUser, login, logout, register, dark, toggleDark, orgs, allUsers, activity, rules,
      notifications, subscriptions, invoices, liveBrowsing, toggleRule, addRule, removeRule, markAllRead,
      changePlan, simulatePaymentSuccess, simulateRenewal, cancelSubscription, assignedMembers, pushNotification,
    }}>
      {children}
    </Ctx.Provider>
  );
};
