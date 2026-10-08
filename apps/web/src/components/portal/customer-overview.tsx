"use client";

import Link from "@/components/workspace/organization-link";
import { Button } from "@jmwired/ui/components/button";
import { ArrowRight, Plus, Wrench } from "lucide-react";

import { visibleAnnouncements } from "@/lib/mock-data";

import { useWorkspace } from "@/components/workspace/workspace-provider";
import { Empty, PageHeading, Panel, Status } from "@/components/portal/portal-ui";

import { CurrentBill, Usage } from "@/components/payments/customer-billing";
import { NotificationPreferences } from "@/components/account/account-page";

export function CustomerOverview() {
  const { state, orgId, customerId } = useWorkspace();

  const customer = state.customers.find(
    (entry) => entry.orgId === orgId && entry.id === customerId,
  );
  const org = state.organizations.find((entry) => entry.id === orgId)!;
  if (!customer)
    return (
      <Empty
        page
        title="No customer selected"
        description="Add a customer in the admin workspace to open their account."
      >
        <Link href="/organization/customers" className="underline">
          Open customers
        </Link>
      </Empty>
    );
  const updates = visibleAnnouncements(state, customer);
  const maintenance = updates.find((entry) => entry.kind !== "Announcement" && !entry.resolved);
  const tickets = state.tickets.filter(
    (ticket) => ticket.orgId === orgId && ticket.customerId === customer.id,
  );
  const serviceStatus =
    customer.status === "Pending installation"
      ? "Pending installation"
      : customer.status === "Suspended"
        ? "Suspended"
        : updates.some((entry) => entry.kind === "Outage" && !entry.resolved)
          ? "Outage"
          : "Online";
  return (
    <>
      <PageHeading
        greeting
        title={`Hello, ${customer.name.split(" ")[0]}.`}
        description="Your internet, all in one place."
      >
        <Status>{serviceStatus}</Status>
      </PageHeading>
      <section className="grid gap-5 border bg-muted/30 p-5 sm:grid-cols-[2fr_1fr_1fr]">
        <div>
          <h2 className="text-lg font-semibold">{customer.plan}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {customer.speed} Mbps · Unlimited data
          </p>
        </div>
        <div className="sm:border-l sm:pl-5">
          <p className="text-xs text-muted-foreground">Account</p>
          <p className="mt-1 text-sm font-medium">{customer.id}</p>
        </div>
        <div className="sm:border-l sm:pl-5">
          <p className="text-xs text-muted-foreground">Service area</p>
          <p className="mt-1 text-sm font-medium">{org.area}</p>
        </div>
      </section>
      <div className="grid gap-5 md:grid-cols-2">
        <CurrentBill customer={customer} />
        <Usage customer={customer} />
      </div>
      {maintenance && (
        <section
          className={
            maintenance.kind === "Outage"
              ? "flex items-start gap-4 border border-destructive/30 bg-destructive/5 p-5"
              : "flex items-start gap-4 border bg-muted/40 p-5"
          }
        >
          <Wrench className="mt-0.5 size-5 shrink-0" />
          <div>
            <h2 className="text-sm font-semibold">{maintenance.title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {maintenance.scheduled ?? maintenance.date} · {org.area}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{maintenance.body}</p>
          </div>
        </section>
      )}
      <div className="grid gap-5 md:grid-cols-2">
        <Panel
          title="Your support requests"
          action={
            <Button
              variant="outline"
              size="touch"
              nativeButton={false}
              role="link"
              render={<Link href="/portal/support/new" />}
            >
              <Plus />
              New request
            </Button>
          }
        >
          <div className="px-5 pb-5">
            {tickets.filter((ticket) => ticket.status !== "Resolved").length ? (
              tickets
                .filter((ticket) => ticket.status !== "Resolved")
                .slice(0, 2)
                .map((ticket) => (
                  <Link
                    key={ticket.id}
                    className="mb-2 flex w-full flex-wrap items-center justify-between gap-3 border p-4 text-left hover:bg-muted/30"
                    href={`/portal/support/${ticket.id}`}
                  >
                    <div>
                      <p className="text-sm font-medium">{ticket.subject}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{ticket.id}</span>
                        <Status>{ticket.status}</Status>
                      </div>
                    </div>
                    <ArrowRight className="size-4" />
                    <span className="sr-only">View conversation</span>
                  </Link>
                ))
            ) : (
              <p className="py-3 text-sm text-muted-foreground">
                No open requests. We’re here if you need us.
              </p>
            )}
            <Button
              variant="link"
              size="sm"
              nativeButton={false}
              role="link"
              render={<Link href="/portal/support" />}
            >
              View ticket history
            </Button>
          </div>
        </Panel>
        <Panel title="Latest updates">
          <div className="grid gap-3 px-5 pb-5">
            {updates
              .filter((entry) => entry.kind === "Announcement")
              .slice(0, 2)
              .map((entry) => (
                <div key={entry.id} className="border p-4">
                  <h3 className="text-sm font-medium">{entry.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{entry.body}</p>
                </div>
              ))}
            {!updates.some((entry) => entry.kind === "Announcement") && (
              <p className="py-3 text-sm text-muted-foreground">New updates will appear here.</p>
            )}
            <Button
              variant="link"
              size="sm"
              nativeButton={false}
              role="link"
              render={<Link href="/portal/updates" />}
            >
              View all updates
            </Button>
          </div>
        </Panel>
      </div>
      <NotificationPreferences customer={customer} compact />
    </>
  );
}
