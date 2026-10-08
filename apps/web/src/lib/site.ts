import { ENV } from "@/env";

export const siteUrl = new URL(ENV.SITE_URL ?? "http://127.0.0.1:3001").origin;

export const marketingNavigation = [
  { href: "/shop", label: "Shop" },
  { href: "/platform", label: "Platform" },
  { href: "/billing", label: "Billing" },
  { href: "/customer-portal", label: "Customer portal" },
  { href: "/support", label: "Support" },
  { href: "/multi-location", label: "Multiple locations" },
  { href: "/about", label: "About" },
] as const;

export const publicPages = [
  { href: "/", label: "Home" },
  ...marketingNavigation,
  { href: "/sitemap", label: "Sitemap" },
] as const;
