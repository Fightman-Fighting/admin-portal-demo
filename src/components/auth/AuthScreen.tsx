import React, { useState } from 'react';
import { usePlatform } from '@/contexts/PlatformContext';
import { DEMO_ACCOUNTS } from '@/lib/mockData';
import { Button } from '@/components/shared/Primitives';
import { Activity, ShieldCheck, ArrowRight, Eye } from 'lucide-react';

const AuthScreen: React.FC = () => {
  const { login, register } = usePlatform();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('demo');
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'login') {
      const res = login(email, password);
      if (!res.ok) setError(res.error || 'Login failed');
    } else {
      if (!name || !email || !org) { setError('All fields required'); return; }
      register(name, email, org);
    }
  };

  const quick = (em: string) => { login(em, 'demo'); };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex">
      {/* left brand panel */}
      <div className="relative hidden lg:flex w-1/2 flex-col justify-between overflow-hidden p-12 bg-gradient-to-br from-indigo-900 via-slate-950 to-slate-950">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400"><Activity className="h-5 w-5" /></div>
          <span className="text-xl font-bold tracking-tight">SentinelOps</span>
        </div>
        <div className="relative max-w-md space-y-6">
          <h1 className="text-4xl font-bold leading-tight">The accountability platform for high-performing teams.</h1>
          <p className="text-slate-400">Real-time activity monitoring, AI productivity insights, and a multi-tenant control plane - all in one command center.</p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[['6', 'Organizations'], ['142', 'Active users'], ['99.9%', 'Uptime']].map(([n, l]) => (
              <div key={l}><div className="text-2xl font-bold text-cyan-300">{n}</div><div className="text-xs text-slate-500">{l}</div></div>
            ))}
          </div>
        </div>
        <div className="relative flex items-center gap-2 text-xs text-slate-500"><ShieldCheck className="h-4 w-4" /> SOC 2 Type II · GDPR ready · End-to-end encrypted</div>
      </div>

      {/* form */}
      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400"><Activity className="h-5 w-5" /></div>
            <span className="text-lg font-bold">SentinelOps</span>
          </div>
          <h2 className="text-2xl font-bold">{mode === 'login' ? 'Welcome back' : 'Create your workspace'}</h2>
          <p className="mt-1 text-sm text-slate-400">{mode === 'login' ? 'Sign in to your control plane' : 'Spin up a new organization in seconds'}</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === 'register' && (
              <>
                <Field label="Full name" value={name} onChange={setName} placeholder="Jane Doe" />
                <Field label="Organization" value={org} onChange={setOrg} placeholder="Acme Inc" />
              </>
            )}
            <Field label="Email" value={email} onChange={setEmail} placeholder="you@company.com" type="email" />
            {mode === 'login' && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Password</label>
                <div className="relative">
                  <input value={password} onChange={(e) => setPassword(e.target.value)} type="text" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-indigo-500" placeholder="demo" />
                  <Eye className="absolute right-3 top-3 h-4 w-4 text-slate-500" />
                </div>
              </div>
            )}
            {error && <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-3 py-2 text-sm text-rose-400">{error}</div>}
            <Button type="submit" className="w-full py-2.5">{mode === 'login' ? 'Sign in' : 'Create workspace'} <ArrowRight className="h-4 w-4" /></Button>
          </form>

          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} className="mt-4 text-sm text-slate-400 hover:text-white">
            {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Sign in'}
          </button>

          <div className="mt-8">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Quick demo login</div>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((a) => (
                <button key={a.email} onClick={() => quick(a.email)} className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-left hover:border-indigo-500/50 hover:bg-white/[0.07] transition-colors">
                  <div><div className="text-sm font-medium">{a.label}</div><div className="text-xs text-slate-500">{a.role}</div></div>
                  <ArrowRight className="h-4 w-4 text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }> = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div>
    <label className="mb-1.5 block text-xs font-medium text-slate-400">{label}</label>
    <input value={value} onChange={(e) => onChange(e.target.value)} type={type} placeholder={placeholder} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-indigo-500" />
  </div>
);

export default AuthScreen;
