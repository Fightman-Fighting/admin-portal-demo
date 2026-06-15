import React, { useState } from 'react';
import { usePlatform } from '@/contexts/PlatformContext';
import { Card, Button } from '@/components/shared/Primitives';
import { roleLabel } from '@/lib/nav';
import { Settings as Cog, Moon, Sun, Bell, Shield, Check } from 'lucide-react';

const Settings: React.FC = () => {
  const { currentUser, dark, toggleDark } = usePlatform();
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState({ alerts: true, weekly: true, realtime: true });
  if (!currentUser) return null;

  return (
    <div className="max-w-3xl space-y-5">
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4"><Cog className="h-4 w-4 text-indigo-500" /><span className="font-semibold text-slate-900 dark:text-white">Profile</span></div>
        <div className="flex items-center gap-4">
          <img src={currentUser.avatar} className="h-16 w-16 rounded-full object-cover ring-2 ring-indigo-500/30" alt="" />
          <div className="grid sm:grid-cols-2 gap-3 flex-1">
            <Info label="Name" value={currentUser.name} />
            <Info label="Email" value={currentUser.email} />
            <Info label="Role" value={roleLabel[currentUser.role]} />
            <Info label="Workspace" value={currentUser.orgId === '*' ? 'Platform' : currentUser.orgId} />
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4"><Sun className="h-4 w-4 text-amber-500" /><span className="font-semibold text-slate-900 dark:text-white">Appearance</span></div>
        <div className="flex items-center justify-between">
          <div><div className="text-sm font-medium text-slate-900 dark:text-white">Dark mode</div><div className="text-xs text-slate-400">Toggle the interface theme</div></div>
          <button onClick={toggleDark} className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5">
            {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}{dark ? 'Dark' : 'Light'}
          </button>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4"><Bell className="h-4 w-4 text-rose-500" /><span className="font-semibold text-slate-900 dark:text-white">Notifications</span></div>
        <div className="space-y-3">
          {([['alerts', 'Real-time violation alerts'], ['weekly', 'Weekly AI summary emails'], ['realtime', 'Live feed push updates']] as const).map(([k, l]) => (
            <div key={k} className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-300">{l}</span>
              <button onClick={() => setPrefs((p) => ({ ...p, [k]: !p[k] }))} className={`relative h-6 w-11 rounded-full transition-colors ${prefs[k] ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-white/10'}`}>
                <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all" style={{ left: prefs[k] ? '22px' : '2px' }} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3"><Shield className="h-4 w-4 text-emerald-500" /><span className="font-semibold text-slate-900 dark:text-white">Security</span></div>
        <p className="text-sm text-slate-400 mb-3">Two-factor authentication and SSO are enforced at the organization level.</p>
        <Button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>{saved ? <Check className="h-4 w-4" /> : null}{saved ? 'Saved' : 'Save changes'}</Button>
      </Card>
    </div>
  );
};

const Info: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div><div className="text-[11px] text-slate-400">{label}</div><div className="text-sm font-medium text-slate-900 dark:text-white truncate">{value}</div></div>
);

export default Settings;
