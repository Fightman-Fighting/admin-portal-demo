import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePlatform } from '@/contexts/PlatformContext';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { NAV, pageToPath, pathToPage } from '@/lib/nav';
import SuperAdminDashboard from '@/components/dashboards/SuperAdminDashboard';
import OrgAdminDashboard from '@/components/dashboards/OrgAdminDashboard';
import PartnerDashboard from '@/components/dashboards/PartnerDashboard';
import Organizations from '@/components/pages/Organizations';
import BillingCenter from '@/components/pages/BillingCenter';
import AIInsights from '@/components/pages/AIInsights';
import UsersPage from '@/components/pages/UsersPage';
import RulesEngine from '@/components/pages/RulesEngine';
import ActivityLogs from '@/components/pages/ActivityLogs';
import Reports from '@/components/pages/Reports';
import ExtensionPopup from '@/components/pages/ExtensionPopup';
import { AlertsPage, NotesPage } from '@/components/pages/AlertsNotes';
import Settings from '@/components/pages/Settings';
import LiveFeed from '@/components/shared/LiveFeed';

const Portal: React.FC = () => {
  const { currentUser, assignedMembers } = usePlatform();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const page = pathToPage(location.pathname);
  if (!currentUser) return null;
  const orgId = currentUser.orgId;
  const goto = (p: string) => navigate(pageToPath(p));
  const navItem = NAV[currentUser.role].find((n) => n.id === page);
  const title = navItem?.label || 'Dashboard';

  const render = () => {
    const role = currentUser.role;
    if (page === 'dashboard') {
      if (role === 'SUPER_ADMIN') return <SuperAdminDashboard goto={goto} />;
      if (role === 'ORG_ADMIN') return <OrgAdminDashboard orgId={orgId} goto={goto} />;
      return <PartnerDashboard goto={goto} />;
    }
    if (page === 'orgs') return <Organizations goto={goto} />;
    if (page === 'billing') return <BillingCenter orgScope={role === 'SUPER_ADMIN' ? undefined : orgId} />;
    if (page === 'ai') return <AIInsights orgScope={role === 'SUPER_ADMIN' ? undefined : orgId} />;
    if (page === 'users') return <UsersPage orgId={orgId} />;
    if (page === 'rules') return <RulesEngine orgId={orgId} />;
    if (page === 'activity') return <ActivityLogs orgId={role === 'SUPER_ADMIN' ? undefined : orgId} />;
    if (page === 'reports') return <Reports orgId={orgId} />;
    if (page === 'extension') return <ExtensionPopup />;
    if (page === 'alerts') return <AlertsPage orgId={orgId} />;
    if (page === 'notes') return <NotesPage orgId={orgId} />;
    if (page === 'settings') return <Settings />;
    if (page === 'live') {
      if (role === 'SUPER_ADMIN') return <LiveFeed limit={30} title="Global Live Feed" />;
      const ids = assignedMembers(currentUser.id).map((u) => u.id);
      return <LiveFeed userIds={ids} limit={30} title="Live Activity" />;
    }
    return <div className="text-slate-400">Coming soon</div>;
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar page={page} goto={goto} open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenu={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 p-4 sm:p-6">{render()}</main>
      </div>
    </div>
  );
};

export default Portal;
