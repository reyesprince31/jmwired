"use client";
import Link from "@/components/workspace/organization-link";
import { useWorkspaceRouter as useRouter } from "@/components/workspace/organization-link";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import { Empty, PageHeading } from "@/components/portal/portal-ui";
import { PayBill, PaymentDetails, PaymentTable } from "./payment-workflow";
import { customerPayments } from "@/lib/mock-data";
export function PaymentPage({ admin = false, id }: { admin?: boolean; id: string }) {
  const { state, orgId, customerId } = useWorkspace();
  const router = useRouter();
  const payment = state.payments.find(
    (entry) =>
      entry.id === id && entry.orgId === orgId && (admin || entry.customerId === customerId),
  );
  if (!payment)
    return (
      <Empty
        page
        title="Payment not found"
        description="Choose a payment from the current account."
      >
        <Link href={admin ? "/organization/payments" : "/portal/payments"} className="underline">
          Back to payments
        </Link>
      </Empty>
    );
  return (
    <PaymentDetails
      page
      admin={admin}
      payment={payment}
      onClose={() => router.push(admin ? "/organization/payments" : "/portal/payments")}
    />
  );
}
export function PayBillPage() {
  const { state, orgId, customerId } = useWorkspace();
  const router = useRouter();
  const customer = state.customers.find(
    (entry) => entry.orgId === orgId && entry.id === customerId,
  );
  if (!customer)
    return (
      <Empty
        page
        title="No customer selected"
        description="Choose a customer account to view your bill."
      />
    );
  if (customer.status === "Pending installation")
    return (
      <Empty
        page
        title="Installation is pending"
        description="Your provider will activate billing once your connection is installed."
      />
    );
  return <PayBill page customer={customer} onClose={() => router.push("/portal/bills")} />;
}
export function PaymentHistoryPage() {
  const { state, orgId, customerId } = useWorkspace();
  const customer = state.customers.find(
    (entry) => entry.orgId === orgId && entry.id === customerId,
  );
  if (!customer)
    return (
      <Empty
        page
        title="No customer selected"
        description="Choose a customer account to view payments."
      />
    );
  return (
    <>
      <PageHeading
        title="Payment history"
        description="Your payment records and submitted screenshots."
      />
      <PaymentTable payments={customerPayments(state, customer)} />
    </>
  );
}
