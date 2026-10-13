---
name: isp-saas-template
description: Use when bootstrapping a new multi-tenant ISP SaaS, local telecom management system, or starting a new project from the JMWired GitHub boilerplate template.
---

# ISP SaaS Boilerplate & Template Starter

## Overview

A complete blueprint for launching a multi-tenant Internet Service Provider (ISP) operations and customer SaaS platform built with Next.js App Router, Turborepo, Convex, Better Auth, and shadcn/ui.

## When to Use

- Creating a new community ISP management system (fiber rollouts, wireless relay networks, barangay/municipal providers).
- Bootstrapping a new repository using `reyesprince31/jmwired` as a GitHub template.
- Rebranding and customizing the JMWired boilerplate for another ISP brand, service area, currency, or pricing model.
- Setting up the hybrid subscriber model (staff-managed cash/offline accounts + self-service digital subscriber portal).

### When NOT to Use

- Single-page static marketing sites with no subscription or billing workflows.
- Single-tenant apps with no organization/branch boundaries.

---

## Monorepo Architecture

```
jmwired/
├── apps/
│   ├── web/                    # Main Next.js App Router application
│   │   ├── src/app/
│   │   │   ├── (marketing)/    # Public pages: /, /plans, /coverage, /shop, /about, /sitemap
│   │   │   └── (workspace)/    # Scoped operations: /organization/[orgSlug], /portal, /admin
│   │   ├── src/components/     # UI feature modules (customers, payments, support, portal)
│   │   └── src/lib/            # Central domain data (site.ts, plans-data.ts, coverage-data.ts)
│   └── fumadocs/               # Built-in help center and documentation portal
├── packages/
│   ├── backend/                # Convex schema, mutations, queries, Better-Auth components
│   ├── ui/                     # Design system primitives (Tailwind CSS v4 + @shadcn/lint)
│   └── config/                 # Shared TypeScript and tooling configs
```

---

## Quickstart: New Project from Template

### 1. Initialize Repository

```bash
# Using GitHub CLI
gh repo create my-new-isp --template reyesprince31/jmwired --public --clone
cd my-new-isp

# Install dependencies
pnpm install
```

---

### 2. Configure Brand & Production Domain

Update the canonical domain in two locations:

1. **`apps/web/.env.schema`**:
   ```ini
   SITE_URL=https://my-isp-domain.com
   ```
2. **`apps/web/src/lib/site.ts`**:
   ```typescript
   export const siteUrl = new URL(
     ENV.SITE_URL && ENV.SITE_URL !== "http://127.0.0.1:3001"
       ? ENV.SITE_URL
       : process.env.NODE_ENV === "production"
         ? "https://my-isp-domain.com"
         : (ENV.SITE_URL ?? "http://127.0.0.1:3001"),
   ).origin;
   ```

---

### 3. Customize Internet Plans & Pricing (`apps/web/src/lib/plans-data.ts`)

Define your residential and commercial fiber packages:

```typescript
export const residentialPlans: PlanTier[] = [
  {
    id: "home-35",
    name: "Home Fiber 35",
    category: "residential",
    speed: 35,
    price: 999,
    badge: "Starter",
    tagline: "Essential connectivity for small households",
    description: "Reliable fiber for everyday schooling and HD streaming.",
    idealFor: "1 to 4 devices, online classes, messaging",
    features: [
      "35 Mbps symmetric upload and download",
      "Unlimited data with zero caps or throttling",
      "Dual-band Wi-Fi ONU modem included",
      "Free standard installation (12-month lock-in)",
    ],
    specs: { ... },
    ctaText: "Apply for Home 35",
    ctaHref: "/join/poblacion?plan=35" as Route,
  },
  // Add additional tiers...
];
```

---

### 4. Customize Service Areas & Coverage (`apps/web/src/lib/coverage-data.ts`)

Define active barangays/zones and physical branch service centers:

```typescript
export const coverageAreas: CoverageArea[] = [
  {
    id: "zone-1",
    name: "Barangay Central",
    municipality: "North District",
    status: "active", // "active" | "expanding" | "survey"
    statusLabel: "Active Fiber Coverage",
    portsAvailable: true,
    estInstallTime: "24–48 hours",
    branchOrgId: "poblacion",
    branchName: "Central Office",
    streets: ["Main Avenue", "Market Street"],
    notes: "Active NAP boxes ready for aerial drop cabling.",
  },
];

export const branchOffices: BranchOffice[] = [
  {
    id: "office-1",
    name: "Central Branch Office",
    area: "Poblacion",
    address: "123 Main Street",
    landmark: "Beside Municipal Hall",
    phone: "0917-000-0000",
    hours: "Mon–Sat 8:00 AM – 5:00 PM",
    services: ["Bill payments", "ONU replacements", "Applications"],
    orgId: "poblacion",
  },
];
```

---

### 5. Customize Equipment & Services Catalog (`apps/web/src/lib/shop-data.ts`)

Update local inventory and services offered (e.g. routers, patch cables, CCTV cameras, installation assistance).

---

### 6. Workspace Routing Architecture

| Route Pattern | Audience | Purpose |
| :--- | :--- | :--- |
| `/(marketing)/*` | Public / Prospective | Landing page, `/plans`, `/coverage`, `/shop`, `/billing`, `/support`, `/sitemap` |
| `/organization/[orgSlug]/*` | Branch Staff | Customer register, payment review queue, ledger, expenses, announcements |
| `/portal/*` | Subscribers | Current bill, GCash/Maya proof upload, ticket submission, area notices |
| `/admin/*` | Super Admin | Platform health, AI token limits, organization creation, system kill-switch |
| `/(access)/*` | Onboarding | `/sign-in`, `/sign-up`, `/activate`, `/join/[orgSlug]` (public application form) |

---

## Design System & Styling Rules

This template enforces `@shadcn/lint` in `apps/web`:

1. **No Raw Colors**: Use semantic theme tokens (`text-primary`, `text-muted-foreground`, `text-success`, `text-destructive`, `border`, `bg-card`). Never use ad-hoc palette colors like `text-red-500` or `bg-blue-600`.
2. **No Restyling**: Use component variants and size props (`variant="outline"`, `size="touch"`). Do not add override classes to `@jmwired/ui` components.
3. **No Inline Styles**: Use Tailwind classes instead of `style={{ ... }}`.
4. **Standard Spacing**: Use layout tokens (`p-4`, `p-6`, `gap-4`, `max-w-7xl`). Avoid arbitrary classes like `p-[13px]`.

---

## Verification Commands

Always run these verification commands before committing or deploying:

```bash
# 1. Monorepo code linting (Oxlint + @shadcn/lint rules)
pnpm lint

# 2. TypeScript compilation across all packages
pnpm check-types

# 3. Turborepo production build
pnpm build

# 4. State regression & mock data tests
node --experimental-strip-types --test apps/web/src/lib/mock-data.test.mjs
```

---

## Connecting Live Convex & Better Auth

When transitioning from the interactive mock state to live databases:
1. Initialize Convex project: `pnpm run dev:setup -F @jmwired/backend`
2. Configure Better Auth with the Organization plugin for branch scoping.
3. Replace `WorkspaceProvider` mock state with Convex `useQuery` / `useMutation` hooks scoped by `orgId`.
