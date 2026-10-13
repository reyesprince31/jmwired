---
name: nextjs-sitemap-seo
description: Use when a Next.js App Router project lacks an XML sitemap, robots.txt, or public directory, or when preparing site URLs for web crawlers, search engines, and scrapers like Firecrawl.
---

# Next.js Sitemap & Crawler SEO

## Overview

A robust, crawler-ready architecture for Next.js App Router that dynamically generates XML sitemaps, robots rules, and public directory pages while keeping administrative or authenticated workspaces private and enforcing canonical production domains.

## When to Use

- A Next.js project has no built-in `/sitemap.xml` or `/robots.txt`.
- Preparing public marketing or catalog pages to be crawled by search engines or AI scrapers (e.g. Firecrawl).
- Sitemaps are generating `localhost` or `127.0.0.1` URLs in production builds.
- Private routes (e.g. `/admin`, `/portal`, `/dashboard`, `/account`) are accidentally exposed to crawlers or missing from `robots.txt` exclusion rules.
- Public dynamic routes (e.g. products, blog posts, service areas) need automatic inclusion with images and update frequencies.

### When NOT to Use

- Static HTML sites not using Next.js App Router.
- Pure private APIs or internal intranets with zero public-facing pages.

---

## Core Pattern

```
src/
├── lib/
│   └── site.ts           # Single source of truth for canonical siteUrl & public routes
├── app/
│   ├── sitemap.ts        # Next.js MetadataRoute.Sitemap (/sitemap.xml)
│   ├── robots.ts         # Next.js MetadataRoute.Robots (/robots.txt)
│   └── (marketing)/
│       └── sitemap/
│           └── page.tsx  # Human-facing visitor directory (/sitemap)
```

---

## Implementation Guide

### 1. Centralize Origin & Route Registry (`src/lib/site.ts`)

Avoid hardcoding URLs across multiple files. Define canonical origin resolution that handles local development, CI checks, and production deployment:

```typescript
import { ENV } from "@/env"; // or process.env

// Resolve production domain, environment override, or local fallback
export const siteUrl = new URL(
  ENV.SITE_URL && ENV.SITE_URL !== "http://127.0.0.1:3001"
    ? ENV.SITE_URL
    : process.env.NODE_ENV === "production"
      ? "https://yourdomain.com"
      : (ENV.SITE_URL ?? "http://127.0.0.1:3001"),
).origin;

// Canonical public marketing navigation
export const marketingNavigation = [
  { href: "/plans", label: "Plans" },
  { href: "/coverage", label: "Coverage" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
] as const;

// Combined list for sitemaps
export const publicPages = [
  { href: "/", label: "Home" },
  ...marketingNavigation,
  { href: "/sitemap", label: "Sitemap" },
] as const;
```

---

### 2. Next.js Dynamic XML Sitemap (`src/app/sitemap.ts`)

Next.js automatically serves this at `/sitemap.xml`:

```typescript
import type { MetadataRoute } from "next";
import { publicPages, siteUrl } from "@/lib/site";
import { catalogItems } from "@/lib/catalog-data"; // if dynamic items exist

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Static public pages
    ...publicPages.map((page) => ({
      url: `${siteUrl}${page.href}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: page.href === "/" ? 1.0 : 0.8,
    })),
    // Dynamic catalog or blog items
    ...catalogItems.map((item) => ({
      url: `${siteUrl}/catalog/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
      images: item.image ? [`${siteUrl}${item.image}`] : undefined,
    })),
  ];
}
```

---

### 3. Next.js Robots Policy (`src/app/robots.ts`)

Next.js automatically serves this at `/robots.txt`:

```typescript
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/organization",
        "/portal",
        "/account",
        "/dashboard",
        "/api",
        "/sign-in",
        "/sign-up",
        "/forgot-password",
        "/reset-password",
        "/activate",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
```

---

### 4. Human-Facing Directory (`src/app/(marketing)/sitemap/page.tsx`)

Provide an on-site page that links every public resource for visitors and fallback scrapers:

```typescript
import Link from "next/link";
import type { Metadata } from "next";
import { publicPages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sitemap · YourSite",
  alternates: { canonical: "/sitemap" },
};

export default function SitemapPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <h1 className="text-3xl font-semibold">Site Directory</h1>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {publicPages.map((page) => (
          <li key={page.href}>
            <Link href={page.href} className="text-sm hover:underline">
              {page.label}
            </Link>
          </li>
        ))}
      </ul>
      <a href="/sitemap.xml" className="mt-6 inline-block text-xs text-muted-foreground hover:underline">
        View XML sitemap for crawlers
      </a>
    </main>
  );
}
```

---

## Crawler & Firecrawl Verification Checklist

Run these checks before scraping or publishing:

1. **Test XML Output**:
   ```bash
   curl -s http://localhost:3000/sitemap.xml | grep "<loc>"
   ```
   Verify that all URLs start with `https://` and point to your real production domain.

2. **Test Robots Output**:
   ```bash
   curl -s http://localhost:3000/robots.txt
   ```
   Verify:
   - `Sitemap: https://yourdomain.com/sitemap.xml` is present at the bottom.
   - Private routes (`/admin`, `/portal`, `/api`) are listed under `Disallow`.

3. **Firecrawl Readiness**:
   - Firecrawl can take either `https://yourdomain.com` or `https://yourdomain.com/sitemap.xml`.
   - When given `sitemap.xml`, Firecrawl parses all `<loc>` tags directly, saving discovery credits.

---

## Common Mistakes

| Mistake | Consequence | Fix |
| :--- | :--- | :--- |
| Hardcoding `http://localhost:3000` | Sitemaps contain unreachable URLs in production | Use `siteUrl` resolver with `process.env.NODE_ENV === "production"` |
| Forgetting private routes in `robots.txt` | Scrapers index auth errors, login loops, or internal data | Add `/admin`, `/portal`, `/dashboard` to `disallow` array |
| Manually writing static `public/sitemap.xml` | Outdated as pages change; dynamic routes ignored | Use Next.js dynamic App Router `app/sitemap.ts` |
| Trailing slashes inconsistency | Duplicate content issues or 308 redirects | Ensure `siteUrl` has no trailing slash and paths begin with `/` |
