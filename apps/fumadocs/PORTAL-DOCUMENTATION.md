# JMWired user documentation

The help center is implemented in the existing Fumadocs app. Run pnpm --filter fumadocs dev and open http://127.0.0.1:4001/docs. Port 4001 avoids another project using port 4000.

## Published preview guides

- General: welcome, account access/activation/recovery, new connection requests, and preview limitations.
- Customers: overview, usage/status explanations, billing/proof/history, support/status, updates, account/notifications/security, and troubleshooting.
- Branch teams: overview, setup, daily operations, subscribers/activation/notes, monthly billing and CSV, QR settings, expenses/receipts, assigned support/internal notes/automation, announcements, installation applications, organization/team roles, and a dedicated network reporting guide.
- Platform owners: overview, system/AI/maintenance/registration controls, audit log.

There are 26 MDX pages under content/docs with ordered navigation in meta.json files and the existing full-text search. Workspace help links open the matching audience section. Seventeen screenshots under public/help show current customer, branch, and platform workflows, including a mobile support conversation. Captures use an isolated browser with fictional sample records. Article instructions use the current labels, including the single top-right profile dropdown. Starter sample pages and developer-facing copy controls were removed.

## Editorial rules

Use the controls and names actually shown in the app. Keep customer instructions in plain language. Describe verification and rejection states. Keep production boundaries in the preview guide and in sensitive account/credential setup steps. Never describe preview workspace selection as authentication, template responses as live AI, or local device removal as real session revocation.

## Routes

Public pages remain at the web root. Branch operations use /organization/[orgSlug], customer workflows use /portal, and platform management uses /admin. Older unscoped organization links redirect into the selected branch. Account access pages use /sign-in, /sign-up, /forgot-password, /reset-password, /activate, and /join/[orgSlug].

## Before production publication

Replace local app/help URLs with deployed origins. Validate every guide after Better Auth/Convex integration; document enforced permissions, verified QR destinations, email activation/recovery, live push/device permissions, measured usage, AI policy, and actual session handling. Refresh the preview screenshots after those flows are finalized.
