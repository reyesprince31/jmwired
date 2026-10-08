"use client";

import Link from "@/components/workspace/organization-link";
import { Button } from "@jmwired/ui/components/button";

import { CalendarDays, Plus, Wifi } from "lucide-react";

import { BILLING_PERIOD, money, monthlySummary } from "@/lib/mock-data";

import { useWorkspace } from "@/components/workspace/workspace-provider";
import { Empty, Metric, PageHeading, Panel, Status, TextLink } from "@/components/portal/portal-ui";
import { PaymentTable } from "@/components/payments/payment-workflow";

export function OrganizationOverview() {
  const { state, orgId } = useWorkspace();

  const org = state.organizations.find((entry) => entry.id === orgId) ?? state.organizations[0]!;
  const customers = state.customers.filter((customer) => customer.orgId === org.id);
  const payments = state.payments.filter((payment) => payment.orgId === org.id);
  const pending = payments.filter((payment) => payment.status === "Pending review");
  const tickets = state.tickets.filter(
    (ticket) => ticket.orgId === org.id && ticket.status !== "Resolved",
  );
  const collected = payments
    .filter((payment) => payment.status === "Paid" && payment.period === BILLING_PERIOD)
    .reduce((total, payment) => total + payment.amount, 0);
  const financials = monthlySummary(state, org.id, BILLING_PERIOD);

  return (
    <>
      <PageHeading title="Overview" description="A clear picture of your network and customers.">
        <span className="flex items-center gap-2 border px-3 py-2 text-xs">
          <CalendarDays className="size-4" />
          October 2026
        </span>
        <Button
          size="lg"
          nativeButton={false}
          role="link"
          render={<Link href="/organization/customers/new" />}
        >
          <Plus />
          Add customer
        </Button>
      </PageHeading>
      <div className="grid grid-cols-2 gap-y-5 py-1 md:grid-cols-4">
        <Metric
          label="Active customers"
          value={customers.filter((customer) => customer.status === "Active").length}
        />
        <Metric label="Collected this month" value={money(collected)} />
        <Metric label="Awaiting review" value={pending.length} />
        <Metric label="Open tickets" value={tickets.length} />
      </div>
      <Panel
        title="October financial summary"
        action={<TextLink href="/organization/ledger">Monthly ledger</TextLink>}
      >
        <div className="grid grid-cols-2 gap-y-5 border-t p-5 xl:grid-cols-5">
          <Metric label="Total clients" value={financials.customers} />
          <Metric label="Total paid" value={financials.paid} />
          <Metric label="Collections" value={money(financials.collections)} />
          <Metric label="Expenses" value={money(financials.expenses)} />
          <Metric label="Net profit" value={money(financials.profit)} />
        </div>
      </Panel>
      <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
        <Panel title="Collections">
          <CollectionsChart
            amount={collected}
            empty={!customers.length || org.id !== "poblacion"}
          />
        </Panel>
        <Panel title="Network status">
          <div className="grid gap-5 px-5 pb-5">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Wifi className="size-4 text-success" />
              {state.announcements.some(
                (entry) =>
                  entry.orgId === org.id &&
                  entry.kind === "Outage" &&
                  !entry.resolved &&
                  !entry.customerIds.length,
              )
                ? "An outage is being investigated"
                : "All systems operational"}
            </p>
            <div className="flex items-center justify-between border-y py-4 text-sm">
              <span>{org.area}</span>
              <Status>
                {state.announcements.some(
                  (entry) =>
                    entry.orgId === org.id &&
                    entry.kind === "Outage" &&
                    !entry.resolved &&
                    !entry.customerIds.length,
                )
                  ? "Outage"
                  : "Online"}
              </Status>
            </div>
            <p className="text-xs text-muted-foreground">99.8% service availability this month</p>
            <div>
              <TextLink href="/organization/announcements/new">Post maintenance update</TextLink>
            </div>
          </div>
        </Panel>
      </div>
      <Panel
        title="Payments to review"
        action={<TextLink href="/organization/payments">View all</TextLink>}
      >
        <PaymentTable payments={pending.slice(0, 3)} admin />
      </Panel>
      <Panel
        title="Support activity"
        action={<TextLink href="/organization/support">View inbox</TextLink>}
      >
        {tickets.length ? (
          <div className="divide-y border-t">
            {tickets.slice(0, 3).map((ticket) => (
              <Link
                key={ticket.id}
                className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left hover:bg-muted/30"
                href={`/organization/support/${ticket.id}`}
              >
                <div>
                  <p className="text-sm font-medium">{ticket.subject}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {state.customers.find((entry) => entry.id === ticket.customerId)?.name} ·{" "}
                    {ticket.id}
                  </p>
                </div>
                <Status>{ticket.status}</Status>
              </Link>
            ))}
          </div>
        ) : (
          <Empty title="No open tickets" description="Your support team is all caught up." />
        )}
      </Panel>
    </>
  );
}

function CollectionsChart({ amount, empty }: { amount: number; empty: boolean }) {
  const values = empty ? [0, 0, 0, 0, 0, amount] : [1998, 3098, 3996, 4696, 5796, amount];
  const maximum = Math.max(8000, amount);
  const points = values
    .map((value, index) => `${15 + index * 114},${170 - (value / maximum) * 160}`)
    .join(" ");
  return (
    <div className="px-5 pb-4">
      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2">
        <div
          className="flex h-40 flex-col justify-between text-right text-xs text-muted-foreground"
          aria-hidden="true"
        >
          {[4, 3, 2, 1, 0].map((step) => (
            <span key={step}>{money((step * maximum) / 4)}</span>
          ))}
        </div>
        <svg
          viewBox="0 0 600 180"
          preserveAspectRatio="none"
          className="h-40 w-full"
          role="img"
          aria-label={`Monthly collections from May to October. October collections: ${money(amount)}`}
        >
          {[0, 1, 2, 3, 4].map((step) => (
            <line
              key={step}
              x1="0"
              x2="600"
              y1={170 - step * 40}
              y2={170 - step * 40}
              className="stroke-border"
            />
          ))}
          <polyline points={points} fill="none" className="stroke-foreground" strokeWidth="2" />
          {values.map((value, index) => (
            <circle
              key={index}
              cx={15 + index * 114}
              cy={170 - (value / maximum) * 160}
              r="3.5"
              className="fill-foreground"
            />
          ))}
        </svg>
        <div
          className="col-start-2 flex justify-between text-xs text-muted-foreground"
          aria-hidden="true"
        >
          {["May", "Jun", "Jul", "Aug", "Sep", "Oct"].map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">October reflects approved payments</p>
    </div>
  );
}
