import type { Route } from "next";

export function organizationHref(orgId: string, href: string): Route {
  if (href === "/organization/new") return href;
  const roots = [
    "customers",
    "payments",
    "support",
    "announcements",
    "settings",
    "expenses",
    "ledger",
    "applications",
    "network",
  ];
  const path = href.split("/");
  if (href === "/organization" || (path[1] === "organization" && roots.includes(path[2] ?? ""))) {
    return `/organization/${orgId}${href.slice("/organization".length)}` as Route;
  }
  return href as Route;
}
