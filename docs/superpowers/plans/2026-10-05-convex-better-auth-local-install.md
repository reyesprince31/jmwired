# Convex + Better Auth Local Install Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate Convex + Better Auth in `@jmwired/backend` to a local component installation in `packages/backend/convex/betterAuth/`.

**Architecture:** Create a locally defined Convex component named `betterAuth`, generate its schema using Better Auth CLI, expose adapter functions, and configure the main Convex app and client to use the local schema and component.

**Tech Stack:** Convex, Better Auth (`better-auth`, `@convex-dev/better-auth`), TypeScript, pnpm monorepo.

## Global Constraints

- Target paths: `packages/backend/convex/...`
- Monorepo package: `@jmwired/backend`
- Node/pnpm monorepo commands executed with proper working directory or filter (`pnpm --filter @jmwired/backend ...`)
- Maintain complete backwards compatibility for existing auth consumers (`http.ts`, `privateData.ts`, `polar.ts`, Next.js app)

---

### Task 1: Define Local Component and Split Auth Options

**Files:**

- Create: `packages/backend/convex/betterAuth/convex.config.ts`
- Modify: `packages/backend/convex/auth.ts:1-40`

**Interfaces:**

- Consumes: Existing Better Auth configuration in `packages/backend/convex/auth.ts`
- Produces:
  - `packages/backend/convex/betterAuth/convex.config.ts`: default export `defineComponent("betterAuth")`
  - `packages/backend/convex/auth.ts`: exports `createAuthOptions(ctx: GenericCtx<DataModel>): BetterAuthOptions` and `createAuth(ctx: GenericCtx<DataModel>)`

- [ ] **Step 1: Create `convex/betterAuth/convex.config.ts`**

Write the component definition:

```ts
import { defineComponent } from "convex/server";

const component = defineComponent("betterAuth");

export default component;
```

- [ ] **Step 2: Refactor `packages/backend/convex/auth.ts` to export `createAuthOptions`**

Update `packages/backend/convex/auth.ts` to extract `createAuthOptions`:

```ts
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth, type BetterAuthOptions } from "better-auth/minimal";

import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL || "http://localhost:3001";

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  return {
    baseURL: siteUrl,
    trustedOrigins: [siteUrl],
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      convex({
        authConfig,
        jwksRotateOnTokenGenerationError: true,
      }),
    ],
  } satisfies BetterAuthOptions;
};

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx));
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await authComponent.safeGetAuthUser(ctx);
  },
});
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `pnpm --filter @jmwired/backend exec tsc --noEmit`
Expected: PASS (0 errors)

- [ ] **Step 4: Commit Task 1**

```bash
git add packages/backend/convex/betterAuth/convex.config.ts packages/backend/convex/auth.ts
git commit -m "feat(auth): define local betterAuth component and export createAuthOptions"
```

---

### Task 2: Setup Static Auth Export and Generate Schema

**Files:**

- Create: `packages/backend/convex/betterAuth/auth.ts`
- Create/Generate: `packages/backend/convex/betterAuth/schema.ts`

**Interfaces:**

- Consumes: `createAuth` from `../auth`
- Produces:
  - `packages/backend/convex/betterAuth/auth.ts`: exports static `auth` instance
  - `packages/backend/convex/betterAuth/schema.ts`: default export `defineSchema({...})`

- [ ] **Step 1: Create `packages/backend/convex/betterAuth/auth.ts`**

Write the static auth instance file used strictly for schema generation:

```ts
import { createAuth } from "../auth";

// Export a static instance for Better Auth schema generation
export const auth = createAuth({} as any);
```

- [ ] **Step 2: Generate the schema via Better Auth CLI**

Run from `packages/backend/convex/betterAuth`:

```bash
pnpx @better-auth/cli generate
```

or if using npx:

```bash
npx @better-auth/cli generate
```

- [ ] **Step 3: Verify `packages/backend/convex/betterAuth/schema.ts` exists**

Inspect `packages/backend/convex/betterAuth/schema.ts` to ensure it exports the Convex schema for user, session, account, and verification tables.

- [ ] **Step 4: Commit Task 2**

```bash
git add packages/backend/convex/betterAuth/auth.ts packages/backend/convex/betterAuth/schema.ts
git commit -m "feat(auth): generate local betterAuth schema"
```

---

### Task 3: Export Adapter Functions and Register Local Component

**Files:**

- Create: `packages/backend/convex/betterAuth/adapter.ts`
- Modify: `packages/backend/convex/convex.config.ts:1-10`
- Modify: `packages/backend/convex/auth.ts:1-20`

**Interfaces:**

- Consumes:
  - `packages/backend/convex/betterAuth/schema.ts`
  - `createAuthOptions` from `../auth`
- Produces:
  - `packages/backend/convex/betterAuth/adapter.ts`: exports `{ create, findOne, findMany, updateOne, updateMany, deleteOne, deleteMany }`
  - `packages/backend/convex/convex.config.ts`: registers `./betterAuth/convex.config`
  - `packages/backend/convex/auth.ts`: typed `authComponent` with `local: { schema: authSchema }`

- [ ] **Step 1: Create `packages/backend/convex/betterAuth/adapter.ts`**

```ts
import { createApi } from "@convex-dev/better-auth";

import { createAuthOptions } from "../auth";
import schema from "./schema";

export const { create, findOne, findMany, updateOne, updateMany, deleteOne, deleteMany } =
  createApi(schema, createAuthOptions);
```

- [ ] **Step 2: Update `packages/backend/convex/convex.config.ts`**

Replace remote `@convex-dev/better-auth/convex.config` import with local `./betterAuth/convex.config`:

```ts
import polar from "@convex-dev/polar/convex.config.js";
import { defineApp } from "convex/server";

import betterAuth from "./betterAuth/convex.config";

const app = defineApp();
app.use(betterAuth);
app.use(polar);

export default app;
```

- [ ] **Step 3: Update `packages/backend/convex/auth.ts` to pass local schema**

Import `authSchema from "./betterAuth/schema"` and configure `authComponent`:

```ts
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth, type BetterAuthOptions } from "better-auth/minimal";

import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authConfig from "./auth.config";
import authSchema from "./betterAuth/schema";

const siteUrl = process.env.SITE_URL || "http://localhost:3001";

export const authComponent = createClient<DataModel, typeof authSchema>(components.betterAuth, {
  local: {
    schema: authSchema,
  },
});

export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  return {
    baseURL: siteUrl,
    trustedOrigins: [siteUrl],
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      convex({
        authConfig,
        jwksRotateOnTokenGenerationError: true,
      }),
    ],
  } satisfies BetterAuthOptions;
};

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx));
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await authComponent.safeGetAuthUser(ctx);
  },
});
```

- [ ] **Step 4: Verify TypeScript compilation**

Run: `pnpm --filter @jmwired/backend exec tsc --noEmit`
Expected: PASS (0 errors)

- [ ] **Step 5: Commit Task 3**

```bash
git add packages/backend/convex/betterAuth/adapter.ts packages/backend/convex/convex.config.ts packages/backend/convex/auth.ts
git commit -m "feat(auth): wire local adapter and update component registration"
```

---

### Task 4: Monorepo Verification & Health Check

**Files:** All modified files

- [ ] **Step 1: Run typechecks across workspace**

Run: `pnpm run check` or `pnpm -r exec tsc --noEmit`
Expected: PASS (0 errors)

- [ ] **Step 2: Run linter/formatting check**

Run: `pnpm run lint`
Expected: PASS (0 errors)

- [ ] **Step 3: Commit any formatting or lint fixes**

If any formatting or lint tweaks were needed:

```bash
git add -A
git commit -m "chore(auth): lint and format local install"
```
