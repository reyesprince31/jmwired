"use client";

import Link from "@/components/workspace/organization-link";
import { usePathname } from "next/navigation";
import { useWorkspaceRouter as useRouter } from "@/components/workspace/organization-link";
import { ArrowUpRight, CreditCard, LayoutDashboard, Megaphone, MessageSquare } from "lucide-react";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import { Notifications } from "@/components/support/notifications";
import { Avatar, Brand, Select, WorkspaceLoading, Empty } from "./portal-ui";
import { WorkspaceBreadcrumbs } from "./workspace-breadcrumbs";

const navigation = [
  { href: "/portal", label: "Overview", icon: LayoutDashboard },
  { href: "/portal/bills", label: "Billing", icon: CreditCard },
  { href: "/portal/support", label: "Support", icon: MessageSquare },
  { href: "/portal/updates", label: "Updates", icon: Megaphone },
] as const;

export function CustomerShell({ children }: { children: React.ReactNode }) {
  const { state, orgId, customerId, setCustomerId, ready } = useWorkspace();
  const pathname = usePathname();
  const router = useRouter();
  const customers = state.customers.filter((entry) => entry.orgId === orgId);
  const customer = customers.find((entry) => entry.id === customerId);
  const org = state.organizations.find((entry) => entry.id === orgId)!;
  const active = (href: string) =>
    href === "/portal"
      ? pathname === href
      : href === "/portal/bills"
        ? pathname.startsWith(href) || pathname.startsWith("/portal/payments")
        : pathname.startsWith(href);
  return (
    <div className="min-h-svh pb-20 sm:pb-0">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-4"
      >
        Skip to content
      </a>
      <div className="border-b bg-muted/40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-2">
          <div className="flex items-center gap-3">
            <label className="text-xs text-muted-foreground" htmlFor="customer-switcher">
              Account
            </label>
            <div className="w-44">
              <Select
                id="customer-switcher"
                value={customer?.id ?? ""}
                disabled={!customers.length}
                onChange={(event) => {
                  setCustomerId(event.target.value);
                  router.push("/portal");
                }}
              >
                {customers.length ? (
                  customers.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.name}
                    </option>
                  ))
                ) : (
                  <option>No customers yet</option>
                )}
              </Select>
            </div>
          </div>
          <Link
            href="/organization"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Organization workspace
            <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </div>
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <Link href="/portal" aria-label="JMWired customer portal">
            <Brand />
          </Link>
          <nav
            className="hidden h-full items-center gap-7 sm:flex"
            aria-label="Customer navigation"
          >
            {navigation.map((entry) => (
              <Link
                key={entry.href}
                href={entry.href}
                aria-current={active(entry.href) ? "page" : undefined}
                className={
                  active(entry.href)
                    ? "flex h-full items-center border-b-2 border-primary text-sm font-medium"
                    : "flex h-full items-center border-b-2 border-transparent text-sm text-muted-foreground hover:text-foreground"
                }
              >
                {entry.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Notifications admin={false} customer={customer} />
            <Link
              href="/portal/account"
              aria-label="Account and notification settings"
              className="flex size-11 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Avatar name={customer?.name ?? "Customer"} />
            </Link>
          </div>
        </div>
      </header>
      <main id="main-content" className="mx-auto grid max-w-6xl gap-5 px-5 py-7 sm:gap-6">
        {pathname !== "/portal" && <WorkspaceBreadcrumbs base="portal" />}
        {ready ? (
          state.platform.maintenanceMode ? (
            <Empty
              page
              title="We’ll be back shortly"
              description="Your provider is updating the customer portal. Please contact your local office for urgent support."
            />
          ) : (
            children
          )
        ) : (
          <WorkspaceLoading />
        )}
        <footer className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <Link href="/" className="hover:underline">
            JMWired · {org.area}
          </Link>
          <Link href="/portal/account" className="hover:underline">
            Account & notifications
          </Link>
          <a href="http://127.0.0.1:4001/docs/customer" className="hover:underline">
            Help & guides
          </a>
        </footer>
      </main>
      <nav
        aria-label="Mobile customer navigation"
        className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t bg-background sm:hidden"
      >
        {navigation.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={active(href) ? "page" : undefined}
            className={
              active(href)
                ? "flex min-h-16 flex-col items-center justify-center gap-1 bg-muted text-xs font-medium"
                : "flex min-h-16 flex-col items-center justify-center gap-1 text-xs text-muted-foreground"
            }
          >
            <Icon className="size-5" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
