"use client";
import Link from "@/components/workspace/organization-link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useWorkspace } from "@/components/workspace/workspace-provider";

const labels: Record<string, string> = {
  customers: "Customers",
  payments: "Payments",
  support: "Support",
  announcements: "Announcements",
  organization: "Organization",
  settings: "Settings",
  platform: "Platform admin",
  bills: "Billing",
  updates: "Updates",
  account: "Account",
  new: "New",
  pay: "Pay your bill",
  ledger: "Monthly ledger",
  expenses: "Expenses",
  applications: "Installation requests",
  network: "Network & usage",
  automation: "Reply automation",
};
export function WorkspaceBreadcrumbs({ base }: { base: "organization" | "portal" }) {
  const { state, orgId, customerId } = useWorkspace();
  const segments = usePathname().split("/").filter(Boolean);
  const overview = base === "organization" && segments.length === 2 && segments[1] === orgId;
  function label(segment: string) {
    if (labels[segment]) return labels[segment];
    if (base === "organization") {
      const customer = state.customers.find(
        (entry) => entry.id === segment && entry.orgId === orgId,
      );
      if (customer) return customer.name;
    }
    const ticket = state.tickets.find(
      (entry) =>
        entry.id === segment &&
        entry.orgId === orgId &&
        (base === "organization" || entry.customerId === customerId),
    );
    return ticket?.subject ?? "Details";
  }
  return (
    <nav aria-label="Breadcrumb" className="min-w-0 text-xs text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {segments.map((segment, index) =>
          base === "organization" && index === 1 && segment === orgId ? null : (
            <li key={index} className="flex min-w-0 items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {index === segments.length - 1 || overview ? (
                <span aria-current="page" className="line-clamp-1 text-foreground">
                  {index === 0 ? "Overview" : label(segment)}
                </span>
              ) : (
                <Link
                  href={("/" + segments.slice(0, index + 1).join("/")) as Route}
                  className="hover:underline"
                >
                  {index === 0 ? (base === "organization" ? "Workspace" : "Home") : label(segment)}
                </Link>
              )}
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}
