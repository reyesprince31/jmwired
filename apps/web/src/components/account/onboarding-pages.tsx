"use client";
import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@jmwired/ui/components/button";
import { Input } from "@jmwired/ui/components/input";
import { Textarea } from "@jmwired/ui/components/textarea";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import {
  Brand,
  Empty,
  Field,
  FormFrame,
  Select,
  WorkspaceLoading,
} from "@/components/portal/portal-ui";
import { timestamp } from "@/lib/mock-data";
import { toast } from "sonner";

export function AccessShell({ children }: { children: React.ReactNode }) {
  const { ready } = useWorkspace();
  return (
    <div className="min-h-svh">
      <header className="flex min-h-18 flex-wrap items-center justify-between gap-4 border-b px-5 lg:px-8">
        <NextLink href="/" aria-label="JMWired home">
          <Brand />
        </NextLink>
        <a className="text-sm underline" href="http://127.0.0.1:4001/docs">
          Help center
        </a>
      </header>
      <main className="mx-auto grid max-w-3xl gap-6 px-5 py-10">
        {ready ? children : <WorkspaceLoading />}
      </main>
    </div>
  );
}
const titles = {
  "sign-in": "Welcome back",
  "sign-up": "Create your workspace account",
  "forgot-password": "Reset your password",
  "reset-password": "Choose a new password",
};
export function AuthPage({ mode }: { mode: keyof typeof titles }) {
  const { state, dispatch, orgId } = useWorkspace();
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  if (mode === "sign-up" && !state.platform.allowRegistrations)
    return (
      <Empty
        page
        title="Registration is currently paused"
        description="Contact your provider or sign in to an existing account."
      >
        <NextLink href="/sign-in" className="underline">
          Sign in
        </NextLink>
      </Empty>
    );
  return (
    <FormFrame
      page
      title={titles[mode]}
      description={
        mode === "sign-in"
          ? "Choose the workspace you want to open."
          : mode === "sign-up"
            ? "For branch owners and invited team members."
            : "Recover access to your JMWired account."
      }
      onClose={() => router.push("/")}
    >
      {done ? (
        <div className="grid gap-4" role="status">
          <h2 className="text-lg font-semibold">
            {mode === "forgot-password" ? "Check your email" : "Your new password is ready"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {mode === "forgot-password"
              ? `A recovery link would be sent to ${email} once account emails are connected.`
              : "The password reset flow is complete. Live password updates will be available after account setup."}
          </p>
          {mode === "forgot-password" && (
            <NextLink href="/reset-password" className="underline">
              Continue password reset preview
            </NextLink>
          )}
          <NextLink href="/sign-in" className="underline">
            Back to sign in
          </NextLink>
        </div>
      ) : (
        <form
          className="grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            if (mode === "forgot-password") {
              setEmail(String(data.get("email")));
              setDone(true);
              return;
            }
            if (mode === "reset-password") {
              if (data.get("password") !== data.get("confirm")) {
                toast.error("The passwords do not match.");
                return;
              }
              event.currentTarget.reset();
              setDone(true);
              return;
            }
            if (mode === "sign-up")
              dispatch({
                type: "profile",
                name: String(data.get("name")).trim(),
                email: String(data.get("email")).trim(),
              });
            const role = String(data.get("role"));
            router.push(
              role === "customer"
                ? "/portal"
                : role === "super-admin"
                  ? "/admin"
                  : mode === "sign-up" && role === "owner"
                    ? "/organization/new"
                    : `/organization/${orgId}`,
            );
          }}
        >
          {mode === "sign-up" && (
            <Field label="Your name">
              <Input name="name" required minLength={2} maxLength={100} />
            </Field>
          )}
          {mode !== "reset-password" && (
            <Field label="Email address">
              <Input
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue={mode === "sign-in" ? "prince@example.com" : undefined}
              />
            </Field>
          )}
          {mode !== "forgot-password" && (
            <Field label={mode === "reset-password" ? "New password" : "Password"}>
              <Input
                name="password"
                type="password"
                autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                minLength={8}
                maxLength={128}
                required
              />
            </Field>
          )}
          {mode === "reset-password" && (
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
          )}
          {(mode === "sign-in" || mode === "sign-up") && (
            <Field label={mode === "sign-in" ? "Open workspace" : "Account type"}>
              <Select name="role">
                {mode === "sign-in" ? (
                  <>
                    <option value="staff">Organization team</option>
                    <option value="customer">Customer portal</option>
                    <option value="super-admin">Super admin</option>
                  </>
                ) : (
                  <>
                    <option value="owner">Branch owner</option>
                    <option value="staff">Invited staff member</option>
                  </>
                )}
              </Select>
            </Field>
          )}
          <p className="text-xs text-muted-foreground">
            Sign-in and account emails are awaiting connection. Use a placeholder password to
            explore; no password is saved.
          </p>
          <Button type="submit" size="touch">
            {mode === "sign-in"
              ? "Sign in"
              : mode === "sign-up"
                ? "Create account"
                : mode === "forgot-password"
                  ? "Send recovery link"
                  : "Reset password"}
          </Button>
          {mode === "sign-in" && (
            <div className="flex flex-wrap justify-between gap-3 text-sm">
              <NextLink href="/forgot-password" className="underline">
                Forgot password?
              </NextLink>
              <NextLink href="/sign-up" className="underline">
                Create account
              </NextLink>
            </div>
          )}
          {mode === "sign-up" && (
            <NextLink href="/sign-in" className="text-sm underline">
              Already have an account? Sign in
            </NextLink>
          )}
        </form>
      )}
    </FormFrame>
  );
}

export function ActivationPage({ initialCode = "" }: { initialCode?: string }) {
  const { state, dispatch, setOrgId, setCustomerId } = useWorkspace();
  const [code, setCode] = useState(initialCode);
  const [done, setDone] = useState(false);
  const customer = state.customers.find(
    (entry) =>
      entry.activationCode === code.trim().toUpperCase() && entry.portalStatus !== "Activated",
  );
  return (
    <FormFrame
      page
      title={done ? "Your portal is ready" : "Activate your customer account"}
      description="Use the activation code from your provider to claim your existing connection."
      onClose={() => {}}
    >
      {done ? (
        <div className="grid gap-4">
          <p className="text-sm">
            You can now view bills, payment history, service updates, and support requests.
          </p>
          <NextLink href="/portal" className="underline">
            Open your customer portal
          </NextLink>
        </div>
      ) : (
        <form
          className="grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (!customer) {
              toast.error("This activation code was not found or has already been used.");
              return;
            }
            const data = new FormData(event.currentTarget);
            if (data.get("password") !== data.get("confirm")) {
              toast.error("The passwords do not match.");
              return;
            }
            dispatch({
              type: "activate",
              code: customer.activationCode!,
              email: String(data.get("email")).trim(),
            });
            setOrgId(customer.orgId);
            setCustomerId(customer.id);
            event.currentTarget.reset();
            setDone(true);
          }}
        >
          <Field label="Activation code">
            <Input
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
              required
              maxLength={30}
            />
          </Field>
          {customer && (
            <div className="border bg-muted/20 p-4 text-sm">
              {customer.name} · {customer.id}
              <p className="mt-1 text-xs text-muted-foreground">{customer.address}</p>
            </div>
          )}
          <Field label="Email address">
            <Input
              key={customer?.id ?? "unclaimed"}
              name="email"
              type="email"
              required
              defaultValue={customer?.email}
            />
          </Field>
          <Field label="Create password">
            <Input
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
            />
          </Field>
          <Field label="Confirm password">
            <Input
              name="confirm"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
            />
          </Field>
          <p className="text-xs text-muted-foreground">
            The activation changes your portal status in this preview. Use a placeholder password;
            live identity verification is awaiting setup.
          </p>
          <Button type="submit" size="touch">
            Activate account
          </Button>
        </form>
      )}
    </FormFrame>
  );
}

export function JoinPage({ orgSlug }: { orgSlug: string }) {
  const { state, dispatch } = useWorkspace();
  const org = state.organizations.find((entry) => entry.id === orgSlug);
  const [reference, setReference] = useState("");
  if (!org)
    return (
      <Empty
        page
        title="Service area not found"
        description="Ask your provider for their connection application link."
      />
    );
  if (!state.platform.allowRegistrations || state.platform.maintenanceMode)
    return (
      <Empty
        page
        title="Applications are currently paused"
        description={`Please contact ${org.name} ${org.phone ?? "at your local office"} to ask about a new connection.`}
      />
    );
  return (
    <FormFrame
      page
      title={reference ? "Application received" : `Get connected in ${org.area}`}
      description={
        reference
          ? "Your local team will contact you about coverage and installation."
          : `${org.name} · Apply for a home internet connection.`
      }
      onClose={() => {}}
    >
      {reference ? (
        <div className="grid gap-4" role="status">
          <p className="text-xl font-semibold">{reference}</p>
          <p className="text-sm">
            Keep this reference when contacting your provider. Installation depends on a coverage
            check and available schedule.
          </p>
          <NextLink href="/" className="underline">
            Back to JMWired
          </NextLink>
        </div>
      ) : (
        <form
          className="grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const id = `APP-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
            dispatch({
              type: "application",
              application: {
                id,
                orgId: org.id,
                name: String(data.get("name")).trim(),
                phone: String(data.get("phone")).trim(),
                email: String(data.get("email")).trim(),
                address: String(data.get("address")).trim(),
                plan: Number(data.get("plan")),
                note: String(data.get("note")).trim(),
                status: "New",
                date: timestamp(),
              },
            });
            setReference(id);
          }}
        >
          <Field label="Full name">
            <Input name="name" required minLength={2} maxLength={100} />
          </Field>
          <Field label="Phone number">
            <Input name="phone" type="tel" required minLength={7} maxLength={30} />
          </Field>
          <Field label="Email (optional)">
            <Input name="email" type="email" />
          </Field>
          <Field label="Installation address">
            <Input name="address" required minLength={5} maxLength={200} />
          </Field>
          <Field label="Preferred plan">
            <Select name="plan">
              <option value="50">50 Mbps · ₱999 per month</option>
              <option value="75">75 Mbps · ₱1,199 per month</option>
              <option value="100">100 Mbps · ₱1,499 per month</option>
            </Select>
          </Field>
          <Field label="Notes or preferred installation schedule">
            <Textarea name="note" maxLength={1000} />
          </Field>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" required className="mt-1 size-4 accent-primary" />I agree that
            the provider may contact me about this connection request.
          </label>
          <Button type="submit" size="touch">
            Request a connection
          </Button>
        </form>
      )}
    </FormFrame>
  );
}
