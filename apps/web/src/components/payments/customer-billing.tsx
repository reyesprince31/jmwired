"use client";

import Link from "@/components/workspace/organization-link";
import { Button } from "@jmwired/ui/components/button";
import { QrCode } from "lucide-react";

import { BILLING_PERIOD, currentPayment, customerPayments, money } from "@/lib/mock-data";
import type { Customer } from "@/lib/mock-data";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import { Empty, PageHeading, Panel, Status } from "@/components/portal/portal-ui";
import { PaymentTable } from "@/components/payments/payment-workflow";

export function CustomerBillsPage() {
  const { state, orgId, customerId } = useWorkspace();
  const customer = state.customers.find(
    (entry) => entry.orgId === orgId && entry.id === customerId,
  );
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
  return (
    <>
      <PageHeading
        title="Billing & payments"
        description="Your current bill and every payment, in one place."
      />
      <div className="grid gap-5 md:grid-cols-2">
        <CurrentBill customer={customer} />
        <Panel title="How QR payments work">
          <ol className="list-decimal space-y-4 px-10 pb-5 text-sm leading-relaxed text-muted-foreground">
            <li>Open your bill and select a payment method.</li>
            <li>Scan your provider’s QR code using your payment app.</li>
            <li>Attach your screenshot and transaction reference.</li>
            <li>Your provider reviews the proof and marks your bill paid.</li>
          </ol>
          <p className="px-5 pb-5 text-xs font-medium">
            The portal records your proof. Your provider verifies the transfer.
          </p>
        </Panel>
      </div>
      <Panel title="Payment history">
        <PaymentTable payments={customerPayments(state, customer)} />
      </Panel>
    </>
  );
}
export function CurrentBill({ customer }: { customer: Customer }) {
  const { state } = useWorkspace();
  const payment = currentPayment(state, customer);
  const rejection = customerPayments(state, customer).find(
    (entry) => entry.period === BILLING_PERIOD && entry.status === "Rejected",
  );
  if (customer.status === "Pending installation")
    return (
      <Panel title="Current bill">
        <div className="grid gap-4 px-5 pb-5">
          <Status>Pending installation</Status>
          <p className="text-sm">
            Your provider will activate billing after your connection is installed.
          </p>
        </div>
      </Panel>
    );
  return (
    <Panel title="Current bill">
      <div className="grid gap-4 px-5 pb-5">
        <p className="text-5xl font-semibold tracking-tight tabular-nums">
          {payment?.status === "Paid" ? money(0) : money(customer.price)}
        </p>
        <p className="text-sm text-muted-foreground">
          {payment?.status === "Paid"
            ? "October 2026 · Thank you for your payment"
            : `Due October ${customer.dueDay}, 2026`}
        </p>
        <Status>{payment?.status ?? "Unpaid"}</Status>
        {!payment && rejection && (
          <p className="text-xs text-destructive">
            Your previous proof was rejected: {rejection.note}. Please submit a new screenshot.
          </p>
        )}
        <Button
          size="touch"
          className="w-full"
          nativeButton={false}
          role="link"
          render={<Link href={payment ? `/portal/payments/${payment.id}` : "/portal/bills/pay"} />}
        >
          <QrCode />
          {payment?.status === "Paid"
            ? "View payment details"
            : payment
              ? "View submitted proof"
              : "Pay with QR code"}
        </Button>
        {payment?.status === "Pending review" && (
          <p className="text-xs text-muted-foreground">
            Your payment is awaiting review by your provider.
          </p>
        )}
      </div>
    </Panel>
  );
}
export function Usage({ customer }: { customer: Customer }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const heights = [42, 68, 96, 62, 51, 90, 61];
  return (
    <Panel title="Data usage">
      <div className="px-5 pb-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-3xl font-semibold tracking-tight tabular-nums">
            {customer.usage.toFixed(1)} GB
          </p>
          <span className="text-xs text-muted-foreground">Unlimited data</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">This billing cycle</p>
        <div className="mt-4 grid grid-cols-[2fr_1fr] items-center gap-4">
          <div className="min-w-0">
            <svg
              viewBox="0 0 300 110"
              preserveAspectRatio="none"
              className="h-28 w-full"
              role="img"
              aria-label="Daily data usage for the past seven days"
            >
              {days.map((day, index) => (
                <g key={day}>
                  <rect
                    x={index * 43 + 5}
                    y={105 - (customer.usage ? heights[index]! : 0)}
                    width="28"
                    height={customer.usage ? heights[index] : 0}
                    className="fill-foreground"
                  />
                </g>
              ))}
            </svg>
            <div
              className="mt-2 flex justify-between text-xs text-muted-foreground"
              aria-hidden="true"
            >
              {days.map((day) => (
                <span key={day}>{day.slice(0, 1)}</span>
              ))}
            </div>
          </div>
          <div className="grid gap-5 border-l pl-4">
            <div>
              <p className="text-xs text-muted-foreground">Download</p>
              <p className="mt-1 text-base font-semibold tabular-nums">
                {(customer.usage * 0.927).toFixed(1)} GB
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Upload</p>
              <p className="mt-1 text-base font-semibold tabular-nums">
                {(customer.usage * 0.073).toFixed(1)} GB
              </p>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
