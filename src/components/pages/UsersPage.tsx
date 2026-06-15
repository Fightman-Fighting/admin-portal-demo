import React, { useState } from 'react';
import { usePlatform } from '@/contexts/PlatformContext';
import { Card, Badge, Button, StatusDot, Ring } from '@/components/shared/Primitives';
import { roleLabel } from '@/lib/nav';
import { Search, UserPlus, X } from 'lucide-react';

const UsersPage: React.FC<{ orgId: string }> = ({ orgId }) => {
  const { allUsers } = usePlatform();
  const [q, setQ] = useState('');
  const [invite, setInvite] = useState(false);
  const [invited, setInvited] = useState<string[]>([]);
  const orgUsers = allUsers.filter((u) => u.orgId === orgId && u.role !== 'SUPER_ADMIN');
  const partner = orgUsers.find((u) => u.id.startsWith('u_partner_'));
  const filtered = orgUsers.filter((u) => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-5">
      <Card className="p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 flex-1 min-w-48">
          <Search className="h-4 w-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users..." className="w-full bg-transparent text-sm outline-none text-slate-700 dark:text-slate-200" />
        </div>
        <Button onClick={() => setInvite(true)}><UserPlus className="h-4 w-4" /> Invite user</Button>
      </Card>

      {invited.length > 0 && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 text-sm text-emerald-600 dark:text-emerald-400">
          Invitation sent to {invited.join(', ')} — pending acceptance.
        </div>
      )}

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-slate-400 border-b border-slate-100 dark:border-white/5">
            <th className="px-5 py-3 font-medium">User</th><th className="py-3 font-medium">Role</th><th className="py-3 font-medium">Status</th><th className="py-3 font-medium">Productivity</th><th className="py-3 font-medium">Partner</th>
          </tr></thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-slate-50 dark:border-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3"><img src={u.avatar} className="h-9 w-9 rounded-full object-cover" alt="" /><div><div className="font-medium text-slate-900 dark:text-white">{u.name}</div><div className="text-[11px] text-slate-400">{u.email}</div></div></div>
                </td>
                <td className="py-3"><Badge className={u.id.startsWith('u_admin') ? 'text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20' : u.id.startsWith('u_partner') ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20' : 'text-slate-500 bg-slate-500/10 border-slate-500/20'}>{u.id.startsWith('u_admin') ? 'Org Admin' : u.id.startsWith('u_partner') ? 'Partner' : 'Member'}</Badge></td>
                <td className="py-3"><span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><StatusDot status={u.status} />{u.status}</span></td>
                <td className="py-3">{u.productivity > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden"><div className={`h-full rounded-full ${u.productivity > 70 ? 'bg-emerald-500' : u.productivity > 50 ? 'bg-amber-400' : 'bg-rose-500'}`} style={{ width: `${u.productivity}%` }} /></div>
                    <span className="text-xs text-slate-500">{u.productivity}</span>
                  </div>) : <span className="text-xs text-slate-400">—</span>}
                </td>
                <td className="py-3 text-xs text-slate-500">{u.id.startsWith('u_org') && partner ? partner.name : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {invite && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setInvite(false)}>
          <Card className="w-full max-w-md p-6" >
            <div className="flex items-center justify-between mb-4"><span className="font-semibold text-slate-900 dark:text-white">Invite user</span><button onClick={() => setInvite(false)}><X className="h-5 w-5 text-slate-400" /></button></div>
            <form onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); setInvited((p) => [...p, String(f.get('email'))]); setInvite(false); }} className="space-y-3">
              <input name="email" required type="email" placeholder="user@company.com" className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500" />
              <select name="role" className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200">
                <option>Member</option><option>Accountability Partner</option><option>Org Admin</option>
              </select>
              <Button type="submit" className="w-full">Send invitation</Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
