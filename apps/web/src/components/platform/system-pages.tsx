"use client";
import { useState } from "react";
import { Button } from "@jmwired/ui/components/button";
import { Input } from "@jmwired/ui/components/input";
import { toast } from "sonner";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import { timestamp } from "@/lib/mock-data";
import {
  Empty,
  Field,
  Modal,
  PageHeading,
  Panel,
  Select,
  Status,
} from "@/components/portal/portal-ui";

export function SystemPage() {
  const { state, dispatch } = useWorkspace();
  const [confirm, setConfirm] = useState(false);
  const [initial] = useState(state.platform);
  const [key, setKey] = useState("");
  function save(changes: Partial<typeof state.platform>) {
    dispatch({ type: "platform-settings", changes, id: crypto.randomUUID(), time: timestamp() });
    toast.success("Platform settings saved");
  }
  return (
    <>
      <PageHeading
        title="System & AI"
        description="Control platform availability, new registrations, and AI assistance."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Platform availability">
          <div className="grid gap-5 border-t p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Maintenance mode</p>
                <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                  Show a maintenance page in the customer portal and pause new connection
                  applications. Staff workspaces remain available.
                </p>
              </div>
              <Button
                variant={state.platform.maintenanceMode ? "outline" : "destructive"}
                onClick={() =>
                  state.platform.maintenanceMode
                    ? save({ maintenanceMode: false })
                    : setConfirm(true)
                }
              >
                {state.platform.maintenanceMode ? "End maintenance" : "Start maintenance"}
              </Button>
            </div>
            <label className="flex min-h-11 items-center justify-between gap-4 text-sm">
              <span>Allow new registrations and applications</span>
              <input
                className="size-4 accent-primary"
                type="checkbox"
                checked={state.platform.allowRegistrations}
                onChange={(event) => save({ allowRegistrations: event.target.checked })}
              />
            </label>
            <Status>{state.platform.maintenanceMode ? "Maintenance" : "Online"}</Status>
          </div>
        </Panel>
        <Panel title="AI usage">
          <div className="grid gap-4 border-t p-5">
            <label className="flex min-h-11 items-center justify-between gap-4 text-sm">
              <span>Enable AI assistance in staff inboxes</span>
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={state.platform.aiEnabled}
                onChange={(event) => save({ aiEnabled: event.target.checked })}
              />
            </label>
            <p className="text-3xl font-semibold tabular-nums">
              0 / {state.platform.monthlyAiTokenCap.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              Monthly token allowance · provider usage is awaiting connection.
            </p>
            <progress
              className="h-2 w-full appearance-none [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary"
              value={0}
              max={state.platform.monthlyAiTokenCap || 1}
              aria-label="Monthly AI usage"
            />
          </div>
        </Panel>
      </div>
      <Panel title="AI provider settings">
        <form
          className="grid max-w-2xl gap-5 border-t p-5"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            save({
              aiProvider: String(data.get("provider")),
              aiModel: String(data.get("model")).trim(),
              monthlyAiTokenCap: Number(data.get("cap")),
              aiKeyConfigured: state.platform.aiKeyConfigured || Boolean(key),
            });
            setKey("");
          }}
        >
          <Field label="Provider">
            <Select name="provider" defaultValue={initial.aiProvider}>
              <option>OpenAI</option>
              <option>Anthropic</option>
              <option>Other</option>
            </Select>
          </Field>
          <Field label="Model">
            <Input name="model" defaultValue={initial.aiModel} maxLength={100} required />
          </Field>
          <Field label="Monthly token cap">
            <Input
              name="cap"
              type="number"
              min={0}
              step={1}
              defaultValue={initial.monthlyAiTokenCap}
              required
            />
          </Field>
          <Field label="API key">
            <Input
              type="password"
              autoComplete="off"
              value={key}
              onChange={(event) => setKey(event.target.value)}
              placeholder={
                state.platform.aiKeyConfigured
                  ? "Configured in this preview"
                  : "Use a placeholder to preview setup"
              }
            />
          </Field>
          <p className="text-xs text-muted-foreground">
            Use a placeholder key here. This preview discards the value and saves only the
            configured status. Live credentials and provider calls will be connected during setup.
          </p>
          <div>
            <Button type="submit">Save AI settings</Button>
          </div>
        </form>
      </Panel>
      {confirm && (
        <Modal
          title="Start platform maintenance?"
          description="Customers will see a maintenance page, and new applications will be paused in this preview."
          onClose={() => setConfirm(false)}
        >
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                save({ maintenanceMode: true });
                setConfirm(false);
              }}
            >
              Start maintenance
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
export function AuditPage() {
  const { state } = useWorkspace();
  const [scope, setScope] = useState("all");
  const entries = state.audit.filter((entry) => scope === "all" || entry.orgId === scope);
  return (
    <>
      <PageHeading
        title="Audit log"
        description="Recorded platform changes and significant workspace actions."
      />
      <div className="w-60">
        <Select
          aria-label="Audit organization filter"
          value={scope}
          onChange={(event) => setScope(event.target.value)}
        >
          <option value="all">All organizations and platform</option>
          {state.organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name} · {org.area}
            </option>
          ))}
        </Select>
      </div>
      <Panel title={`${entries.length} recorded events`}>
        <div className="divide-y border-t">
          {entries.length ? (
            entries.map((entry) => (
              <div key={entry.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <p className="text-sm font-medium">{entry.action}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {entry.actor} · {entry.orgId ?? "Platform"}
                  </p>
                </div>
                <time className="text-xs text-muted-foreground">{entry.time}</time>
              </div>
            ))
          ) : (
            <Empty
              title="No events found"
              description="Platform configuration changes will appear here."
            />
          )}
        </div>
      </Panel>
    </>
  );
}
