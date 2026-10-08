"use client";
import { useState } from "react";
import Link from "@/components/workspace/organization-link";
import { Button } from "@jmwired/ui/components/button";
import { Input } from "@jmwired/ui/components/input";
import { Textarea } from "@jmwired/ui/components/textarea";
import { Plus, Pencil, Trash2, Download, Check } from "lucide-react";
import { toast } from "sonner";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import {
  BILLING_PERIOD,
  billDueDate,
  cashPayment,
  currentPayment,
  money,
  monthlySummary,
} from "@/lib/mock-data";
import type { Expense } from "@/lib/mock-data";
import { readImage } from "@/lib/read-image";
import {
  Empty,
  Field,
  Metric,
  Modal,
  PageHeading,
  Panel,
  Select,
  Status,
  TextLink,
} from "@/components/portal/portal-ui";

export function LedgerPage() {
  const { state, orgId, dispatch } = useWorkspace();
  const [period, setPeriod] = useState(BILLING_PERIOD);
  const [filter, setFilter] = useState("All bills");
  const summary = monthlySummary(state, orgId, period);
  const customers = state.customers.filter(
    (customer) =>
      customer.orgId === orgId &&
      customer.status !== "Pending installation" &&
      (!customer.installationDate || customer.installationDate.slice(0, 7) <= period),
  );
  const rows = customers.filter(
    (customer) =>
      filter === "All bills" ||
      (currentPayment(state, customer, period)?.status ?? "Unpaid") === filter,
  );
  function exportLedger() {
    const cell = (value: unknown) =>
      `"${String(value)
        .replaceAll('"', '""')
        .replace(/^[\s=+@-]/, "'$&")}"`;
    const csv = [
      ["Account", "Customer", "Due date", "Amount", "Status", "Method", "Reference"],
      ...rows.map((customer) => {
        const payment = currentPayment(state, customer, period);
        return [
          customer.id,
          customer.name,
          billDueDate(period, customer.dueDay),
          customer.price,
          payment?.status ?? "Unpaid",
          payment?.method ?? "",
          payment?.reference ?? "",
        ];
      }),
    ]
      .map((row) => row.map(cell).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${orgId}-${period}-ledger.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
  return (
    <>
      <PageHeading
        title="Monthly ledger"
        description="Every subscriber bill, cash collection, and branch expense in one monthly view."
      >
        <Button variant="outline" onClick={exportLedger}>
          <Download />
          Export CSV
        </Button>
      </PageHeading>
      <div className="flex flex-wrap gap-3">
        <Field label="Billing month">
          <Input
            aria-label="Billing month"
            type="month"
            value={period}
            min="2025-01"
            max={BILLING_PERIOD}
            required
            onChange={(event) => {
              if (event.target.value) setPeriod(event.target.value);
            }}
          />
        </Field>
        <Field label="Bill status">
          <Select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option>All bills</option>
            <option>Unpaid</option>
            <option>Pending review</option>
            <option>Paid</option>
          </Select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-y-5 xl:grid-cols-5">
        <Metric label="Total clients" value={summary.customers} />
        <Metric label="Total paid" value={summary.paid} />
        <Metric label="Collections" value={money(summary.collections)} />
        <Metric label="Expenses" value={money(summary.expenses)} />
        <Metric label="Net profit" value={money(summary.profit)} />
      </div>
      <Panel
        title={`${period} subscriber ledger`}
        action={<TextLink href="/organization/expenses">View expenses</TextLink>}
      >
        {rows.length ? (
          <div className="relative overflow-x-auto">
            <table className="w-full whitespace-nowrap text-left text-sm">
              <thead className="border-y bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  {["Subscriber", "Due date", "Amount", "Status", "Collection", "Action"].map(
                    (label) => (
                      <th key={label} scope="col" className="px-5 py-3 font-medium">
                        {label}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((customer) => {
                  const payment = currentPayment(state, customer, period);
                  return (
                    <tr key={customer.id} className="border-b last:border-b-0">
                      <td className="px-5 py-4">
                        <Link
                          href={`/organization/customers/${customer.id}`}
                          className="font-medium hover:underline"
                        >
                          {customer.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">{customer.id}</p>
                      </td>
                      <td className="px-5 py-4">{billDueDate(period, customer.dueDay)}</td>
                      <td className="px-5 py-4 tabular-nums">{money(customer.price)}</td>
                      <td className="px-5 py-4">
                        <Status>{payment?.status ?? "Unpaid"}</Status>
                      </td>
                      <td className="px-5 py-4 text-xs">
                        {payment?.method ?? "—"}
                        {payment && <p className="text-muted-foreground">{payment.reference}</p>}
                      </td>
                      <td className="px-5 py-4">
                        {payment ? (
                          <TextLink href={`/organization/payments/${payment.id}`}>
                            {payment.status === "Pending review" ? "Review proof" : "View payment"}
                          </TextLink>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              dispatch({ type: "payment", payment: cashPayment(customer, period) });
                              toast.success("Cash payment recorded");
                            }}
                          >
                            <Check />
                            Mark paid · Cash
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty
            title="No bills found"
            description="Change the month or status filter to see subscriber bills."
          />
        )}
      </Panel>
      <p className="text-xs text-muted-foreground">
        Cash is recorded after collection. Digital payments stay in review until their transfer is
        verified.
      </p>
    </>
  );
}

const categories = ["Internet", "Electricity", "Labor", "Equipment", "Repairs", "Fees", "Other"];
export function ExpensesPage() {
  const { state, orgId, dispatch } = useWorkspace();
  const [period, setPeriod] = useState(BILLING_PERIOD);
  const [category, setCategory] = useState("All categories");
  const [editing, setEditing] = useState<Expense | "new" | null>(null);
  const [deleting, setDeleting] = useState<Expense | null>(null);
  const monthly = state.expenses.filter(
    (expense) => expense.orgId === orgId && expense.date.startsWith(period),
  );
  const rows = monthly.filter(
    (expense) => category === "All categories" || expense.category === category,
  );
  return (
    <>
      <PageHeading
        title="Expenses"
        description="Track what it costs to keep your community connected."
      >
        <Button onClick={() => setEditing("new")}>
          <Plus />
          Log expense
        </Button>
      </PageHeading>
      <div className="flex flex-wrap gap-3">
        <Field label="Expense month">
          <Input
            type="month"
            value={period}
            required
            onChange={(event) => {
              if (event.target.value) setPeriod(event.target.value);
            }}
          />
        </Field>
        <Field label="Category">
          <Select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option>All categories</option>
            {categories.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </Select>
        </Field>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
        <Panel title="Monthly breakdown">
          <div className="grid gap-4 border-t p-5">
            <p className="text-3xl font-semibold tabular-nums">
              {money(monthly.reduce((sum, expense) => sum + expense.amount, 0))}
            </p>
            {categories.map((value) => {
              const amount = monthly
                .filter((expense) => expense.category === value)
                .reduce((sum, expense) => sum + expense.amount, 0);
              const total = monthly.reduce((sum, expense) => sum + expense.amount, 0);
              return (
                <div key={value}>
                  <div className="mb-1 flex justify-between gap-3 text-xs">
                    <span>{value}</span>
                    <span>{money(amount)}</span>
                  </div>
                  <progress
                    aria-label={`${value} expenses`}
                    className="h-2 w-full appearance-none [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary"
                    value={amount}
                    max={total || 1}
                  />
                </div>
              );
            })}
          </div>
        </Panel>
        <Panel title={`${rows.length} expense records`}>
          <div className="divide-y border-t">
            {rows.length ? (
              rows.map((expense) => (
                <div key={expense.id} className="grid gap-3 p-5 sm:grid-cols-[1fr_auto]">
                  <div>
                    <p className="font-medium">{expense.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {expense.date} · {expense.category} · {expense.payee || "No payee"}
                    </p>
                    {expense.note && (
                      <p className="mt-2 text-sm text-muted-foreground">{expense.note}</p>
                    )}
                    {expense.receipt && (
                      <a
                        href={expense.receipt}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 block text-xs underline"
                      >
                        View receipt
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="mr-2 font-medium tabular-nums">{money(expense.amount)}</span>
                    <Button
                      variant="ghost"
                      size="icon-touch"
                      aria-label={`Edit ${expense.title}`}
                      onClick={() => setEditing(expense)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-touch"
                      aria-label={`Delete ${expense.title}`}
                      onClick={() => setDeleting(expense)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <Empty
                title="No expenses this month"
                description="Log upstream internet, electricity, labor, or repair costs."
              />
            )}
          </div>
        </Panel>
      </div>
      {editing && (
        <ExpenseEditor
          key={editing === "new" ? "new" : editing.id}
          expense={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting && (
        <Modal
          title="Delete expense?"
          description={`${deleting.title} will be removed from the monthly totals.`}
          onClose={() => setDeleting(null)}
        >
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                dispatch({ type: "delete-expense", orgId, id: deleting.id });
                setDeleting(null);
                toast.success("Expense deleted");
              }}
            >
              Delete expense
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
function ExpenseEditor({ expense, onClose }: { expense?: Expense; onClose: () => void }) {
  const { dispatch, orgId } = useWorkspace();
  const [receipt, setReceipt] = useState(expense?.receipt ?? "");
  const [reading, setReading] = useState(false);
  return (
    <Modal
      title={expense ? "Edit expense" : "Log an expense"}
      description="Keep a receipt for easier reconciliation."
      onClose={onClose}
    >
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const amount = Number(data.get("amount"));
          if (!Number.isFinite(amount) || amount <= 0) return;
          dispatch({
            type: "expense",
            expense: {
              id: expense?.id ?? crypto.randomUUID(),
              orgId,
              title: String(data.get("title")).trim(),
              category: String(data.get("category")),
              amount,
              date: String(data.get("date")),
              payee: String(data.get("payee")).trim(),
              note: String(data.get("note")).trim(),
              receipt: receipt || undefined,
            },
          });
          toast.success("Expense saved");
          onClose();
        }}
      >
        <Field label="Expense title">
          <Input
            name="title"
            required
            minLength={2}
            maxLength={120}
            defaultValue={expense?.title}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Amount (PHP)">
            <Input
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              required
              defaultValue={expense?.amount}
            />
          </Field>
          <Field label="Date">
            <Input name="date" type="date" required defaultValue={expense?.date ?? "2026-10-08"} />
          </Field>
        </div>
        <Field label="Expense category">
          <Select name="category" defaultValue={expense?.category ?? "Internet"}>
            {categories.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </Select>
        </Field>
        <Field label="Payee">
          <Input name="payee" maxLength={100} defaultValue={expense?.payee} />
        </Field>
        <Field label="Notes">
          <Textarea name="note" maxLength={500} defaultValue={expense?.note} />
        </Field>
        <Field label="Receipt (optional · image up to 1 MB)">
          <Input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setReading(true);
              try {
                setReceipt(await readImage(file));
              } catch (error) {
                toast.error((error as Error).message);
              } finally {
                setReading(false);
              }
            }}
          />
        </Field>
        {receipt && (
          <img src={receipt} alt="Expense receipt" className="max-h-40 w-full object-contain" />
        )}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={reading}>
            Save expense
          </Button>
        </div>
      </form>
    </Modal>
  );
}
