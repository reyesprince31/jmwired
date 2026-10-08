"use client";

import { useState } from "react";
import Link from "@/components/workspace/organization-link";
import { Button } from "@jmwired/ui/components/button";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { currentPayment, money, visibleAnnouncements } from "@/lib/mock-data";
import type { Customer } from "@/lib/mock-data";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import { Empty, Modal, PageHeading, Panel, Status } from "@/components/portal/portal-ui";
import { SecurityControls } from "./security-page";

export function AccountPage() {
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
  return (
    <>
      <PageHeading
        title="Your account"
        description="Connection details and how you hear from us."
      />
      <Panel title="Account information">
        <dl className="grid gap-5 border-t p-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Name</dt>
            <dd className="mt-1 text-sm font-medium">{customer.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Account number</dt>
            <dd className="mt-1 text-sm font-medium">{customer.id}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Email</dt>
            <dd className="mt-1 break-all text-sm">{customer.email}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Service address</dt>
            <dd className="mt-1 text-sm">{customer.address}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Organization</dt>
            <dd className="mt-1 text-sm">
              {org.name} · {org.area}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Connection</dt>
            <dd className="mt-1">
              <Status>{customer.status}</Status>
            </dd>
          </div>
        </dl>
      </Panel>
      <NotificationPreferences customer={customer} />
      <SecurityControls />
    </>
  );
}
export function NotificationPreferences({
  customer,
  compact = false,
}: {
  customer: Customer;
  compact?: boolean;
}) {
  const { state, dispatch } = useWorkspace();
  const [open, setOpen] = useState(false);
  const preferences = state.preferences[customer.id] ?? { billing: false, maintenance: false };
  function change(billing: boolean, maintenance: boolean) {
    dispatch({ type: "preferences", customerId: customer.id, billing, maintenance });
  }
  const content = (
    <div className="grid gap-5">
      <label className="flex min-h-11 items-center justify-between gap-4">
        <span>
          <span className="block text-sm font-medium">Billing reminders</span>
          <span className="mt-1 block text-xs text-muted-foreground">
            A reminder before your monthly bill is due.
          </span>
        </span>
        <input
          type="checkbox"
          className="size-4 accent-primary"
          checked={preferences.billing}
          onChange={(event) => change(event.target.checked, preferences.maintenance)}
        />
      </label>
      <label className="flex min-h-11 items-center justify-between gap-4">
        <span>
          <span className="block text-sm font-medium">Maintenance and outage alerts</span>
          <span className="mt-1 block text-xs text-muted-foreground">
            Updates that affect your service area.
          </span>
        </span>
        <input
          type="checkbox"
          className="size-4 accent-primary"
          checked={preferences.maintenance}
          onChange={(event) => change(preferences.billing, event.target.checked)}
        />
      </label>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Choose which updates appear in your account. Device alerts will become available when your
        provider connects push notifications.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="touch"
          disabled={!preferences.billing}
          onClick={() =>
            toast(
              currentPayment(state, customer)?.status === "Paid"
                ? "JMWired · Your October bill is paid. Thank you!"
                : `JMWired · Your bill of ${money(customer.price)} is due October ${customer.dueDay}.`,
              { description: "Your billing reminder" },
            )
          }
        >
          <Bell />
          View billing reminder
        </Button>
        <Button
          variant="outline"
          size="touch"
          disabled={!preferences.maintenance}
          onClick={() => {
            const alert = visibleAnnouncements(state, customer).find(
              (entry) => entry.kind !== "Announcement" && !entry.resolved,
            );
            toast(alert?.title ?? "JMWired · Your network is online", {
              description: alert?.body ?? "No maintenance is currently affecting your account.",
            });
          }}
        >
          View maintenance alert
        </Button>
      </div>
    </div>
  );
  return (
    <>
      {compact ? (
        <section className="flex flex-wrap items-center justify-between gap-4 border p-4">
          <div>
            <h2 className="text-sm font-semibold">Stay in the loop</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Billing reminders and maintenance alerts
            </p>
          </div>
          <Button
            variant="outline"
            size="touch"
            onClick={() => {
              if (!preferences.billing && !preferences.maintenance) {
                change(true, true);
                toast.success("Notification preferences saved. View your updates in the bell.");
              }
              setOpen(true);
            }}
          >
            <Bell />
            {preferences.billing || preferences.maintenance
              ? "Manage notifications"
              : "Manage notifications"}
          </Button>
        </section>
      ) : (
        <Panel title="Notification preferences">
          <div className="border-t p-5">{content}</div>
        </Panel>
      )}
      {open && (
        <Modal
          title="Stay in the loop"
          description="Choose the updates you want to receive."
          onClose={() => setOpen(false)}
        >
          {content}
        </Modal>
      )}
    </>
  );
}
