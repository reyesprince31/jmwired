# JMWired interactive portal mock

Approved scope: build mock UI now; use Better Auth admin and organization plugins when backend integration begins. Do not install or configure local auth yet.

## Design

- Organization workspaces represent service areas. Owner/admin/member roles match Better Auth organization membership; platform admin is a separate Better Auth admin role.
- Admin: overview, searchable customer directory, billing/payment review with screenshots, support inbox and simulated AI drafts, targeted announcements, organization creation and member management.
- Customer: connection and usage overview, QR payment instructions with screenshot submission, payment history, support conversation/history, announcements and notification preferences.
- Grayscale theme, square shadcn controls, clear typography, open metric rows, tables, restrained semantic status colors. Admin sidebar; customer top navigation and mobile navigation.
- Shared browser-only state connects customer and admin flows and persists demo data. Mock role switches are previews, not authorization. No gateway, real AI, router telemetry, push subscription, or auth calls.
- Future user-facing documentation belongs in apps/fumadocs. Document the intended content and integration boundaries without claiming production features.

## Implementation plan

**Goal:** Deliver a usable connected prototype for reviewing ISP workflows.

**Architecture:** Next.js pages share a mock state provider and existing UI primitives. A small pure transition function owns payment and ticket updates and organization scoping. Existing Convex/Better Auth setup remains available for later integration.

**Tech Stack:** Next.js, React, installed shadcn/Base UI controls, Lucide, localStorage.

1. Add fictional data, scoped state transitions, and one runnable regression check for payment approval, duplicate submissions, tenant isolation, and ticket visibility.
2. Build shared mock provider and UI helpers; replace starter home with the admin overview, preserve /dashboard as an alias, add /portal.
3. Implement admin navigation, customer forms, proof preview/review, support communication, simulated AI, announcement targeting, organization creation/members, and notification previews.
4. Add documentation outline and mock usage notes. Keep backend and existing user files untouched.
5. Run pnpm lint, web type checks, state regression checks, and desktop/mobile browser interaction verification.

## Verification ledger

Baseline: pnpm lint and web type checks pass.
