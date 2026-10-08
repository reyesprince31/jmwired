"use client";

import { useState } from "react";

import { Button } from "@jmwired/ui/components/button";
import { Input } from "@jmwired/ui/components/input";
import { Textarea } from "@jmwired/ui/components/textarea";
import { Megaphone, Plus } from "lucide-react";
import { toast } from "sonner";
import { timestamp } from "@/lib/mock-data";
import type { Announcement } from "@/lib/mock-data";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import { Empty, Field, PageHeading, Select, Status } from "@/components/portal/portal-ui";

import { useWorkspaceRouter as useRouter } from "@/components/workspace/organization-link";
import { FormFrame } from "@/components/portal/portal-ui";

function Announcements({ onPublish }: { onPublish: () => void }) {
  const { state, orgId, dispatch } = useWorkspace();
  const announcements = state.announcements.filter((entry) => entry.orgId === orgId);
  return (
    <>
      <PageHeading
        title="Announcements"
        description="Keep customers informed about their connection and your network."
      >
        <Button size="lg" onClick={onPublish}>
          <Plus />
          Post update
        </Button>
      </PageHeading>
      <div className="grid gap-4">
        {announcements.map((entry) => (
          <section key={entry.id} className="border p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="mb-2 text-xs text-muted-foreground">
                  {entry.kind} · {entry.date} ·{" "}
                  {entry.customerIds.length ? "Selected customer" : "All customers"}
                </p>
                <h2 className="text-base font-semibold">{entry.title}</h2>
              </div>
              {entry.kind !== "Announcement" && (
                <Status>{entry.resolved ? "Resolved" : entry.kind}</Status>
              )}
            </div>
            {entry.scheduled && (
              <p className="mt-2 text-xs font-medium">{entry.scheduled} · Asia/Manila</p>
            )}
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {entry.body}
            </p>
            {entry.customerIds.length > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                Audience:{" "}
                {entry.customerIds
                  .map((id) => state.customers.find((customer) => customer.id === id)?.name)
                  .join(", ")}
              </p>
            )}
            {entry.kind !== "Announcement" && !entry.resolved && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    dispatch({ type: "resolve-alert", orgId, id: entry.id });
                    toast.success("Alert resolved in the customer portal");
                  }}
                >
                  Mark resolved
                </Button>
              </div>
            )}
          </section>
        ))}
      </div>
      {!announcements.length && (
        <Empty
          title="Your first update starts here"
          description="Post an announcement or maintenance notice for this organization."
        />
      )}
    </>
  );
}

function PublishAnnouncement({ onClose }: { onClose: () => void }) {
  const { state, orgId, dispatch } = useWorkspace();
  const [kind, setKind] = useState<Announcement["kind"]>("Announcement");
  const customers = state.customers.filter((customer) => customer.orgId === orgId);
  const defaultArea = state.organizations.find((org) => org.id === orgId)?.area ?? "";
  return (
    <FormFrame
      page
      title="Post a customer update"
      description="Publish an update for your organization or a specific customer."
      onClose={onClose}
    >
      <form
        className="grid gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const audience = String(data.get("audience"));
          const date = String(data.get("scheduled") ?? "");
          const title = String(data.get("title")).trim();
          const body = String(data.get("body")).trim();
          const areaTarget = audience.startsWith("area:");
          const customerIds =
            audience === "all"
              ? []
              : areaTarget
                ? customers
                    .filter((customer) => (customer.area ?? defaultArea) === audience.slice(5))
                    .map((customer) => customer.id)
                : [audience];
          if (areaTarget && !customerIds.length) {
            toast.error("No subscribers are in this service area.");
            return;
          }
          if (title.length < 3 || body.length < 5) {
            toast.error("Please enter a title and a message for your customers.");
            return;
          }
          dispatch({
            type: "announcement",
            announcement: {
              id: crypto.randomUUID(),
              orgId,
              title,
              body,
              kind,
              customerIds,
              date: timestamp(),
              scheduled: date ? `${date.replace("T", " ")} (Manila)` : undefined,
            },
          });
          toast.success("Update published to the customer portal.");
          onClose();
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Update type">
            <Select
              name="kind"
              value={kind}
              onChange={(event) => setKind(event.target.value as Announcement["kind"])}
            >
              <option>Announcement</option>
              <option>Maintenance</option>
              <option>Outage</option>
            </Select>
          </Field>
          <Field label="Audience">
            <Select name="audience">
              <option value="all">All customers</option>
              {[...new Set(customers.map((customer) => customer.area ?? defaultArea))].map(
                (area) => (
                  <option key={`area:${area}`} value={`area:${area}`}>
                    Service area · {area}
                  </option>
                ),
              )}
              {state.customers
                .filter((customer) => customer.orgId === orgId)
                .map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
            </Select>
          </Field>
        </div>
        <Field label="Title">
          <Input
            name="title"
            required
            minLength={3}
            maxLength={120}
            placeholder="e.g. Scheduled maintenance on October 12"
          />
        </Field>
        <Field label="Message">
          <Textarea
            name="body"
            required
            minLength={5}
            maxLength={2000}
            placeholder="What should customers know? Include the expected interruption and next update."
          />
        </Field>
        {kind === "Maintenance" && (
          <Field label="Maintenance starts (Asia/Manila)">
            <Input type="datetime-local" name="scheduled" required />
          </Field>
        )}
        <p className="text-xs text-muted-foreground">
          Customers can read the update and follow its status in their portal.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            <Megaphone />
            Publish update
          </Button>
        </div>
      </form>
    </FormFrame>
  );
}
export function AnnouncementsPage() {
  const router = useRouter();
  return <Announcements onPublish={() => router.push("/organization/announcements/new")} />;
}
export function PublishPage() {
  const router = useRouter();
  return <PublishAnnouncement onClose={() => router.push("/organization/announcements")} />;
}
