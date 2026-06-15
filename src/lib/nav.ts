import { Role } from './types';
import {
  LayoutDashboard, Building2, CreditCard, Users, ShieldAlert, FileBarChart,
  Radio, Bell, StickyNote, Chrome, Sparkles, Activity, Settings,
} from 'lucide-react';

export interface NavItem { id: string; label: string; icon: any; section: string; }

export const NAV: Record<Role, NavItem[]> = {
  SUPER_ADMIN: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Platform' },
    { id: 'orgs', label: 'Organizations', icon: Building2, section: 'Platform' },
    { id: 'billing', label: 'Billing Center', icon: CreditCard, section: 'Platform' },
    { id: 'live', label: 'Global Live Feed', icon: Radio, section: 'Monitoring' },
    { id: 'ai', label: 'AI Insights', icon: Sparkles, section: 'Monitoring' },
    { id: 'settings', label: 'Settings', icon: Settings, section: 'System' },
  ],
  ORG_ADMIN: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Workspace' },
    { id: 'users', label: 'Users & Partners', icon: Users, section: 'Workspace' },
    { id: 'rules', label: 'Rules Engine', icon: ShieldAlert, section: 'Workspace' },
    { id: 'activity', label: 'Activity Logs', icon: Activity, section: 'Monitoring' },
    { id: 'ai', label: 'AI Insights', icon: Sparkles, section: 'Monitoring' },
    { id: 'reports', label: 'Reports', icon: FileBarChart, section: 'Monitoring' },
    { id: 'billing', label: 'Billing', icon: CreditCard, section: 'Account' },
    { id: 'extension', label: 'Extension', icon: Chrome, section: 'Account' },
  ],
  ACCOUNTABILITY_PARTNER: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Monitoring' },
    { id: 'live', label: 'Live Activity', icon: Radio, section: 'Monitoring' },
    { id: 'alerts', label: 'Alerts', icon: Bell, section: 'Monitoring' },
    { id: 'notes', label: 'Notes', icon: StickyNote, section: 'Monitoring' },
    { id: 'extension', label: 'Extension', icon: Chrome, section: 'Account' },
  ],
};

export const roleLabel: Record<Role, string> = {
  SUPER_ADMIN: 'Super Admin',
  ORG_ADMIN: 'Org Admin',
  ACCOUNTABILITY_PARTNER: 'Accountability Partner',
};

export const DEFAULT_PAGE = 'dashboard';

const PAGE_PATHS: Record<string, string> = {
  dashboard: '/dashboard',
  orgs: '/orgs',
  billing: '/billing',
  live: '/live',
  ai: '/ai',
  settings: '/settings',
  users: '/users',
  rules: '/rules',
  activity: '/activity',
  reports: '/reports',
  extension: '/extension',
  alerts: '/alerts',
  notes: '/notes',
};

export const PORTAL_PATHS = new Set(Object.values(PAGE_PATHS));

export function pageToPath(pageId: string): string {
  return PAGE_PATHS[pageId] ?? PAGE_PATHS.dashboard;
}

export function pathToPage(pathname: string): string {
  const entry = Object.entries(PAGE_PATHS).find(([, path]) => path === pathname);
  return entry?.[0] ?? DEFAULT_PAGE;
}

export function isPortalPath(pathname: string): boolean {
  return PORTAL_PATHS.has(pathname);
}

export function isPageAllowed(role: Role, pageId: string): boolean {
  return NAV[role].some((item) => item.id === pageId);
}
