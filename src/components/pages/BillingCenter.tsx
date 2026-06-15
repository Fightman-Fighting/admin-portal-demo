import React, { useState } from 'react';
import { usePlatform } from '@/contexts/PlatformContext';
import { Card, Badge, Button, statusBadge } from '@/components/shared/Primitives';
import { PLANS } from '@/lib/mockData';
import { money, ago } from '@/lib/ui';
import { PlanId } from '@/lib/types';
import { CreditCard, Check, Zap, RefreshCw, XCircle, Terminal } from 'lucide-react';

const BillingCenter: React.FC<{ orgScope?: string }> = ({ orgScope }) => {
  const { orgs, subscriptions, invoices, changePlan, simulatePaymentSuccess, simulateRenewal, cancelSubscription } = usePlatform();
  const scopedOrgs = orgScope ? orgs.filter((o) => o.id === orgScope) : orgs;
  const [selectedOrg, setSelectedOrg] = useState(orgScope || orgs[0]?.id);
  const [log, setLog] = useState<string[]>(['$ stripe listen --forward-to /api/billing/webhook', 'Ready! Waiting for events...']);
  const [pendingSession, setPendingSession] = useState<string | null>(null);

  const sub = subscriptions.find((s) => s.orgId === selectedOrg);
  const org = orgs.find((o) => o.id === selectedOrg);
  const scopedInvoices = invoices.filter((i) => !orgScope || i.orgId === orgScope);

  const addLog = (l: string) => setLog((p) => [...p.slice(-8), l]);

  const handleCheckout = (plan: PlanId) => {
    const sid = changePlan(selectedOrg!, plan);
    setPendingSession(sid);
    addLog(`POST /v1/checkout/sessions → ${sid}`);
    addLog(`checkout.session.created · plan=${plan} status=trialing`);
  };
  const handleSuccess = () => {
    simulatePaymentSuccess(selectedOrg!);
    addLog(`✔ checkout.session.completed`);
    addLog(`✔ invoice.payment_succeeded · ${money(sub?.amount || 0)}`);
    setPendingSession(null);
  };
  const handleRenew = () => { simulateRenewal(selectedOrg!); addLog('✔ invoice.payment_succeeded (renewal)'); };
  const handleCancel = () => { cancelSubscription(selectedOrg!); addLog('customer.subscription.deleted'); };

  return (
    <div className="space-y-5">
      {!orgScope && (
        <Card className="p-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-slate-500">Organization:</span>
          <select value={selectedOrg} onChange={(e) => setSelectedOrg(e.target.value)} className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200">
            {orgs.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
          {sub && <Badge className={statusBadge(sub.status)}>{sub.status.replace('_', ' ')}</Badge>}
        </Card>
      )}

      {/* current sub */}
      {org && sub && (
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-500/10 text-indigo-500"><CreditCard className="h-5 w-5" /></div>
              <div>
                <div className="text-sm text-slate-400">Current subscription · {org.name}</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white capitalize">{sub.plan} · {money(sub.amount)}/mo</div>
                <div className="text-xs text-slate-400">Renews {sub.currentPeriodEnd}</div>
              </div>
            </div>
            <Badge className={statusBadge(sub.status)}>{sub.status.replace('_', ' ')}</Badge>
          </div>
        </Card>
      )}

      {/* plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((p) => {
          const isCurrent = sub?.plan === p.id;
          return (
            <Card key={p.id} className={`p-5 relative ${p.highlight ? 'ring-2 ring-indigo-500' : ''}`}>
              {p.highlight && <span className="absolute -top-2.5 left-5 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold text-white">POPULAR</span>}
              <div className="flex items-center gap-2 text-slate-900 dark:text-white"><Zap className="h-4 w-4 text-indigo-500" /><span className="font-semibold">{p.name}</span></div>
              <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{money(p.price)}<span className="text-sm font-normal text-slate-400">/mo</span></div>
              <ul className="mt-4 space-y-2">
                {p.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Check className="h-4 w-4 text-emerald-500 shrink-0" />{f}</li>)}
              </ul>
              <Button onClick={() => handleCheckout(p.id)} disabled={isCurrent} variant={p.highlight ? 'primary' : 'outline'} className="mt-5 w-full">
                {isCurrent ? 'Current plan' : 'Create Checkout Session'}
              </Button>
            </Card>
          );
        })}
      </div>

      {/* stripe simulation panel */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4"><Terminal className="h-4 w-4 text-indigo-500" /><span className="font-semibold text-slate-900 dark:text-white">Stripe Simulation Panel</span><Badge className="text-slate-500 bg-slate-500/10 border-slate-500/20">test mode</Badge></div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            {pendingSession && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-600 dark:text-amber-400">
                Pending checkout session: <code className="font-mono">{pendingSession}</code>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSuccess} variant="primary"><Check className="h-4 w-4" /> Simulate Payment Success</Button>
              <Button onClick={handleRenew} variant="outline"><RefreshCw className="h-4 w-4" /> Simulate Renewal</Button>
              <Button onClick={handleCancel} variant="danger"><XCircle className="h-4 w-4" /> Cancel Subscription</Button>
            </div>
            <p className="text-xs text-slate-400">These actions trigger mock Stripe webhook events that update subscription status, generate invoices, and emit billing notifications across the platform.</p>
          </div>
          <div className="rounded-lg bg-slate-950 border border-white/10 p-3 font-mono text-xs text-emerald-400 h-44 overflow-y-auto">
            {log.map((l, i) => <div key={i} className="whitespace-pre-wrap">{l}</div>)}
          </div>
        </div>
      </Card>

      {/* invoices */}
      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 dark:border-white/10 px-5 py-3.5 font-semibold text-slate-900 dark:text-white">Billing History</div>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-slate-400 border-b border-slate-100 dark:border-white/5">
            <th className="px-5 py-2.5 font-medium">Invoice</th><th className="py-2.5 font-medium">Organization</th><th className="py-2.5 font-medium">Plan</th><th className="py-2.5 font-medium">Amount</th><th className="py-2.5 font-medium">Date</th><th className="py-2.5 font-medium">Status</th>
          </tr></thead>
          <tbody>
            {scopedInvoices.map((iv) => (
              <tr key={iv.id} className="border-b border-slate-50 dark:border-white/[0.03]">
                <td className="px-5 py-3 font-mono text-xs text-slate-500">{iv.id}</td>
                <td className="py-3 text-slate-600 dark:text-slate-300">{orgs.find((o) => o.id === iv.orgId)?.name}</td>
                <td className="py-3 capitalize text-slate-600 dark:text-slate-300">{iv.plan}</td>
                <td className="py-3 font-medium text-slate-900 dark:text-white">{money(iv.amount)}</td>
                <td className="py-3 text-slate-500">{iv.date}</td>
                <td className="py-3"><Badge className={statusBadge(iv.status)}>{iv.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default BillingCenter;
