"use client";

import { useState } from "react";
import Link from "@/components/workspace/organization-link";
import { Button } from "@jmwired/ui/components/button";
import { Input } from "@jmwired/ui/components/input";
import { Textarea } from "@jmwired/ui/components/textarea";

import { Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { cashPayment, currentPayment, money } from "@/lib/mock-data";
import type { Customer, Organization } from "@/lib/mock-data";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import {
  Avatar,
  Empty,
  Field,
  PageHeading,
  Panel,
  Select,
  Status,
} from "@/components/portal/portal-ui";

import { useWorkspaceRouter as useRouter } from "@/components/workspace/organization-link";
import { FormFrame } from "@/components/portal/portal-ui";

function CustomerDirectory({ onAdd }: { onAdd: () => void }) {
  const { state, orgId, dispatch } = useWorkspace();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All customers");
  const [area, setArea] = useState("All areas");

  const customers = state.customers.filter(
    (customer) =>
      customer.orgId === orgId &&
      (filter === "All customers" || customer.status === filter) &&
      (area === "All areas" ||
        (customer.area ?? state.organizations.find((org) => org.id === orgId)?.area) === area) &&
      `${customer.name} ${customer.id} ${customer.email}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <PageHeading title="Customers" description="The people connected to your network.">
        <Button size="lg" onClick={onAdd}>
          <Plus />
          Add customer
        </Button>
      </PageHeading>
      <div className="flex flex-wrap justify-between gap-3">
        <div className="w-72">
          <Input
            placeholder="Search name, account, or email…"
            aria-label="Search customers"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="w-40">
          <Select
            aria-label="Customer status filter"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option>All customers</option>
            <option>Active</option>
            <option>Suspended</option>
            <option>Pending installation</option>
          </Select>
        </div>
        <div className="w-40">
          <Select
            aria-label="Customer area filter"
            value={area}
            onChange={(event) => setArea(event.target.value)}
          >
            <option>All areas</option>
            {[
              ...new Set(
                state.customers
                  .filter((customer) => customer.orgId === orgId)
                  .map(
                    (customer) =>
                      customer.area ??
                      state.organizations.find((org) => org.id === orgId)?.area ??
                      "",
                  ),
              ),
            ].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </Select>
        </div>
      </div>
      <Panel title={`${customers.length} customers`}>
        {customers.length ? (
          <div className="relative overflow-x-auto">
            <table className="w-full whitespace-nowrap text-left text-sm">
              <thead className="border-y bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  {["Customer", "Plan", "Billing date", "Current bill", "Connection", ""].map(
                    (title) => (
                      <th key={title} scope="col" className="px-5 py-3 font-medium">
                        {title || <span className="sr-only">Actions</span>}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b last:border-b-0">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={customer.name} />
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {customer.id} · {customer.email}
                          </p>
                          {customer.notes && (
                            <p className="mt-1 max-w-60 truncate text-xs text-muted-foreground">
                              {customer.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p>{customer.plan}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {money(customer.price)} / month
                      </p>
                    </td>
                    <td className="px-5 py-4 text-xs">October {customer.dueDay}</td>
                    <td className="px-5 py-4">
                      <Status>
                        {currentPayment(state, customer)?.status ??
                          (customer.dueDay < 8 ? "Overdue" : "Unpaid")}
                      </Status>
                    </td>
                    <td className="px-5 py-4">
                      <Status>{customer.status}</Status>
                    </td>
                    <td className="px-5 py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        role="link"
                        render={<Link href={`/organization/customers/${customer.id}`} />}
                      >
                        View account
                      </Button>
                      {!currentPayment(state, customer) &&
                        customer.status !== "Pending installation" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              dispatch({ type: "payment", payment: cashPayment(customer) });
                              toast.success("Cash payment recorded");
                            }}
                          >
                            Mark paid · Cash
                          </Button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty
            title="No customers found"
            description="Try a different search or add your first customer."
          />
        )}
      </Panel>
    </>
  );
}

function CustomerDetails({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const { state, dispatch } = useWorkspace();
  const current = state.customers.find((entry) => entry.id === customer.id)!;
  const payment = currentPayment(state, current);
  return (
    <FormFrame
      page
      title={current.name}
      description={`${current.id} · ${current.email}`}
      onClose={onClose}
    >
      <div className="grid gap-5">
        <div className="flex items-center justify-between">
          <span className="text-sm">
            {current.plan} · {money(current.price)}/mo
          </span>
          <Status>{current.status}</Status>
        </div>
        <p className="text-sm text-muted-foreground">{current.address}</p>
        <div className="grid grid-cols-2 gap-4 border-y py-4">
          <div>
            <p className="text-xs text-muted-foreground">Billing date</p>
            <p className="mt-1 text-sm">October {current.dueDay}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Current bill</p>
            <div className="mt-1">
              <Status>{payment?.status ?? "Unpaid"}</Status>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Data usage</p>
            <p className="mt-1 text-sm">{current.usage.toFixed(1)} GB · Unlimited</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Support requests</p>
            <p className="mt-1 text-sm">
              {
                state.tickets.filter(
                  (ticket) => ticket.customerId === current.id && ticket.orgId === current.orgId,
                ).length
              }
            </p>
          </div>
        </div>
        <h3 className="text-sm font-medium">Payment history</h3>
        <div className="grid gap-2">
          {state.payments
            .filter((entry) => entry.customerId === current.id && entry.orgId === current.orgId)
            .map((entry) => (
              <div key={entry.id} className="flex justify-between border p-3 text-xs">
                <span>
                  {entry.period} · {money(entry.amount)} · {entry.method}
                </span>
                <Status>{entry.status}</Status>
              </div>
            ))}
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              dispatch({
                type: "customer-status",
                orgId: current.orgId,
                id: current.id,
                status: current.status === "Active" ? "Suspended" : "Active",
              });
              toast.success("Connection status updated");
            }}
          >
            {current.status === "Active" ? "Suspend connection" : "Reactivate connection"}
          </Button>
          <Button
            disabled={Boolean(payment) || current.status === "Pending installation"}
            onClick={() => {
              dispatch({ type: "payment", payment: cashPayment(current) });
              toast.success("Cash payment recorded");
            }}
          >
            <Check />
            Record cash payment
          </Button>
        </div>
        <CustomerRecord key={current.id} customer={current} />
      </div>
    </FormFrame>
  );
}

function AddCustomer({ org, onClose }: { org: Organization; onClose: () => void }) {
  const { dispatch } = useWorkspace();
  return (
    <FormFrame
      page
      title="Add a customer"
      description={`${org.name} · ${org.area}`}
      onClose={onClose}
    >
      <form
        className="grid gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const speed = Number(data.get("plan"));
          dispatch({
            type: "customer",
            customer: {
              id: `JM-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
              orgId: org.id,
              name: String(data.get("name")).trim(),
              email: String(data.get("email")).trim(),
              address: String(data.get("address")).trim(),
              plan: `Home Fiber ${speed}`,
              speed,
              price: speed === 100 ? 1499 : speed === 75 ? 1199 : 999,
              dueDay: Number(data.get("dueDay")),
              usage: 0,
              phone: String(data.get("phone")).trim(),
              area: String(data.get("area")).trim(),
              type: "New",
              installationDate: String(data.get("installationDate")),
              status: String(data.get("status")) as Customer["status"],
              notes: String(data.get("notes")).trim(),
              portalStatus: "Unregistered",
              activationCode: `JM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
            },
          });
          toast.success("Customer added to this organization");
          onClose();
        }}
      >
        <Field label="Full name">
          <Input name="name" required minLength={2} maxLength={100} />
        </Field>
        <Field label="Email address">
          <Input name="email" type="email" maxLength={150} />
        </Field>
        <Field label="Phone number">
          <Input name="phone" type="tel" maxLength={30} required />
        </Field>
        <Field label="Service area">
          <Input name="area" defaultValue={org.area} required maxLength={80} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Connection status">
            <Select name="status">
              <option>Active</option>
              <option>Pending installation</option>
              <option>Suspended</option>
            </Select>
          </Field>
          <Field label="Installation date">
            <Input name="installationDate" type="date" defaultValue="2026-10-08" />
          </Field>
        </div>
        <Field label="Service address">
          <Input name="address" required minLength={3} maxLength={200} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Internet plan">
            <Select name="plan">
              <option value="50">50 Mbps · ₱999/mo</option>
              <option value="75">75 Mbps · ₱1,199/mo</option>
              <option value="100">100 Mbps · ₱1,499/mo</option>
            </Select>
          </Field>
          <Field label="Monthly billing day">
            <Input name="dueDay" type="number" min={1} max={31} defaultValue={15} required />
          </Field>
        </div>
        <Field label="Staff notes">
          <Textarea
            name="notes"
            maxLength={1000}
            placeholder="e.g. Available for installation on Saturday"
          />
        </Field>
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            <Plus />
            Add customer
          </Button>
        </div>
      </form>
    </FormFrame>
  );
}
function CustomerRecord({ customer }: { customer: Customer }) {
  const { dispatch } = useWorkspace();
  const [initial] = useState(customer);
  return (
    <div className="grid gap-5 border-t pt-5">
      <h2 className="text-lg font-semibold">Subscriber details</h2>
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          dispatch({
            type: "customer-details",
            orgId: customer.orgId,
            id: customer.id,
            changes: {
              name: String(data.get("name")).trim(),
              email: String(data.get("email")).trim(),
              phone: String(data.get("phone")).trim(),
              address: String(data.get("address")).trim(),
              area: String(data.get("area")).trim(),
              dueDay: Number(data.get("dueDay")),
              installationDate: String(data.get("installationDate")),
              type: String(data.get("type")) as "Existing" | "New",
              notes: String(data.get("notes")).trim(),
            },
          });
          toast.success("Subscriber details saved");
        }}
      >
        <Field label="Subscriber name">
          <Input name="name" defaultValue={initial.name} required minLength={2} maxLength={100} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email (optional)">
            <Input name="email" type="email" defaultValue={initial.email} />
          </Field>
          <Field label="Phone">
            <Input name="phone" type="tel" defaultValue={initial.phone} maxLength={30} />
          </Field>
        </div>
        <Field label="Service address">
          <Input name="address" defaultValue={initial.address} required maxLength={200} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Service area">
            <Input name="area" defaultValue={initial.area} maxLength={80} />
          </Field>
          <Field label="Billing day">
            <Input
              name="dueDay"
              type="number"
              min={1}
              max={31}
              defaultValue={initial.dueDay}
              required
            />
          </Field>
          <Field label="Installation date">
            <Input name="installationDate" type="date" defaultValue={initial.installationDate} />
          </Field>
          <Field label="Subscriber type">
            <Select name="type" defaultValue={initial.type ?? "Existing"}>
              <option>Existing</option>
              <option>New</option>
            </Select>
          </Field>
        </div>
        <Field label="Internal customer notes">
          <Textarea name="notes" defaultValue={initial.notes} maxLength={1000} />
        </Field>
        <div className="flex justify-end">
          <Button type="submit">Save subscriber details</Button>
        </div>
      </form>
      <div className="grid gap-3 border bg-muted/20 p-4">
        <h3 className="font-medium">Portal access · {customer.portalStatus ?? "Unregistered"}</h3>
        <p className="text-xs text-muted-foreground">
          Subscribers can stay staff-managed, or claim their account using an activation code.
        </p>
        {customer.activationCode && (
          <>
            <code className="break-all font-mono text-sm">{customer.activationCode}</code>
            <Link href={`/activate?code=${customer.activationCode}`} className="text-sm underline">
              Open activation page
            </Link>
          </>
        )}
        <Button
          variant="outline"
          disabled={customer.portalStatus === "Activated"}
          onClick={() => {
            dispatch({
              type: "customer-details",
              orgId: customer.orgId,
              id: customer.id,
              changes: {
                activationCode: `JM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
                portalStatus: "Invited",
              },
            });
            toast.success("Activation code generated");
          }}
        >
          Generate new activation code
        </Button>
      </div>
    </div>
  );
}
export function CustomersPage() {
  const router = useRouter();
  return <CustomerDirectory onAdd={() => router.push("/organization/customers/new")} />;
}
export function CustomerPage({ id }: { id: string }) {
  const { state, orgId } = useWorkspace();
  const org = state.organizations.find((entry) => entry.id === orgId)!;
  const router = useRouter();
  const customer = state.customers.find((entry) => entry.id === id && entry.orgId === org.id);
  if (!customer)
    return (
      <Empty
        page
        title="Customer not found"
        description="Choose a customer in the current organization."
      >
        <Link href="/organization/customers" className="underline">
          Back to customers
        </Link>
      </Empty>
    );
  return (
    <CustomerDetails customer={customer} onClose={() => router.push("/organization/customers")} />
  );
}

export function NewCustomerPage() {
  const { state, orgId } = useWorkspace();
  const org = state.organizations.find((entry) => entry.id === orgId)!;
  const router = useRouter();
  return <AddCustomer org={org} onClose={() => router.push("/organization/customers")} />;
}
