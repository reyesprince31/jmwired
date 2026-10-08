"use client";

import { useState } from "react";
import Link from "@/components/workspace/organization-link";
import { usePathname } from "next/navigation";
import { useWorkspaceRouter as useRouter } from "@/components/workspace/organization-link";
import { Button } from "@jmwired/ui/components/button";
import {
  CreditCard,
  ReceiptText,
  ClipboardList,
  Activity,
  BookOpen,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import { Notifications } from "@/components/support/notifications";
import { Brand, Modal, Select, WorkspaceLoading } from "./portal-ui";
import { ProfileMenu } from "./profile-menu";
import { WorkspaceBreadcrumbs } from "./workspace-breadcrumbs";
import { organizationHref } from "@/lib/organization-path";
import { Empty } from "./portal-ui";

const navigation = [
  { href: "/organization", label: "Overview", icon: LayoutDashboard },
  { href: "/organization/customers", label: "Customers", icon: Users },
  { href: "/organization/payments", label: "Billing & payments", icon: CreditCard },
  { href: "/organization/ledger", label: "Monthly ledger", icon: ReceiptText },
  { href: "/organization/expenses", label: "Expenses", icon: ReceiptText },
  { href: "/organization/applications", label: "Installation requests", icon: ClipboardList },
  { href: "/organization/support", label: "Support inbox", icon: MessageSquare },
  { href: "/organization/announcements", label: "Announcements", icon: Megaphone },
  { href: "/organization/network", label: "Network & usage", icon: Activity },
  { href: "/organization/settings", label: "Organization", icon: Settings },
] as const;

export function OrganizationShell({ children }: { children: React.ReactNode }) {
  const { state, orgId, setOrgId, dispatch, ready, persistent } = useWorkspace();
  const pathname = usePathname();
  const router = useRouter();
  const [reset, setReset] = useState(false);
  const org = state.organizations.find((entry) => entry.id === orgId)!;
  const tickets = state.tickets.filter(
    (entry) => entry.orgId === orgId && entry.status !== "Resolved",
  );
  if (ready && !org)
    return (
      <main className="p-6">
        <Empty page title="Organization not found" description="Open a workspace you manage.">
          <Link href="/admin" className="underline">
            View organizations
          </Link>
        </Empty>
      </main>
    );
  if (!org) return <WorkspaceLoading />;
  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[15rem_1fr]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-4"
      >
        Skip to content
      </a>
      <aside className="flex flex-col border-b bg-sidebar p-4 lg:sticky lg:top-0 lg:h-svh lg:overflow-y-auto lg:border-r lg:border-b-0">
        <Link href="/" className="px-2 py-2" aria-label="JMWired home">
          <Brand />
        </Link>
        <div className="my-5">
          <label className="sr-only" htmlFor="organization-switcher">
            Organization workspace
          </label>
          <Select
            id="organization-switcher"
            value={orgId}
            onChange={(event) => {
              if (event.target.value === "new") router.push("/organization/new");
              else {
                setOrgId(event.target.value);
                router.push(`/organization/${event.target.value}`);
              }
            }}
          >
            {state.organizations.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.name} · {entry.area}
              </option>
            ))}
            <option value="new">+ Create organization</option>
          </Select>
        </div>
        <nav
          aria-label="Organization navigation"
          className="flex gap-1 overflow-x-auto lg:flex-col"
        >
          {navigation.map(({ href, label, icon: Icon }) => {
            const scoped = organizationHref(orgId, href);
            const active =
              href === "/organization" ? pathname === scoped : pathname.startsWith(scoped);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "flex shrink-0 items-center gap-3 bg-sidebar-accent px-3 py-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    : "flex shrink-0 items-center gap-3 px-3 py-3 text-sm text-muted-foreground outline-none hover:bg-sidebar-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                }
              >
                <Icon className="size-4 shrink-0" />
                {label}
                {href === "/organization/support" && tickets.length > 0 && (
                  <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-muted text-xs text-foreground">
                    {tickets.length}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto hidden space-y-3 border-t pt-4 lg:block">
          <a
            href="http://127.0.0.1:4001/docs/staff"
            className="flex items-center gap-3 px-3 py-2 text-sm hover:underline"
          >
            <BookOpen className="size-4" />
            Help & guides
          </a>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="flex min-h-16 items-center justify-between gap-3 border-b px-5 lg:px-8">
          <WorkspaceBreadcrumbs base="organization" />
          <div className="flex shrink-0 items-center gap-3">
            <Notifications admin />
            <ProfileMenu />
          </div>
        </header>
        <main id="main-content" className="mx-auto grid max-w-screen-2xl gap-5 p-5 lg:p-6">
          {ready ? children : <WorkspaceLoading />}
          <footer className="flex flex-wrap items-center justify-between gap-3 py-1 text-xs text-muted-foreground">
            <span>
              JMWired · {org.area}
              {!persistent && " · Session storage"}
            </span>
            <div className="flex gap-4">
              <button type="button" onClick={() => setReset(true)} className="hover:underline">
                Restore sample data
              </button>
            </div>
          </footer>
        </main>
      </div>
      {reset && (
        <Modal
          title="Restore sample data?"
          description="Your saved screenshots, conversations, and account changes will be removed from this browser."
          onClose={() => setReset(false)}
        >
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setReset(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                dispatch({ type: "reset" });
                setOrgId("poblacion");
                setReset(false);
                router.push("/organization/poblacion");
                toast.success("Sample accounts restored");
              }}
            >
              Restore sample data
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
