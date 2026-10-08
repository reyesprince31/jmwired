# ISP portal specification coverage

Baseline: docs/superpowers/specs/2026-10-05-isp-saas-portal-design.md. The latest user instructions take precedence: use /organization for branches, /admin for platform super admin, keep /portal for subscribers, and defer installation/live integrations.

## Visualized phases

| Spec phase                 | Interactive preview coverage                                                                                                                                                                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1: Foundation and accounts | Separate organization/customer/platform layouts; organization-slug URLs; branch creation/switching; owner/admin/member/billing/technician/support role selectors; sign-in/sign-up/recovery/reset/activation screens; profile, placeholder password flow, and device list |
| 2: Subscriber operations   | Search/status/area filters; subscriber details and notes; billing days; Active/Suspended/Pending installation; quick cash recording; installation date/type; optional activation codes and portal status                                                                 |
| 3: Billing and expenses    | Monthly clients/paid/collections/expenses/profit; filtered ledger/CSV; branch GCash/Maya/Bank destination and QR upload; customer proof submission/history; approve/reject/reviewer metadata; categorized expenses with receipt/edit/delete                              |
| 4: Support                 | Customer issue categories and history; staff inbox/status/priority/assignment/assignee filter; public replies/internal notes; template summaries/drafts; configurable outage or off-hours acknowledgements                                                               |
| 5: Platform                | Organization/user overview and roles; maintenance confirmation/customer maintenance page; registration controls; provider/model/token cap/key setup preview; browser audit events                                                                                        |
| 6: Alerts and usage        | Branch/area/customer announcements and outage resolution; in-app notification preferences and previews; saved usage/network page and router setup status                                                                                                                 |
| Installation applications  | Public /join/[orgSlug] form, contact consent, queue/review/contact/decline/approve, pending subscriber creation, activation flow                                                                                                                                         |
| User documentation         | 27 Fumadocs guides covering customers, branch teams, platform owners, access, shop inquiries, and preview limits                                                                                                                                                                         |

## Deliberate preview boundaries

No backend, authentication, role enforcement, email delivery, live password verification/session revocation, payment transfer, AI API calls/token enforcement, push delivery, bandwidth webhook, or router connection was installed. Passwords/API key values are discarded; only UI completion/configured status is saved. Browser records synchronize with last-writer-wins. The ledger uses current saved subscriber amounts rather than immutable historic bill snapshots. QR uploads show sample images during review.

The original backend schema/security roadmap and quality gates remain future integration work, not completed production phases. Custom staff roles will be implemented through Better Auth organization access control; platform roles through its admin plugin.

## Verification

State regression coverage includes payment validation/scoping/duplicates/review, expense totals and scope, last-day billing dates, private message projection, assignment validity, activation consumption, maintenance/registration, audit updates, existing-device preservation, and older snapshot migration. Browser verification covers connected UI flows, branch-specific links, mobile overflow, and documentation/search.
