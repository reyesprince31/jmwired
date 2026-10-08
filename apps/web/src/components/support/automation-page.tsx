"use client";
import { useState } from "react";
import { Button } from "@jmwired/ui/components/button";
import { Textarea } from "@jmwired/ui/components/textarea";
import { toast } from "sonner";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import { Field, PageHeading, Panel, Select, TextLink } from "@/components/portal/portal-ui";

export function AutomationPage() {
  const { state, orgId, dispatch } = useWorkspace();
  const org = state.organizations.find((entry) => entry.id === orgId)!;
  const [initial] = useState(org.responder);
  const [preview, setPreview] = useState("");
  return (
    <>
      <PageHeading
        title="Reply automation"
        description="Acknowledge new requests during outages or outside office hours."
      >
        <TextLink href="/organization/support">Back to inbox</TextLink>
      </PageHeading>
      <Panel title="Automatic acknowledgement">
        <form
          key={orgId}
          className="grid max-w-2xl gap-5 border-t p-5"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            dispatch({
              type: "organization-settings",
              orgId,
              changes: {
                responder: {
                  enabled: data.get("enabled") === "on",
                  mode: String(data.get("mode")) as "Outages" | "Off-hours",
                  message: String(data.get("message")).trim(),
                },
              },
            });
            toast.success("Reply automation saved");
          }}
        >
          <label className="flex min-h-11 items-center gap-3 text-sm">
            <input
              className="size-4 accent-primary"
              name="enabled"
              type="checkbox"
              defaultChecked={initial?.enabled}
            />
            Enable automatic replies
          </label>
          <Field label="When to respond">
            <Select name="mode" defaultValue={initial?.mode ?? "Outages"}>
              <option>Outages</option>
              <option>Off-hours</option>
            </Select>
          </Field>
          <Field label="Reply message">
            <Textarea
              name="message"
              required
              maxLength={2000}
              defaultValue={
                initial?.message ??
                "Thanks for contacting JMWired. Our team has received your request and will update you here shortly."
              }
            />
          </Field>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Outage replies apply to customers affected by an active outage announcement. Off-hours
            replies apply before 8 AM and after 5 PM, Philippine time. One acknowledgement is added
            when a new request arrives.
          </p>
          <div className="flex gap-2">
            <Button type="submit">Save automation</Button>
            <Button
              variant="outline"
              type="button"
              onClick={(event) => {
                const form = event.currentTarget.closest("form")!;
                setPreview(String(new FormData(form).get("message")));
              }}
            >
              Preview reply
            </Button>
          </div>
          {preview && (
            <div role="status" className="border bg-muted/30 p-4 text-sm">
              {preview}
            </div>
          )}
        </form>
      </Panel>
    </>
  );
}
