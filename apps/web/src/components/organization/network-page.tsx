"use client";
import { useState } from "react";
import { Button } from "@jmwired/ui/components/button";
import { Input } from "@jmwired/ui/components/input";
import { toast } from "sonner";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import { Metric, PageHeading, Panel, Status, TextLink } from "@/components/portal/portal-ui";

export function NetworkPage() {
  const { state, orgId } = useWorkspace();
  const [check, setCheck] = useState(false);
  const customers = state.customers.filter((customer) => customer.orgId === orgId);
  return (
    <>
      <PageHeading
        title="Network & usage"
        description="Connection visibility and subscriber bandwidth reporting."
      >
        <TextLink href="/organization/announcements/new">Post network alert</TextLink>
      </PageHeading>
      <div className="grid grid-cols-2 gap-y-5 md:grid-cols-3">
        <Metric
          label="Active connections"
          value={customers.filter((customer) => customer.status === "Active").length}
        />
        <Metric
          label="Data used this cycle"
          value={`${customers.reduce((sum, customer) => sum + customer.usage, 0).toFixed(1)} GB`}
        />
        <Metric label="Usage source" value="Not connected" />
      </div>
      <Panel title="Router connection">
        <div className="grid gap-4 border-t p-5">
          <p className="text-sm text-muted-foreground">
            Connect your router during setup to receive periodic usage updates. The accounts below
            currently use the preview’s saved readings.
          </p>
          <FieldPreview />
          <div>
            <Button variant="outline" onClick={() => setCheck(true)}>
              Check connection
            </Button>
          </div>
          {check && (
            <p role="status" className="text-sm text-destructive">
              No router has been connected. Your setup team will configure the reporting endpoint
              and access token.
            </p>
          )}
        </div>
      </Panel>
      <Panel title="Subscriber usage">
        <div className="divide-y border-t">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="flex flex-wrap items-center justify-between gap-3 p-5"
            >
              <div>
                <TextLink href={`/organization/customers/${customer.id}`}>{customer.name}</TextLink>
                <p className="text-xs text-muted-foreground">
                  {customer.id} · {customer.speed} Mbps
                </p>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm tabular-nums">{customer.usage.toFixed(1)} GB</span>
                <Status>{customer.status}</Status>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
function FieldPreview() {
  return (
    <div className="grid max-w-xl gap-2">
      <label htmlFor="usage-endpoint" className="text-xs font-medium">
        Usage reporting endpoint
      </label>
      <Input id="usage-endpoint" readOnly value="/api/bandwidth-sync · awaiting setup" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          toast.info(
            "A reporting address will be available after router integration is configured.",
          )
        }
      >
        View setup status
      </Button>
    </div>
  );
}
