import { Organization, User, ActivityLog, Rule, Notification, Subscription, Invoice, Assignment, PlanDef } from './types';

export const PLANS: PlanDef[] = [
  { id: 'free', name: 'Free', price: 0, seats: 5, features: ['Up to 5 users', 'Basic activity logs', '7-day history', 'Community support'] },
  { id: 'pro', name: 'Pro', price: 29, seats: 25, features: ['Up to 25 users', 'AI productivity insights', 'Rules engine', 'Real-time alerts', '90-day history', 'Priority support'], highlight: true },
  { id: 'enterprise', name: 'Enterprise', price: 99, seats: 200, features: ['Unlimited users', 'Advanced AI risk detection', 'Custom rules + SSO', 'Audit logs', 'Unlimited history', 'Dedicated CSM'] },
];

const av = (s: string) => `https://i.pravatar.cc/150?u=${s}`;

export const organizations: Organization[] = [
  { id: 'org_acme', name: 'Acme Corp', domain: 'acme.io', plan: 'enterprise', status: 'active', seats: 200, usedSeats: 142, createdAt: '2024-03-11', mrr: 99 },
  { id: 'org_nova', name: 'Nova Labs', domain: 'novalabs.dev', plan: 'pro', status: 'active', seats: 25, usedSeats: 18, createdAt: '2024-06-02', mrr: 29 },
  { id: 'org_zen', name: 'ZenFlow', domain: 'zenflow.app', plan: 'pro', status: 'past_due', seats: 25, usedSeats: 21, createdAt: '2024-08-19', mrr: 29 },
  { id: 'org_pixel', name: 'PixelForge', domain: 'pixelforge.co', plan: 'free', status: 'active', seats: 5, usedSeats: 5, createdAt: '2025-01-07', mrr: 0 },
  { id: 'org_orbit', name: 'Orbit Media', domain: 'orbit.media', plan: 'enterprise', status: 'active', seats: 200, usedSeats: 88, createdAt: '2024-11-23', mrr: 99 },
  { id: 'org_helix', name: 'Helix AI', domain: 'helix.ai', plan: 'pro', status: 'trialing', seats: 25, usedSeats: 9, createdAt: '2025-05-30', mrr: 0 },
];

const firstNames = ['Maya', 'Liam', 'Sofia', 'Noah', 'Ava', 'Ethan', 'Isla', 'Lucas', 'Mia', 'Leo', 'Zoe', 'Kai', 'Nora', 'Jack', 'Ivy', 'Owen', 'Ruby', 'Finn'];
const lastNames = ['Chen', 'Patel', 'Garcia', 'Kim', 'Singh', 'Lopez', 'Müller', 'Khan', 'Rossi', 'Cohen', 'Park', 'Diaz', 'Walsh', 'Nair', 'Bauer'];

function buildUsers(): User[] {
  const users: User[] = [];
  // Platform super admin
  users.push({ id: 'u_super', name: 'Alex Rivera', email: 'super@platform.io', role: 'SUPER_ADMIN', orgId: '*', avatar: av('super'), status: 'online', productivity: 0, password: 'demo' });

  organizations.forEach((org, oi) => {
    // org admin
    users.push({
      id: `u_admin_${org.id}`, name: `${firstNames[oi]} ${lastNames[oi]}`, email: `admin@${org.domain}`,
      role: 'ORG_ADMIN', orgId: org.id, avatar: av('admin' + org.id), status: 'online', productivity: 88, password: 'demo',
    });
    // partner
    users.push({
      id: `u_partner_${org.id}`, name: `${firstNames[(oi + 6) % firstNames.length]} ${lastNames[(oi + 3) % lastNames.length]}`, email: `partner@${org.domain}`,
      role: 'ACCOUNTABILITY_PARTNER', orgId: org.id, avatar: av('partner' + org.id), status: 'idle', productivity: 0, password: 'demo',
    });
    // members
    const count = Math.min(6, Math.max(3, Math.round(org.usedSeats / 8)));
    for (let i = 0; i < count; i++) {
      const idx = (oi * 5 + i) % firstNames.length;
      users.push({
        id: `u_${org.id}_${i}`,
        name: `${firstNames[idx]} ${lastNames[(idx + i) % lastNames.length]}`,
        email: `${firstNames[idx].toLowerCase()}.${i}@${org.domain}`,
        role: 'ACCOUNTABILITY_PARTNER',
        orgId: org.id, avatar: av(org.id + i),
        status: (['online', 'idle', 'offline'] as const)[i % 3],
        productivity: 50 + ((idx * 7 + i * 13) % 48),
        password: 'demo',
      });
      users[users.length - 1].role = 'ACCOUNTABILITY_PARTNER';
    }
  });
  return users;
}

export const users: User[] = buildUsers();

// Members = users that are tracked (everyone with a generated u_org_ id)
export const members = users.filter((u) => /^u_org_/.test(u.id));

const SITES: { domain: string; cat: ActivityLog['category'] }[] = [
  { domain: 'github.com', cat: 'dev' }, { domain: 'stackoverflow.com', cat: 'dev' },
  { domain: 'figma.com', cat: 'work' }, { domain: 'notion.so', cat: 'work' },
  { domain: 'slack.com', cat: 'work' }, { domain: 'gmail.com', cat: 'work' },
  { domain: 'youtube.com', cat: 'entertainment' }, { domain: 'netflix.com', cat: 'entertainment' },
  { domain: 'twitter.com', cat: 'social' }, { domain: 'instagram.com', cat: 'social' },
  { domain: 'reddit.com', cat: 'social' }, { domain: 'amazon.com', cat: 'shopping' },
  { domain: 'nytimes.com', cat: 'news' }, { domain: 'docs.google.com', cat: 'work' },
];

export function genActivity(seed = 220): ActivityLog[] {
  const logs: ActivityLog[] = [];
  const now = Date.now();
  for (let i = 0; i < seed; i++) {
    const m = members[(i * 3) % members.length];
    const s = SITES[(i * 7) % SITES.length];
    logs.push({
      id: `act_${i}`,
      userId: m.id, orgId: m.orgId, domain: s.domain,
      url: `https://${s.domain}/${['dashboard', 'feed', 'watch', 'inbox', 'repo'][(i) % 5]}`,
      category: s.cat,
      durationSec: 120 + ((i * 137) % 2400),
      timestamp: now - i * 1000 * 60 * (3 + (i % 40)),
    });
  }
  return logs.sort((a, b) => b.timestamp - a.timestamp);
}

export const rules: Rule[] = [
  { id: 'r1', orgId: 'org_nova', name: 'YouTube daily limit', category: 'domain', target: 'youtube.com', limitMin: 60, action: 'alert', enabled: true },
  { id: 'r2', orgId: 'org_nova', name: 'Social media cap', category: 'social', target: 'all social', limitMin: 45, action: 'alert', enabled: true },
  { id: 'r3', orgId: 'org_nova', name: 'Block gambling', category: 'domain', target: 'bet365.com', limitMin: 0, action: 'block', enabled: true },
  { id: 'r4', orgId: 'org_acme', name: 'Entertainment block (work hrs)', category: 'entertainment', target: 'all entertainment', limitMin: 30, action: 'block', enabled: true },
  { id: 'r5', orgId: 'org_acme', name: 'Shopping threshold', category: 'shopping', target: 'all shopping', limitMin: 20, action: 'alert', enabled: false },
];

export const notifications: Notification[] = [
  { id: 'n1', orgId: 'org_nova', type: 'violation', title: 'Rule violation', body: 'Mia Kim exceeded YouTube limit (74m / 60m)', timestamp: Date.now() - 60000 * 4, read: false, severity: 'high' },
  { id: 'n2', orgId: 'org_nova', type: 'threshold', title: 'Threshold warning', body: 'Leo Park nearing social media cap (41m / 45m)', timestamp: Date.now() - 60000 * 22, read: false, severity: 'medium' },
  { id: 'n3', orgId: 'org_acme', type: 'billing', title: 'Payment succeeded', body: 'Enterprise renewal $99.00 processed', timestamp: Date.now() - 60000 * 120, read: true, severity: 'low' },
  { id: 'n4', orgId: 'org_zen', type: 'billing', title: 'Payment past due', body: 'Pro subscription payment failed', timestamp: Date.now() - 60000 * 300, read: false, severity: 'high' },
];

export const subscriptions: Subscription[] = organizations.map((o) => ({
  id: `sub_${o.id}`, orgId: o.id, plan: o.plan, status: o.status,
  amount: PLANS.find((p) => p.id === o.plan)!.price,
  currentPeriodEnd: '2026-07-15',
}));

export const invoices: Invoice[] = [
  { id: 'in_1043', orgId: 'org_acme', amount: 99, status: 'paid', date: '2026-06-01', plan: 'enterprise' },
  { id: 'in_1042', orgId: 'org_nova', amount: 29, status: 'paid', date: '2026-06-01', plan: 'pro' },
  { id: 'in_1041', orgId: 'org_zen', amount: 29, status: 'failed', date: '2026-06-01', plan: 'pro' },
  { id: 'in_1040', orgId: 'org_orbit', amount: 99, status: 'paid', date: '2026-06-01', plan: 'enterprise' },
  { id: 'in_1039', orgId: 'org_acme', amount: 99, status: 'paid', date: '2026-05-01', plan: 'enterprise' },
  { id: 'in_1038', orgId: 'org_nova', amount: 29, status: 'paid', date: '2026-05-01', plan: 'pro' },
];

export const assignments: Assignment[] = (() => {
  const res: Assignment[] = [];
  organizations.forEach((o) => {
    const partner = `u_partner_${o.id}`;
    members.filter((m) => m.orgId === o.id).forEach((m) => res.push({ partnerId: partner, userId: m.id }));
  });
  return res;
})();

export const DEMO_ACCOUNTS = [
  { label: 'Super Admin', email: 'super@platform.io', role: 'Platform owner — global access' },
  { label: 'Org Admin', email: 'admin@novalabs.dev', role: 'Nova Labs — manage org' },
  { label: 'Accountability Partner', email: 'partner@novalabs.dev', role: 'Nova Labs — monitor users' },
];
