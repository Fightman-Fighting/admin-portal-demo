# SentinelOps — Mock SaaS Admin Platform

A demo admin portal for **SentinelOps**, a multi-tenant accountability and productivity platform. The app simulates role-based access, live activity monitoring, AI insights, billing, and organization management using mock data only (no real backend).

Run locally:

```bash
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080).

---

## Demo access

Sign-in and registration are **disabled** for the demo. Use **Quick demo login** on the home page, or click your **avatar** in the top bar after logging in to switch roles instantly.

| Role | Demo account | Workspace |
|------|--------------|-----------|
| Super Admin | `super@platform.io` | Platform-wide (all organizations) |
| Org Admin | `admin@novalabs.dev` | Nova Labs |
| Accountability Partner | `partner@novalabs.dev` | Nova Labs (assigned users only) |

---

## Role overview

SentinelOps uses three roles in a hierarchy. Each role sees a different sidebar, dashboard, and data scope.

```
Platform
└── Super Admin          ← owns the entire SaaS control plane
    └── Organization     ← e.g. Nova Labs, Acme Corp
        ├── Org Admin    ← manages the org workspace
        └── Accountability Partner  ← monitors assigned team members
```

| | Super Admin | Org Admin | Accountability Partner |
|---|:---:|:---:|:---:|
| Scope | All organizations | One organization | Assigned users in one org |
| Manages billing (platform) | Yes | — | — |
| Manages org billing | — | Yes | — |
| Manages users & rules | — | Yes | — |
| Monitors live activity | Global | Org-wide | Assigned users only |
| AI insights | All orgs | Own org | — |
| Alerts & notes | — | — | Yes |

---

## Super Admin

**Who they are:** The platform owner or internal operator who runs the entire SentinelOps SaaS product across all customer organizations.

**Demo user:** Alex Rivera (`super@platform.io`)

**Primary goal:** Operate the control plane — revenue, subscriptions, tenant health, and cross-org monitoring.

### What they can do

- View **platform-wide metrics**: total organizations, users, active sessions, and monthly recurring revenue (MRR).
- Browse and manage **all organizations** (plans, seat usage, billing status, domains).
- Access the **Billing Center** for any tenant and simulate Stripe flows (plan changes, renewals, cancellations).
- Watch a **Global Live Feed** of browsing activity across every organization.
- Run **AI Insights** across users platform-wide.
- Configure **platform Settings** (profile, appearance, notifications).

### Portal pages

| Section | Page | Route |
|---------|------|-------|
| Platform | Dashboard | `/dashboard` |
| Platform | Organizations | `/orgs` |
| Platform | Billing Center | `/billing` |
| Monitoring | Global Live Feed | `/live` |
| Monitoring | AI Insights | `/ai` |
| System | Settings | `/settings` |

### Dashboard highlights

- Revenue and ARR charts
- Subscription mix (Free / Pro / Enterprise)
- Organization table with plan, seats, MRR, and status
- Embedded global live activity feed

---

## Org Admin

**Who they are:** The administrator of a single customer organization (workspace). They configure the org, manage team members, and enforce productivity policies.

**Demo user:** Nova Labs admin (`admin@novalabs.dev`)

**Primary goal:** Run day-to-day operations inside one organization — people, rules, activity, and org billing.

### What they can do

- Monitor **team metrics**: member count, who is online, active rules, and open alerts.
- Manage **Users & Partners** — view members, productivity scores, status, and invite users.
- Configure the **Rules Engine** — create and toggle browsing/productivity rules (e.g. limits on entertainment sites).
- Review **Activity Logs** for everyone in the organization.
- Generate **Reports** and use **AI Insights** scoped to their org.
- Manage **Billing** for their organization (plan, invoices, Stripe simulation).
- Access the browser **Extension** settings page.

### Portal pages

| Section | Page | Route |
|---------|------|-------|
| Workspace | Dashboard | `/dashboard` |
| Workspace | Users & Partners | `/users` |
| Workspace | Rules Engine | `/rules` |
| Monitoring | Activity Logs | `/activity` |
| Monitoring | AI Insights | `/ai` |
| Monitoring | Reports | `/reports` |
| Account | Billing | `/billing` |
| Account | Extension | `/extension` |

### Dashboard highlights

- Team productivity score and trend chart
- Org focus breakdown by activity category (work, dev, social, etc.)
- Team live feed
- Member list with productivity bars

### What they cannot do

- See or manage other organizations
- Access platform-wide billing or global live feed (Super Admin only)

---

## Accountability Partner

**Who they are:** A coach, manager, or mentor assigned to specific users. They focus on monitoring and accountability, not org administration.

**Demo user:** Nova Labs partner (`partner@novalabs.dev`)

**Primary goal:** Stay close to assigned team members — live activity, violations, alerts, and coaching notes.

### What they can do

- See **assigned users** only (not the full org roster).
- Track who is **browsing now** and view a **live activity feed** filtered to their assignments.
- Review **Alerts** for rule violations and threshold breaches on assigned users.
- Write and read **Notes** about assigned users (coaching context).
- Access the browser **Extension** page.

### Portal pages

| Section | Page | Route |
|---------|------|-------|
| Monitoring | Dashboard | `/dashboard` |
| Monitoring | Live Activity | `/live` |
| Monitoring | Alerts | `/alerts` |
| Monitoring | Notes | `/notes` |
| Account | Extension | `/extension` |

### Dashboard highlights

- Assigned user count, active browsers, and unread alerts
- Per-user live browsing status (e.g. “browsing github.com”)
- Assigned users activity feed
- Recent alerts with severity (high / medium / low)

### What they cannot do

- Invite users or change org settings
- Edit rules or billing
- View AI insights, reports, or activity logs for the whole org
- Access other organizations or platform admin tools

---

## Navigation & URLs

Each portal page has its own URL. Examples:

- `/` — Demo home (role picker)
- `/dashboard` — Role-specific dashboard
- `/orgs` — Organizations (Super Admin only)
- `/users` — Users & Partners (Org Admin only)
- `/alerts` — Alerts (Accountability Partner only)

If a role opens a URL they are not allowed to use, they are redirected to `/dashboard`.

**Logo / SentinelOps title** (sidebar) — returns to the demo home and signs you out.

---

## Tech stack

- React 18 + TypeScript
- Vite (dev server on port **8080**)
- React Router
- Tailwind CSS + shadcn/ui
- Mock data in `src/lib/mockData.ts` (no API)

---

## Project structure (roles-related)

| Path | Purpose |
|------|---------|
| `src/lib/nav.ts` | Sidebar pages and route guards per role |
| `src/lib/mockData.ts` | Demo accounts and seed users |
| `src/components/dashboards/` | Role-specific dashboard views |
| `src/components/Portal.tsx` | Page routing inside the authenticated portal |
| `src/contexts/PlatformContext.tsx` | Auth state, mock data, and `assignedMembers()` for partners |
