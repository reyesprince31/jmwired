"use client";

import Link from "@/components/workspace/organization-link";

import { visibleAnnouncements } from "@/lib/mock-data";

import { useWorkspace } from "@/components/workspace/workspace-provider";
import { Empty, PageHeading, Status } from "@/components/portal/portal-ui";

export function CustomerUpdatesPage() {
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
  return (
    <>
      <PageHeading
        title="Updates from your provider"
        description={`Announcements and network updates for ${org.area}.`}
      />
      <div className="grid gap-4">
        {updates.length ? (
          updates.map((entry) => (
            <section key={entry.id} className="border p-5">
              <div className="flex flex-wrap justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  {entry.kind} · {entry.date}
                </p>
                {entry.kind !== "Announcement" && (
                  <Status>{entry.resolved ? "Resolved" : entry.kind}</Status>
                )}
              </div>
              <h2 className="mt-3 text-lg font-semibold">{entry.title}</h2>
              {entry.scheduled && (
                <p className="mt-2 text-xs font-medium">{entry.scheduled} · Asia/Manila</p>
              )}
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {entry.body}
              </p>
            </section>
          ))
        ) : (
          <Empty
            title="No updates yet"
            description="Your provider’s announcements will appear here."
          />
        )}
      </div>
    </>
  );
}
