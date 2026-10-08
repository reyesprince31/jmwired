"use client";
import { useState } from "react";
import { Button } from "@jmwired/ui/components/button";
import { Input } from "@jmwired/ui/components/input";
import { toast } from "sonner";
import Link from "@/components/workspace/organization-link";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import { Field, PageHeading, Panel, Status } from "@/components/portal/portal-ui";

export function UserAccountPage() {
  const { state, dispatch } = useWorkspace();
  const [initial] = useState(state.profile);
  return (
    <>
      <PageHeading
        title="Account & security"
        description="Your profile, password, and signed-in devices."
      />
      <Panel title="Personal profile">
        <form
          className="grid max-w-xl gap-5 border-t p-5"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            dispatch({
              type: "profile",
              name: String(data.get("name")).trim(),
              email: String(data.get("email")).trim(),
            });
            toast.success("Profile saved");
          }}
        >
          <Field label="Your name">
            <Input name="name" defaultValue={initial.name} required minLength={2} maxLength={100} />
          </Field>
          <Field label="Your email">
            <Input name="email" type="email" defaultValue={initial.email} required />
          </Field>
          <p className="text-xs text-muted-foreground">Super admin · Organization owner</p>
          <div>
            <Button type="submit">Save profile</Button>
          </div>
        </form>
      </Panel>
      <SecurityControls />
    </>
  );
}
export function SecurityControls() {
  const { state, dispatch } = useWorkspace();
  const [changed, setChanged] = useState(false);
  return (
    <>
      <Panel title="Change password">
        <form
          className="grid max-w-xl gap-5 border-t p-5"
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const data = new FormData(form);
            if (data.get("password") !== data.get("confirm")) {
              toast.error("The new passwords do not match.");
              return;
            }
            if (data.get("current") === data.get("password")) {
              toast.error("Choose a different new password.");
              return;
            }
            if (data.get("revoke") === "on")
              state.profile.sessions
                .filter((session) => !session.current)
                .forEach((session) => dispatch({ type: "revoke-session", id: session.id }));
            form.reset();
            setChanged(true);
          }}
        >
          <p className="text-xs text-muted-foreground">
            Account security is awaiting connection. Use placeholder passwords to explore this flow;
            passwords are not stored.
          </p>
          <Field label="Current password">
            <Input
              name="current"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
            />
          </Field>
          <Field label="New password">
            <Input
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
            />
          </Field>
          <Field label="Confirm new password">
            <Input
              name="confirm"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
            />
          </Field>
          <label className="flex min-h-11 items-center gap-3 text-sm">
            <input type="checkbox" name="revoke" className="size-4 accent-primary" defaultChecked />
            Sign out other devices
          </label>
          <div>
            <Button type="submit">Change password</Button>
          </div>
          {changed && (
            <p role="status" className="text-sm">
              Password change flow completed. Live password changes will be available after account
              setup.
            </p>
          )}
        </form>
      </Panel>
      <Panel title="Signed-in devices">
        <div className="divide-y border-t">
          {state.profile.sessions.map((session) => (
            <div key={session.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <p className="text-sm font-medium">{session.device}</p>
                <p className="mt-1 text-xs text-muted-foreground">{session.lastActive}</p>
              </div>
              {session.current ? (
                <Status>Current device</Status>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    dispatch({ type: "revoke-session", id: session.id });
                    toast.success("Device removed from this preview");
                  }}
                >
                  Sign out device
                </Button>
              )}
            </div>
          ))}
        </div>
        <div className="border-t p-5">
          <Link href="/sign-in" className="text-sm underline">
            Sign out of this device
          </Link>
        </div>
      </Panel>
    </>
  );
}
