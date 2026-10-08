"use client";
import Link from "@/components/workspace/organization-link";
import { useWorkspaceRouter as useRouter } from "@/components/workspace/organization-link";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import { Empty, PageHeading, TextLink } from "@/components/portal/portal-ui";
import { NewTicket, SupportInbox } from "./support-workflow";
export function SupportPage({ admin = false, id }: { admin?: boolean; id?: string }) {
  const { state, orgId, customerId } = useWorkspace();
  const customer = state.customers.find(
    (entry) => entry.orgId === orgId && entry.id === customerId,
  );
  if (
    id &&
    !state.tickets.some(
      (ticket) =>
        ticket.id === id && ticket.orgId === orgId && (admin || ticket.customerId === customerId),
    )
  )
    return (
      <Empty
        page
        title="Request not found"
        description="This conversation is not available in the selected account."
      >
        <Link href={admin ? "/organization/support" : "/portal/support"} className="underline">
          Back to support
        </Link>
      </Empty>
    );
  if (!admin && !customer)
    return (
      <Empty
        page
        title="No customer selected"
        description="Choose a customer account to view support requests."
      />
    );
  return (
    <>
      <PageHeading
        title={admin ? "Support inbox" : "Your support requests"}
        description={
          admin
            ? "Every customer conversation, with a little help from AI."
            : "Report a problem and follow your conversations."
        }
      >
        {admin && <TextLink href="/organization/support/automation">Reply automation</TextLink>}
      </PageHeading>
      <SupportInbox
        key={id ?? orgId + customerId}
        admin={admin}
        customer={admin ? undefined : customer}
        initialTicket={id}
      />
    </>
  );
}
export function NewRequestPage() {
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
        description="Choose a customer account before submitting a request."
      />
    );
  return (
    <NewTicket
      page
      customer={customer}
      onClose={() => router.push("/portal/support")}
      onCreated={(id) => router.push(`/portal/support/${id}`)}
    />
  );
}
