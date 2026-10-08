# ISP Customer Portal & Management SaaS (JMWired) — PRD & Architecture Specification

**Date**: 2026-10-05  
**Author**: Antigravity & Engineering Team  
**Status**: Draft for User Review  

---

> **2026-10-08 implementation note:** The full interactive UI plan and audience-specific Fumadocs guides now have a preview implementation. The user's newer route decisions supersede /app/[orgSlug] and /super-admin: use /organization/[orgSlug] and /admin. Live installation, backend schemas, authentication, permission enforcement, AI, push, and router integration remain deferred. See [the current coverage ledger](../../plans/2026-10-08-spec-coverage.md). Phase checkboxes below describe production integration and are intentionally not marked complete by the UI preview.

## 1. Executive Summary & Problem Statement

Small, community-based Internet Service Providers (ISPs) in the Philippines (e.g., local fiber, wireless relay networks) typically track subscribers, billing, and operational expenses using manual monthly spreadsheets (such as `CLIENTLIST 2025.xlsx`). 

While effective at a micro scale, manual tracking causes:
1. **Inefficient Collection & Reconciliation**: Staff manually verify GCash/bank transfers, hunt down uncollected dues, and maintain separate monthly sheets.
2. **Support Friction**: Customers complain via SMS or Facebook Messenger, with no centralized ticket history or outage visibility.
3. **Lack of Multi-Area Organization**: When an operator expands to new barangays or municipalities, tracking disparate expenses, linemen, and revenue in a single spreadsheet becomes chaotic.
4. **Non-Techie Subscribers**: A large portion of subscribers are not tech-savvy. Forcing an app download or strict digital-only flow breaks operations.

### The Solution: JMWired Multi-Tenant ISP SaaS
A professional, modern SaaS platform built with **Next.js**, **Convex**, and **Better Auth**:
- **Multi-Tenant by Branch/Location**: Each service area or branch is an isolated **Organization** in Better Auth. Operators switch branches seamlessly.
- **Hybrid Subscriber Model**: Tech-savvy subscribers can use a self-service `/portal` (view dues, pay via QR, report outages), while non-techie subscribers are fully managed by staff via 1-click updates ("Mark Paid", manual notes, cash recording).
- **Financial Health at a Glance**: Automated monthly ledger matching the ISP's real workflow (`Total Clients`, `Total Paid`, `Collections`, `Expenses`, `Net Profit`).
- **Support & AI Copilot**: Ticket management with AI conversation summarization and 1-click suggested troubleshooting replies.
- **Platform Super Admin**: Platform controls, kill switches, AI keys, and tenant oversight.

---

## 2. User Personas & Roles

| Role | Context | Responsibilities & Capabilities |
| :--- | :--- | :--- |
| **Platform Super Admin** | Platform Owner (You) | Global system overview, tenant organization management, platform feature flags / kill switch, AI configuration and usage limits. |
| **Branch Owner / Admin** | ISP Business Operator | Manages specific branch organization (`/app/[orgSlug]`), views financial summary, configures branch QR codes, manages staff and expenses. |
| **Branch Staff / Cashier** | Office Staff / Billing | 1-click subscriber status updates ("Mark as Paid"), review uploaded payment proofs, log operational expenses. |
| **Lineman / Technician** | Field Crew | View and resolve assigned tickets (e.g. Red LOS modem light, line cut, fiber splicing). |
| **Subscriber (End-Customer)** | Household / Business | Optional self-service portal (`/portal`): check plan status, pay via QR, submit proof screenshot, report outages. |

---

## 3. System Architecture & Routing Model

We follow **Approach 1: URL-Scoped Staff Dashboards with Unified Customer Portal**.

```
┌─────────────────────────────────────────────────────────────────┐
│               Platform Super Admin (/super-admin)               │
│             Global overview, tenant orgs, AI configs             │
└─────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┴───────────────────────┐
        ▼                                               ▼
┌───────────────────────────────┐       ┌───────────────────────────────┐
│  Branch Org: "North Branch"   │       │  Branch Org: "South Branch"   │
│  Path: /app/north-branch/...  │       │  Path: /app/south-branch/...  │
├───────────────────────────────┤       ├───────────────────────────────┤
│ Better Auth Org Members:      │       │ Better Auth Org Members:      │
│  Owner, Admin, Billing, Tech  │       │  Owner, Admin, Billing, Tech  │
├───────────────────────────────┤       ├───────────────────────────────┤
│ Convex Data Scoped by OrgId:  │       │ Convex Data Scoped by OrgId:  │
│  - Subscribers & Bills        │       │  - Subscribers & Bills        │
│  - Expenses & Net Profit      │       │  - Expenses & Net Profit      │
│  - Support Tickets & Alerts   │       │  - Support Tickets & Alerts   │
└───────────────────────────────┘       └───────────────────────────────┘
                ▲                                       ▲
                │ (Auto-routed by Customer Record)      │
┌───────────────────────────────────────────────────────────────┐
│              Unified Subscriber Portal (/portal)              │
│       Subscribers log in; backend scopes to their branch      │
└───────────────────────────────────────────────────────────────┘
```

### Route Structure
- **Authentication & Onboarding**:
  - `/sign-in` — Unified login page with role-based post-login routing (Super Admin -> `/super-admin`, Staff -> `/app/[orgSlug]`, Customer -> `/portal`).
  - `/sign-up` — Registration for branch operators and staff.
  - `/forgot-password` — Request password reset email / link.
  - `/reset-password` — Set new password using secure recovery token.
  - `/activate?code=...` — Subscriber onboarding with an activation code (claims existing customer record).
  - `/join/[orgSlug]` — Public branch self-service installation/connection application.
- **Account & Security Settings**:
  - `/account` (accessible across all roles, with role-specific views):
    - Personal Profile: Name, email, role badge, connected branch.
    - Security: Change password with current password verification and option to revoke other active sessions.
    - Session Management: Active device indicators and secure 1-click sign out.
  - `/app/[orgSlug]/settings` — Branch Organization Settings:
    - Branch Profile: Name, slug, service areas, contact numbers.
    - Team Management: Invite staff members and assign roles (`admin`, `billing`, `technician`, `support`).
- **Branch Staff Dashboard (`/app/[orgSlug]`)**:
  - `/app/[orgSlug]/dashboard` — Monthly financial and subscriber summary.
  - `/app/[orgSlug]/customers` — Subscriber directory (with 1-click paid toggles and manual cash entry).
  - `/app/[orgSlug]/customers/new` — Add customer and generate activation code.
  - `/app/[orgSlug]/payments` — Payment verification queue for uploaded GCash/Maya proofs.
  - `/app/[orgSlug]/payments/settings` — Configure branch QR codes (GCash, Maya, Bank).
  - `/app/[orgSlug]/expenses` — Operational expense log & monthly categorization.
  - `/app/[orgSlug]/support` — Support ticket inbox with AI Copilot.
  - `/app/[orgSlug]/alerts` — Outage & maintenance broadcast announcements.
- **Subscriber Portal (`/portal`)**:
  - `/portal` — Plan details, current due amount, and active outage alerts.
  - `/portal/bills` — Payment instructions with branch QR code, reference number input, and screenshot upload.
  - `/portal/support` — Report an issue (No internet, Red LOS, Slow speed) and live chat.
  - `/portal/account` — Customer account & contact details matching connection info.
- **Super Admin (`/super-admin`)**:
  - `/super-admin/organizations` — List, create, and manage tenant organizations.
  - `/super-admin/system` — Platform kill switch, AI API configuration, and global audit logs.

---

## 4. Convex Data Schema Specification

Every tenant-specific table contains `organizationId: v.string()` and compound indexes for fast, isolated queries.

### 4.1 Better Auth & Tenant Isolation
- **Better Auth Tables**: Managed by `@convex-dev/better-auth` (`user`, `session`, `account`, `organization`, `member`, `invitation`).
- **Staff Access Control**: Helper `requireOrgStaff(ctx, orgSlug, allowedRoles)` checks if the user is an active member of the organization.

### 4.2 Subscribers (`customers`)
Derived directly from the ISP's real spreadsheet schema:
```typescript
customers: defineTable({
  organizationId: v.string(),
  userId: v.optional(v.string()),        // Linked Better Auth user (if registered on portal)
  accountNumber: v.string(),             // e.g. "JM-2025-001"
  name: v.string(),                      // e.g. "ABARQUEZ-15"
  type: v.union(v.literal("old"), v.literal("new")),
  phone: v.optional(v.string()),
  address: v.optional(v.string()),
  area: v.string(),                      // e.g. "Poblacion", "Brgy. San Jose"
  installationDate: v.optional(v.string()),
  planSpeed: v.string(),                 // e.g. "50 MBPS", "20 MBPS"
  planAmount: v.number(),                // e.g. 1000
  dueDay: v.number(),                    // Day of the month (e.g. 15, 30)
  status: v.union(
    v.literal("active"),
    v.literal("cut"),                    // Line cut / disconnected
    v.literal("pending_installation")
  ),
  notes: v.optional(v.string()),         // e.g. "LINE CUT. WALA PA PAMBAYAD"
  portalStatus: v.union(
    v.literal("unregistered"),
    v.literal("invited"),
    v.literal("activated")
  ),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_org_and_status", ["organizationId", "status"])
  .index("by_org_and_dueDay", ["organizationId", "dueDay"])
  .index("by_userId", ["userId"])
  .searchIndex("search_customers", {
    searchField: "name",
    filterFields: ["organizationId", "status", "area"],
  }),
```

### 4.3 Monthly Billing & Payment Verification
```typescript
bills: defineTable({
  organizationId: v.string(),
  customerId: v.id("customers"),
  month: v.string(),                     // "YYYY-MM", e.g. "2026-10"
  dueDate: v.string(),                   // "YYYY-MM-DD"
  amount: v.number(),                    // e.g. 1000
  status: v.union(
    v.literal("unpaid"),
    v.literal("pending_review"),         // Subscriber uploaded proof
    v.literal("paid"),
    v.literal("overdue")
  ),
  paidAt: v.optional(v.number()),
  paymentMethod: v.optional(v.string()), // "cash", "gcash", "maya", "bank"
  referenceNumber: v.optional(v.string()),
  proofAssetId: v.optional(v.id("_storage")),
  reviewedBy: v.optional(v.string()),    // Staff user ID who marked or approved
  notes: v.optional(v.string()),
})
  .index("by_org_and_month", ["organizationId", "month"])
  .index("by_org_and_status", ["organizationId", "status"])
  .index("by_customer_and_month", ["customerId", "month"]),

paymentDestinations: defineTable({
  organizationId: v.string(),
  method: v.union(v.literal("gcash"), v.literal("maya"), v.literal("bank")),
  accountName: v.string(),
  accountNumber: v.string(),
  qrStorageId: v.id("_storage"),
  instructions: v.optional(v.string()),
  enabled: v.boolean(),
}).index("by_org_and_enabled", ["organizationId", "enabled"]),
```

### 4.4 Operational Expenses (`expenses`)
Matches the branch expense ledger:
```typescript
expenses: defineTable({
  organizationId: v.string(),
  title: v.string(),                     // e.g. "PLDT Leased Line - Oct 2026"
  category: v.union(
    v.literal("internet"),               // Upstream bandwidth (PLDT, Converge, Globe)
    v.literal("electricity"),            // Towers & office power
    v.literal("labor"),                  // Linemen salaries / per-job
    v.literal("equipment"),              // Fiber cables, ONUs, routers
    v.literal("repairs"),                // Fiber splicing, ladder, fuel
    v.literal("fees"),                   // Barangay / pole attachment permits
    v.literal("other")
  ),
  amount: v.number(),
  date: v.string(),                      // "YYYY-MM-DD"
  payee: v.optional(v.string()),         // e.g. "PLDT Inc."
  notes: v.optional(v.string()),
  receiptStorageId: v.optional(v.id("_storage")),
  createdBy: v.string(),
  createdAt: v.number(),
})
  .index("by_org_and_date", ["organizationId", "date"])
  .index("by_org_and_category", ["organizationId", "category"]),
```

### 4.5 Support Tickets & AI Copilot
```typescript
supportTickets: defineTable({
  organizationId: v.string(),
  customerId: v.id("customers"),
  reference: v.string(),                 // e.g. "TICK-1024"
  category: v.union(
    v.literal("no_internet"),
    v.literal("los_red"),
    v.literal("slow_connection"),
    v.literal("billing"),
    v.literal("relocation"),
    v.literal("other")
  ),
  subject: v.string(),
  status: v.union(v.literal("open"), v.literal("in_progress"), v.literal("resolved")),
  priority: v.union(v.literal("normal"), v.literal("urgent")),
  assigneeId: v.optional(v.string()),
  aiSummary: v.optional(v.string()),     // Background AI summary of conversation
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_org_and_status", ["organizationId", "status"])
  .index("by_customer", ["customerId"]),

supportEntries: defineTable({
  ticketId: v.id("supportTickets"),
  visibility: v.union(v.literal("public"), v.literal("staff_only")),
  senderType: v.union(v.literal("customer"), v.literal("staff"), v.literal("ai")),
  senderId: v.string(),
  senderName: v.string(),
  body: v.string(),
  suggestedAction: v.optional(v.string()),
  createdAt: v.number(),
}).index("by_ticket", ["ticketId"]),
```

### 4.6 Super Admin Platform Config
```typescript
platformConfig: defineTable({
  key: v.string(),                       // e.g. "global_settings"
  maintenanceMode: v.boolean(),          // Global kill switch
  allowNewTenantRegistrations: v.boolean(),
  aiEnabled: v.boolean(),
  aiModel: v.string(),
  monthlyAiTokenCap: v.number(),
  updatedAt: v.number(),
  updatedBy: v.string(),
}).index("by_key", ["key"]),
```

---

## 5. Phased Implementation Roadmap

### **Phase 1: Multi-Tenant Foundation, Authentication & Account Settings**
- [ ] Configure Better Auth with `organization` and `admin` plugins in `packages/backend/convex/auth.ts`.
- [ ] Create multi-tenant helper functions: `requireOrgStaff(ctx, orgSlug, roles)` and `requireCustomer(ctx)`.
- [ ] Implement Authentication Pages & Flows:
  - Unified `/sign-in` page with role-based post-login redirection (Super Admin -> `/super-admin`, Staff -> `/app/[orgSlug]`, Subscriber -> `/portal`).
  - `/sign-up` page for branch owners and staff members.
  - `/forgot-password` and `/reset-password` token recovery flow.
  - `/activate` subscriber code redemption page.
- [ ] Implement Account & Security Settings Pages:
  - User Account Settings (`/account`) with profile details, change password (with session revocation option), and sign out.
  - Branch Organization Settings (`/app/[orgSlug]/settings`) for branch details, team invites, and role assignments (`admin`, `billing`, `technician`, `support`).
- [ ] Implement Core Application Layouts:
  - Branch Admin Shell (`/app/[orgSlug]`) with organization switcher and active branch context.
  - Unified Subscriber Portal Shell (`/portal`) with mobile-friendly bottom navigation.
  - Super Admin Shell (`/super-admin`).

### **Phase 2: Subscriber Directory & Quick Operations (Spreadsheet Modernization)**
- [ ] Implement `customers` Convex schema with fast search index and area/status filters.
- [ ] Build `/app/[orgSlug]/customers`:
  - Table view showing Client Name, Due Day, Plan Speed & Amount, Paid/Unpaid Status, and Notes.
  - 1-click quick action: "Mark as Paid (Cash/Manual)" without needing digital proof.
  - Add Subscriber modal + auto-generated **Activation Code** (optional for techie users).
  - Quick note editor (e.g. "Line cut", "Promised payment on 20th").
- [ ] Build `/activate` subscriber registration page for customers who want to claim their account.

### **Phase 3: Monthly Billing Ledger, QR Payments & Expenses**
- [ ] Implement `bills`, `paymentDestinations`, and `expenses` Convex tables.
- [ ] Build Monthly Dashboard Summary banner:
  - `TOTAL CLIENTS`, `TOTAL PAID`, `COLLECTIONS`, `EXPENSES`, `NET PROFIT`.
- [ ] Build Branch QR Settings (`/app/[orgSlug]/payments/settings`):
  - Upload GCash, Maya, and Bank QR code images to Convex storage.
- [ ] Build Subscriber Bill View (`/portal/bills`):
  - Card showing amount due and due date.
  - "Pay via QR" modal showing branch QR code, GCash reference number input, and screenshot upload.
- [ ] Build Staff Verification Queue (`/app/[orgSlug]/payments`):
  - Side-by-side view of uploaded GCash receipt, entered reference number, and 1-click Approve/Reject buttons.
- [ ] Build Branch Expenses Manager (`/app/[orgSlug]/expenses`):
  - Log operational expenses (PLDT upstream, electricity, linemen labor, equipment).
  - Monthly category breakdown chart.

### **Phase 4: Support Ticket System & AI Copilot**
- [ ] Implement `supportTickets` and `supportEntries` schema.
- [ ] Build Subscriber Issue Reporter (`/portal/support`):
  - 1-tap issue selector (No Internet, Red LOS Light on Modem, Slow Connection, Billing).
  - Live conversation screen between subscriber and staff.
- [ ] Build Staff Support Inbox (`/app/[orgSlug]/support`):
  - Ticket list with status (`open`, `in_progress`, `resolved`).
  - Conversation thread with toggle between Public Reply and Internal Staff Note.
  - **AI Copilot**:
    - Automatic ticket summarization for handovers.
    - 1-click response suggestions (e.g., standard fiber reboot instructions, dispatching lineman).
    - Configurable auto-responder for declared outages or off-hours.

### **Phase 5: Platform Super Admin Dashboard**
- [ ] Implement `platformConfig` schema and admin queries.
- [ ] Build Super Admin Dashboard (`/super-admin`):
  - Overview of all tenant branch organizations and active subscriber counts.
  - Platform Kill Switch / Maintenance Mode toggle.
  - AI Model and API configuration settings.

### **Phase 6: Push Notifications, Outage Broadcasts & Bandwidth Sync**
- [ ] Implement Web Push (VAPID) service worker for subscriber billing reminders and urgent outage notifications.
- [ ] Build Outage Broadcast Tool (`/app/[orgSlug]/alerts`):
  - Broadcast maintenance notices to all subscribers or specific areas/barangays.
  - Real-time alert banner on customer portal.
- [ ] Build HTTP Webhook (`/api/bandwidth-sync`) for periodic router/MikroTik data usage updates.

---

## 6. Verification & Quality Gates

Each phase requires verification before advancing:
1. **Code Standards**: Run `pnpm lint` and ensure 0 errors (`shadcn/no-raw-colors`, `shadcn/no-restyle`, valid Tailwind utilities).
2. **Multi-Tenant Security**: Verify that a user belonging to Branch A cannot view or manipulate data from Branch B.
3. **Database Integrity**: Verify Convex indexing on `organizationId` across all queries.
4. **Mobile Responsiveness**: Test `/portal` on mobile screen viewports (touch targets >= 44px, bottom navigation bar).
5. **No Regressions**: Verify existing auth tests and dev server remain healthy (`pnpm dev`).
