"use client";
import { useState } from "react";
import { Button } from "@jmwired/ui/components/button";
import { toast } from "sonner";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import {
  Empty,
  Modal,
  PageHeading,
  Panel,
  Select,
  Status,
  TextLink,
} from "@/components/portal/portal-ui";
import type { Application } from "@/lib/mock-data";

export function ApplicationsPage() {
  const { state, orgId, dispatch } = useWorkspace();
  const [filter, setFilter] = useState("All requests");
  const [selected, setSelected] = useState<Application | null>(null);
  const applications = state.applications.filter(
    (entry) => entry.orgId === orgId && (filter === "All requests" || entry.status === filter),
  );
  return (
    <>
      <PageHeading
        title="Installation requests"
        description="From a new connection application to a scheduled subscriber installation."
      >
        <TextLink href={`/join/${orgId}`}>Open application form</TextLink>
      </PageHeading>
      <div className="w-48">
        <Select
          aria-label="Installation request status"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option>All requests</option>
          <option>New</option>
          <option>Contacted</option>
          <option>Approved</option>
          <option>Declined</option>
        </Select>
      </div>
      <Panel title={`${applications.length} connection requests`}>
        <div className="divide-y border-t">
          {applications.length ? (
            applications.map((entry) => (
              <div key={entry.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-medium">{entry.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {entry.id} · {entry.address} · {entry.plan} Mbps
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {entry.phone} · {entry.date}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Status>{entry.status}</Status>
                  {entry.customerId ? (
                    <TextLink href={`/organization/customers/${entry.customerId}`}>
                      View subscriber
                    </TextLink>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setSelected(entry)}>
                      Review request
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <Empty
              title="No requests found"
              description="Share your branch application page with households who want a connection."
            />
          )}
        </div>
      </Panel>
      {selected && (
        <Modal
          title="Review connection request"
          description={`${selected.name} · ${selected.plan} Mbps`}
          onClose={() => setSelected(null)}
        >
          <div className="grid gap-5">
            <p className="text-sm">
              {selected.address}
              <br />
              {selected.phone}
              <br />
              {selected.email}
            </p>
            <p className="text-sm text-muted-foreground">
              {selected.note || "No additional notes."}
            </p>
            <p className="text-xs text-muted-foreground">
              Approving creates a subscriber with Pending installation status. Activate the
              connection after the installation is complete.
            </p>
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  dispatch({
                    type: "application-status",
                    orgId,
                    id: selected.id,
                    status: "Contacted",
                  });
                  setSelected(null);
                  toast.success("Request marked contacted");
                }}
              >
                Mark contacted
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  dispatch({
                    type: "application-status",
                    orgId,
                    id: selected.id,
                    status: "Declined",
                  });
                  setSelected(null);
                  toast.success("Request declined");
                }}
              >
                Decline
              </Button>
              <Button
                onClick={() => {
                  if (state.applications.find((entry) => entry.id === selected.id)?.customerId)
                    return;
                  const id = `JM-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
                  dispatch({
                    type: "customer",
                    customer: {
                      id,
                      orgId,
                      name: selected.name,
                      email: selected.email,
                      phone: selected.phone,
                      address: selected.address,
                      area: state.organizations.find((org) => org.id === orgId)!.area,
                      plan: `Home Fiber ${selected.plan}`,
                      speed: selected.plan,
                      price: selected.plan === 100 ? 1499 : selected.plan === 75 ? 1199 : 999,
                      dueDay: 15,
                      status: "Pending installation",
                      usage: 0,
                      type: "New",
                      notes: selected.note,
                      portalStatus: "Unregistered",
                      activationCode: `JM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
                    },
                  });
                  dispatch({
                    type: "application-status",
                    orgId,
                    id: selected.id,
                    status: "Approved",
                    customerId: id,
                  });
                  setSelected(null);
                  toast.success("Request approved. Subscriber created for installation.");
                }}
              >
                Approve & create subscriber
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
