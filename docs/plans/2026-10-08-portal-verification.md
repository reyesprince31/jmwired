# Portal mock verification

## Result

The public site occupies `/`, `/platform`, `/billing`, `/customer-portal`, `/support`, `/multi-location`, and `/about`. Organization workspaces use `/organization/[orgSlug]`; unscoped links and `/dashboard` open the selected branch. Super-admin management lives at `/admin`; customers use `/portal`. Separate layouts and the profile dropdown preserve that distinction. The preview includes custom billing, technician, and support role choices alongside owner/admin/member. Local installation and live Better Auth/Convex authorization are deferred as requested. The original specification's remaining UI flows are covered in `2026-10-08-spec-coverage.md`, and 26 Fumadocs guides run at `http://127.0.0.1:4001/docs`.

## Functional checks

The route restructure follows Nildyan's feature folders and thin App Router wrappers. Browser checks cover 25 page routes, customer/payment/ticket detail refresh, Back/Forward, screenshot upload and approval, cross-tab support replies, resolved tickets, customer-targeted announcements, organization isolation, and newly created organization/customer pages. The first customer of an empty organization becomes the selected portal account automatically. Browser console errors and page errors are checked. Missing records show a scoped recovery page rather than a different customer's record.

- `pnpm lint`: passes.
- `pnpm --filter web check-types`: passes after Next.js route type generation.
- `pnpm --filter @jmwired/ui check-types`: passes.
- `apps/web/scripts/navigation.check.mjs`: passes with installed Edge; checks scoped organization navigation, private notes and customer notifications, ticket assignment, expense receipts, ledger cash/export, QR setup/customer display, application approval/activation, area outage acknowledgement, platform maintenance/AI controls, account recovery/devices, mobile overflow, and the original 20 guides with documentation search without browser errors.
- `node --experimental-strip-types --test apps/web/src/lib/mock-data.test.mjs`: one passing regression check covering payments, amount/duplicate/scope checks, private message projection, assignment, last-day due dates, expenses/profit/scoping, one-time activation, maintenance/registration, audit records, session preservation, and legacy snapshot defaults.
- Help center refresh: all 26 articles, 26 internal destinations, screenshot loading, search queries, and desktop/mobile layouts pass a dedicated browser check without errors.
- `pnpm --filter fumadocs types:check`: passes; user-facing guides use the existing Fumadocs macro source and search.
- Playwright with installed Edge: organization isolation, payment screenshot upload and preview, approval and rejection, customer ticket creation/replies/history, AI summary/draft/send simulation, targeted outage visibility, notification preferences/previews, cross-tab announcement updates, member invitations, organization/customer creation, reload persistence, and platform role edits all pass.
- Responsive checks: 1536×1024 desktop plus widths 390, 768, and 1280. No page overflow or browser page errors. Mobile payment screenshot submission passes; native dialog Escape handling passes.

The built-in browser runtime repeatedly failed to start, so verification used the bundled Playwright library with installed Edge. Another app owned localhost's IPv6 port 3001; the correct preview is `http://127.0.0.1:3001`. Next.js requires that hostname in `allowedDevOrigins` for working hydration/HMR.

## Visual references and evidence

Built-in Image Generation produced the admin and customer design references from briefs for complete readable grayscale dashboard screens, square shadcn controls, organization switching, metrics, charts, payment review, support activity, QR billing, usage, maintenance alerts, and notification controls.

- Admin concept: `C:/Users/reyes/.codex/generated_images/01a11930-be56-7192-a8e0-6c6c886772d2/exec-0badf0ec-acef-4fd1-b969-3a26990680fb.png`
- Customer concept: `C:/Users/reyes/.codex/generated_images/01a11930-be56-7192-a8e0-6c6c886772d2/exec-9aea7ba2-e365-4564-8e79-fd5fe1fad487.png`
- Browser screenshots: `C:/Users/reyes/.codex/visualizations/2026/10/08/01a11930-be56-7192-a8e0-6c6c886772d2/` contains `admin-desktop.png`, `customer-desktop.png`, `admin-mobile.png`, `customer-mobile.png`, and `payment-mobile.png`.
- Both concepts and the latest browser screenshots were inspected with `view_image`. Desktop screenshots use the concepts' native 1536×1024 viewport, with full-page capture to include the remaining content.

| Comparison                    | Result / adjustment                                                                                                                                                                                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Layout                        | Admin sidebar and open metric row; chart/network panels and review table; customer top navigation, plan band, bill/usage panels, maintenance strip, support/updates, and notification preference strip preserved.                                                        |
| Typography                    | Geist, clear heading hierarchy, deliberate control sizes. Customer greeting and balance enlarged after initial comparison; chart labels moved outside SVG to remain readable on mobile.                                                                                  |
| Palette                       | Pure white main surfaces, semantic muted/sidebar tokens, near-black controls, and restrained semantic status colors. No raw Tailwind palette colors or ad-hoc shadcn restyling.                                                                                          |
| Components                    | Existing square shadcn controls reused. Shared touch button and comfortable input variants provide larger customer targets. Native dialogs handle focus, Escape, constrained height, and scrolling.                                                                      |
| Icons                         | Installed Lucide outline icons used consistently for network, notifications, QR, support, and navigation.                                                                                                                                                                |
| Spacing / responsive behavior | Chart height and dashboard gaps reduced after visual comparison. Mobile tables scroll locally; an absolutely positioned screen-reader label was contained to fix page overflow. Mobile dialog margins and customer bottom navigation verified.                           |
| Assets / interactions         | Code-native charts and controls; payment images load and open for review. Marketing pages use actual workspace screenshots and generated neighborhood/office photography; product controls remain interactive components. Collection QR destinations are awaiting setup. |

## Copy audit and deliberate differences

The heading, navigation, key actions, and primary task copy follow the reference briefs. Collections derive from sample records (₱5,695), Paolo/Luis start in review so Maria can demonstrate a fresh submission, and network status shows the selected organization. Routine screens no longer carry mock/demo/simulated labels. Storage and integration limits are described in Workspace setup; the QR payment form explains that collection codes await setup. Existing component geometry and practical page scrolling take precedence over exact raster pixel spacing.

The implementation was checked against the visual direction for copy, layout, typography, palette, controls, icons, spacing, assets, and responsive behavior. It is a functional prototype with these documented differences, not a claim of exact pixel identity to the generated images.

## Deferred integration

No new dependencies were installed. Real authentication/permission enforcement, organization-scoped Convex data and storage, payment collection QR destinations, router telemetry, push delivery, and actual AI calls remain future integration work. Browser demo snapshots use last-writer-wins across tabs; Convex mutations should replace them for concurrent production edits. The future user-facing content outline is in `apps/fumadocs/PORTAL-DOCUMENTATION.md`.
