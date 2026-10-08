"use client";

import { useState } from "react";

import { Button } from "@jmwired/ui/components/button";
import { Input } from "@jmwired/ui/components/input";

import { toast } from "sonner";
import { BILLING_PERIOD, currentPayment, money } from "@/lib/mock-data";

import { useWorkspace } from "@/components/workspace/workspace-provider";
import { Empty, Metric, PageHeading, Panel, Select, TextLink } from "@/components/portal/portal-ui";
import { PaymentTable } from "@/components/payments/payment-workflow";

function Billing() {
  const { state, orgId } = useWorkspace();
  const [filter, setFilter] = useState("Pending review");
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState(BILLING_PERIOD);
  const customers = state.customers.filter((customer) => customer.orgId === orgId);
  const payments = state.payments.filter(
    (payment) =>
      payment.orgId === orgId &&
      (filter === "All payments" || payment.status === filter) &&
      (period === "all" || payment.period === period) &&
      `${state.customers.find((customer) => customer.id === payment.customerId)?.name} ${payment.reference}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const current = state.payments.filter(
    (payment) => payment.orgId === orgId && payment.period === BILLING_PERIOD,
  );
  const paid = current.filter((payment) => payment.status === "Paid");
  const unpaid = customers.filter((customer) => !currentPayment(state, customer));
  return (
    <>
      <PageHeading
        title="Billing & payments"
        description="Review proof, reconcile collections, and keep every payment on record."
      >
        <TextLink href="/organization/payments/settings">Collection QR settings</TextLink>
        <TextLink href="/organization/ledger">Monthly ledger</TextLink>
      </PageHeading>
      <div className="grid grid-cols-2 gap-y-5 md:grid-cols-4">
        <Metric
          label="October collections"
          value={money(paid.reduce((sum, payment) => sum + payment.amount, 0))}
        />
        <Metric label="Paid customers" value={paid.length} />
        <Metric
          label="Awaiting review"
          value={current.filter((payment) => payment.status === "Pending review").length}
        />
        <Metric label="Unpaid bills" value={unpaid.length} />
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="w-60">
          <Input
            aria-label="Search payments"
            placeholder="Search customer or reference…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="w-40">
          <Select
            aria-label="Payment status filter"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option>Pending review</option>
            <option>All payments</option>
            <option>Paid</option>
            <option>Rejected</option>
          </Select>
        </div>
        <div className="w-40">
          <Select
            aria-label="Billing period filter"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
          >
            <option value={BILLING_PERIOD}>October 2026</option>
            <option value="all">All periods</option>
            <option value="2026-09">September 2026</option>
            <option value="2026-08">August 2026</option>
          </Select>
        </div>
      </div>
      <Panel title={filter}>
        <PaymentTable payments={payments} admin />
      </Panel>
      <Panel title="Upcoming billing dates">
        <div className="divide-y border-t">
          {unpaid.length ? (
            unpaid.map((customer) => (
              <div
                key={customer.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm"
              >
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {customer.id} · Due October {customer.dueDay}
                  </p>
                </div>
                <div className="flex items-center gap-5">
                  <span className="tabular-nums">{money(customer.price)}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toast.success(
                        `${customer.name} · ${money(customer.price)} due October ${customer.dueDay}.`,
                      )
                    }
                  >
                    View reminder
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <Empty
              title="All bills accounted for"
              description="No unpaid bills remain this cycle."
            />
          )}
        </div>
      </Panel>
    </>
  );
}
export function BillingPage() {
  return <Billing />;
}
