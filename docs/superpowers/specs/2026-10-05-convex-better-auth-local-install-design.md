# Convex + Better Auth Local Install Design Spec

## Overview

This specification details migrating `@jmwired/backend` from using the remote component `@convex-dev/better-auth/convex.config` to a locally installed Convex component (`packages/backend/convex/betterAuth/`).

Local installation gives complete ownership of the Better Auth database schema, supports custom table indexes, direct database access from Convex functions, and compatibility with additional Better Auth plugins.

## Architecture

The Better Auth component will live directly inside `packages/backend/convex/betterAuth/` and be registered by the Convex app in `packages/backend/convex/convex.config.ts`.

### Directory & File Structure

```
packages/backend/convex/
├── betterAuth/
│   ├── convex.config.ts    # Component definition: defineComponent("betterAuth")
│   ├── auth.ts             # Static export: auth = createAuth({} as any) for CLI generation
│   ├── schema.ts           # Generated Better Auth Convex schema
│   └── adapter.ts          # Adapter API: createApi(schema, createAuthOptions)
├── auth.config.ts          # Unchanged: AuthConfig providers for Convex client auth
├── auth.ts                 # Export createAuthOptions & configure authComponent with local schema
├── convex.config.ts        # App definition using ./betterAuth/convex.config
├── http.ts                 # Unchanged: registers auth routes with authComponent & createAuth
└── polar.ts, schema.ts     # Unchanged
```

## Detailed File Specifications

### 1. `packages/backend/convex/betterAuth/convex.config.ts`

Defines the local component name:

```ts
import { defineComponent } from "convex/server";

const component = defineComponent("betterAuth");

export default component;
```

### 2. `packages/backend/convex/auth.ts`

- Refactor `createAuth` to split out `createAuthOptions(ctx)` returning typed `BetterAuthOptions`.
- Ensure `process.env.SITE_URL` has a fallback (`process.env.SITE_URL || "http://localhost:3001"`) so schema generation does not fail if runtime environment variables are not loaded in the CLI.
- Import `authSchema` from `./betterAuth/schema`.
- Initialize `authComponent` with typed local schema:

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

### 3. `packages/backend/convex/betterAuth/auth.ts`

Static auth export strictly for the Better Auth CLI:

```ts
import { createAuth } from "../auth";

// Export a static instance for Better Auth schema generation
export const auth = createAuth({} as any);
```

### 4. Schema Generation (`packages/backend/convex/betterAuth/schema.ts`)

Run Better Auth CLI `generate` inside `packages/backend/convex/betterAuth/`:

```bash
npx auth generate
```

This generates `packages/backend/convex/betterAuth/schema.ts` defining Convex tables (`user`, `session`, `account`, `verification`).

### 5. `packages/backend/convex/betterAuth/adapter.ts`

Exports standard database adapter functions used by `@convex-dev/better-auth`:

```ts
import { createApi } from "@convex-dev/better-auth";
import schema from "./schema";
import { createAuthOptions } from "../auth";

export const { create, findOne, findMany, updateOne, updateMany, deleteOne, deleteMany } =
  createApi(schema, createAuthOptions);
```

### 6. `packages/backend/convex/convex.config.ts`

Registers the local component:

```ts
import polar from "@convex-dev/polar/convex.config.js";
import { defineApp } from "convex/server";
import betterAuth from "./betterAuth/convex.config";

const app = defineApp();
app.use(betterAuth);
app.use(polar);

export default app;
```

## Compatibility & Verification

- **Backward Compatibility**: `authComponent.safeGetAuthUser` and `authComponent.registerRoutes` remain unchanged.
- **Verification Strategy**:
  1. Validate generation of `schema.ts`.
  2. Run TypeScript check across backend (`pnpm --filter @jmwired/backend exec tsc --noEmit`).
  3. Validate root build / typecheck.
