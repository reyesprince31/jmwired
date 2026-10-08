# jmwired

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Next.js, Convex, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Shared UI package** - shadcn/ui primitives live in `packages/ui`
- **Convex** - Reactive backend-as-a-service platform
- **Authentication** - Better-Auth
- **Oxlint** - Oxlint + Oxfmt (linting & formatting)
- **PWA** - Progressive Web App support
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

## Convex Setup

### Portal preview

The current web UI uses fictional browser-only data. Public marketing pages live at `/`, `/platform`, `/billing`, `/customer-portal`, `/support`, `/multi-location`, and `/about`. Organization operations use `/organization/[orgSlug]` (for example `/organization/poblacion`), super-admin management uses `/admin`, and the customer portal uses `/portal`. `/organization`, `/dashboard`, and old unscoped organization links open the selected workspace. `/admin/platform` redirects to `/admin`. Platform administration is accessed from the profile dropdown. Workspace selection and role choices do not enforce authentication yet.

Run `pnpm --filter web dev`, then open [the public site](http://127.0.0.1:3001), [the organization workspace](http://127.0.0.1:3001/organization), [super-admin management](http://127.0.0.1:3001/admin), or [the customer portal](http://127.0.0.1:3001/portal). The preview does not call Convex or Better Auth; the existing Varlock configuration still loads the app environment schema.

Try the monthly ledger and CSV export, cash collection, expense receipts and monthly profit, branch QR setup, screenshot review, assigned tickets and internal notes, outage reply automation, targeted announcements, installation applications and activation, account/recovery screens, and platform maintenance/AI settings. Organizations have separate records. Changes stay in this browser and synchronize across tabs; use **Restore sample data** to reset them. Passwords and AI key values are discarded. Device push, live account security, AI services, and router monitoring are not connected. These limitations are explained in **Workspace setup** and the help center's preview guide.

App Router files are thin page/layout wrappers. Feature UI lives under `apps/web/src/components/{customers,payments,support,announcements,organization,platform,account}`. Organization/customer shells live in `components/portal`, the super-admin shell lives in `components/platform`, and state lives in `components/workspace`. The `(marketing)` and `(workspace)` route groups keep public and product layouts separate without changing URL paths. Records and forms have dedicated routes, including `/organization/customers/[id]`, `/organization/payments/[id]`, `/organization/support/[id]`, `/organization/settings`, `/organization/new`, `/portal/payments/[id]`, and `/portal/support/[id]`.

Run the state regression check with `node --experimental-strip-types --test apps/web/src/lib/mock-data.test.mjs`. Run `pnpm lint` and `pnpm --filter web check-types` for code checks.

Local installation and live Better Auth admin/organization plugin integration are deferred. The existing Fumadocs app now contains 20 customer, staff, and platform guides with sidebar navigation and search. Run `pnpm --filter fumadocs dev` and open [JMWired Help Center](http://127.0.0.1:4001/docs). Port 4001 avoids another local project's documentation server. The documentation index is in [PORTAL-DOCUMENTATION.md](apps/fumadocs/PORTAL-DOCUMENTATION.md), and specification coverage is tracked in [the coverage ledger](docs/plans/2026-10-08-spec-coverage.md).

For live backend integration, set up Convex before replacing the mock provider:

```bash
pnpm run dev:setup
```

Follow the prompts to create a new Convex project and connect it to your application.

Copy environment variables from `packages/backend/.env.local` to `apps/*/.env`.

Then, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
Your app will connect to the Convex cloud backend automatically.

## UI Customization

React web apps in this stack share shadcn/ui primitives through `packages/ui`.

- Change design tokens and global styles in `packages/ui/src/styles/globals.css`
- Update shared primitives in `packages/ui/src/components/*`
- Adjust shadcn aliases or style config in `packages/ui/components.json` and `apps/web/components.json`

### Add more shared components

Run this from the project root to add more primitives to the shared UI package:

```bash
npx shadcn@latest add accordion dialog popover sheet table -c packages/ui
```

Import shared components like this:

```tsx
import { Button } from "@jmwired/ui/components/button";
```

### Add app-specific blocks

If you want to add app-specific blocks instead of shared primitives, run the shadcn CLI from `apps/web`.

## Environment Configuration

Each app owns its environment schema in `.env.schema`. Varlock generates `src/env.ts` during installation; run `pnpm run env:generate` after changing a schema. Commit schemas, and keep secrets in ignored env files or your deployment platform.

Import the generated `ENV` accessor in application code. Shared database and auth packages receive configuration or initialized clients from the application. See [Varlock's monorepo guide](https://varlock.dev/guides/monorepos/).

Bun's automatic env loading is disabled in `bunfig.toml`; the framework integration or server bootstrap loads Varlock. Node deployments must include Varlock and its dependencies alongside the app schema.

Run standalone Node/Bun tools that use Varlock from the owning app directory so they load that app's schema and env files. `env:generate` only generates TypeScript files; it does not initialize environment values in a subsequent command.

## Git Hooks and Formatting

- Run checks: `pnpm run check`

## Project Structure

```
jmwired/
├── apps/
│   ├── web/         # Frontend application (Next.js)
├── packages/
│   ├── ui/          # Shared shadcn/ui components and styles
│   ├── backend/     # Convex backend functions and schema
```

## Available Scripts

- `pnpm run dev`: Start all applications in development mode
- `pnpm run build`: Build all applications
- `pnpm run dev:web`: Start only the web application
- `pnpm run dev:setup`: Setup and configure your Convex project
- `pnpm run check-types`: Check TypeScript types across all apps
- `pnpm run check`: Run Oxlint and Oxfmt
- `cd apps/web && pnpm run generate-pwa-assets`: Generate PWA assets
