"use client";

import { useState } from "react";
import Link from "@/components/workspace/organization-link";
import { Button } from "@jmwired/ui/components/button";
import { Input } from "@jmwired/ui/components/input";
import { Textarea } from "@jmwired/ui/components/textarea";
import { Check, FileImage, QrCode, Upload } from "lucide-react";
import { toast } from "sonner";
import { BILLING_PERIOD, currentPayment, money, timestamp } from "@/lib/mock-data";
import type { Customer, Payment } from "@/lib/mock-data";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import { readImage } from "@/lib/read-image";
import { Empty, Field, FormFrame, Select, Status } from "@/components/portal/portal-ui";

export function PaymentTable({
  payments,
  admin = false,
}: {
  payments: Payment[];
  admin?: boolean;
}) {
  const { state } = useWorkspace();
  if (!payments.length)
    return (
      <Empty
        title="No payments to show"
        description="Payments and uploaded proofs will appear here."
      />
    );
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full whitespace-nowrap text-left text-sm">
        <thead className="border-y bg-muted/50 text-xs text-muted-foreground">
          <tr>
            <th scope="col" className="px-5 py-3 font-medium">
              {admin ? "Customer" : "Billing period"}
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              Payment
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              {admin ? "Submitted" : "Reference"}
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              Status
            </th>
            <th scope="col" className="px-5 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => {
            const customer = state.customers.find(
              (entry) => entry.id === payment.customerId && entry.orgId === payment.orgId,
            );
            return (
              <tr key={payment.id} className="border-b last:border-b-0">
                <td className="px-5 py-4">
                  <p className="font-medium">{admin ? customer?.name : payment.period}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {admin ? customer?.plan : payment.submitted}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <span className="font-medium tabular-nums">{money(payment.amount)}</span>
                  <span className="text-xs text-muted-foreground"> / {payment.method}</span>
                </td>
                <td className="px-5 py-4 text-xs text-muted-foreground">
                  {admin ? payment.submitted : payment.reference}
                </td>
                <td className="px-5 py-4">
                  <Status>{payment.status}</Status>
                </td>
                <td className="px-5 py-4 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    role="link"
                    render={
                      <Link
                        href={
                          admin
                            ? `/organization/payments/${payment.id}`
                            : `/portal/payments/${payment.id}`
                        }
                      />
                    }
                  >
                    {admin && payment.status === "Pending review" ? "Review" : "View details"}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function PaymentDetails({
  payment,
  admin = false,
  onClose,
  page = false,
}: {
  payment: Payment;
  admin?: boolean;
  onClose: () => void;
  page?: boolean;
}) {
  const { state, dispatch } = useWorkspace();
  const [note, setNote] = useState("");
  const customer = state.customers.find(
    (entry) => entry.id === payment.customerId && entry.orgId === payment.orgId,
  );
  const current = state.payments.find((entry) => entry.id === payment.id) ?? payment;
  function review(status: "Paid" | "Rejected") {
    if (status === "Rejected" && note.trim().length < 3) return;
    dispatch({ type: "review", orgId: payment.orgId, id: payment.id, status, note: note.trim() });
    toast.success(
      status === "Paid"
        ? "Payment approved. The customer bill is now paid."
        : "Proof rejected. The customer can submit a new screenshot.",
    );
    onClose();
  }
  return (
    <FormFrame
      page={page}
      title={
        admin && current.status === "Pending review" ? "Review payment proof" : "Payment details"
      }
      description={`${customer?.name} · ${payment.period}`}
      onClose={onClose}
    >
      <div className="grid gap-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-3xl font-semibold tabular-nums">{money(payment.amount)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {payment.method} · {payment.reference}
            </p>
          </div>
          <Status>{current.status}</Status>
        </div>
        {payment.proof ? (
          <a
            href={payment.proof}
            target="_blank"
            rel="noreferrer"
            aria-label="Open full payment proof"
          >
            <img
              src={payment.proof}
              alt={`Payment proof submitted by ${customer?.name}`}
              className="max-h-72 w-full border bg-muted object-contain"
            />
          </a>
        ) : (
          <div className="flex items-center gap-3 border bg-muted/30 p-5 text-sm text-muted-foreground">
            <FileImage className="size-5" />
            {payment.method === "Cash"
              ? "Cash payment recorded by staff."
              : "No screenshot is attached to this payment."}
          </div>
        )}
        <p className="text-xs text-muted-foreground">{payment.proofName ?? payment.submitted}</p>
        {current.note && (
          <div className="border bg-muted/30 p-4 text-sm">
            <p className="mb-1 font-medium">Reviewer note</p>
            {current.note}
          </div>
        )}
        {current.reviewedBy && (
          <p className="text-xs text-muted-foreground">
            Recorded / reviewed by {current.reviewedBy}
          </p>
        )}
        {admin && current.status === "Pending review" && (
          <>
            <Field label="Reviewer note (required when rejecting)">
              <Textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                maxLength={500}
                placeholder="e.g. Reference matches the transfer, or screenshot is unreadable"
              />
            </Field>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Check the transfer in your collection account before approving this proof.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="destructive"
                disabled={note.trim().length < 3}
                onClick={() => review("Rejected")}
              >
                Reject proof
              </Button>
              <Button onClick={() => review("Paid")}>
                <Check />
                Approve payment
              </Button>
            </div>
          </>
        )}
      </div>
    </FormFrame>
  );
}

export function PayBill({
  customer,
  onClose,
  page = false,
}: {
  customer: Customer;
  onClose: () => void;
  page?: boolean;
}) {
  const { state, dispatch } = useWorkspace();
  const [method, setMethod] = useState<"GCash" | "Maya" | "Bank">("GCash");
  const [proof, setProof] = useState("");
  const [proofName, setProofName] = useState("");
  const [reading, setReading] = useState(false);
  const [reference, setReference] = useState("");
  const existing = currentPayment(state, customer);
  const destination = state.destinations.find(
    (entry) => entry.orgId === customer.orgId && entry.method === method && entry.enabled,
  );
  async function upload(file?: File) {
    setProof("");
    setProofName("");
    if (!file) return;
    setReading(true);
    try {
      setProof(await readImage(file));
      setProofName(file.name);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setReading(false);
    }
  }
  return (
    <FormFrame
      page={page}
      title="Pay your internet bill"
      description={`${customer.plan} · October 2026 · ${customer.id}`}
      onClose={onClose}
    >
      {existing ? (
        <div className="grid gap-4">
          <Status>{existing.status}</Status>
          <p className="text-sm">
            {existing.status === "Paid"
              ? "Your October bill is paid. Thank you!"
              : "Your proof is awaiting review. Your bill will be marked paid after the team approves it."}
          </p>
          <Button onClick={onClose}>Done</Button>
        </div>
      ) : (
        <form
          className="grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (!proof || !reference.trim() || reading) return;
            dispatch({
              type: "payment",
              payment: {
                id: crypto.randomUUID(),
                orgId: customer.orgId,
                customerId: customer.id,
                period: BILLING_PERIOD,
                amount: customer.price,
                method,
                reference: reference.trim(),
                proof,
                proofName,
                status: "Pending review",
                submitted: timestamp(),
              },
            });
            toast.success("Proof submitted. Your payment is awaiting review.");
            onClose();
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Amount due</span>
            <span className="text-2xl font-semibold">{money(customer.price)}</span>
          </div>
          <Field label="Payment method">
            <Select
              value={method}
              onChange={(event) => setMethod(event.target.value as "GCash" | "Maya" | "Bank")}
            >
              <option>GCash</option>
              <option>Maya</option>
              <option>Bank</option>
            </Select>
          </Field>
          <div className="grid justify-items-center gap-2 border bg-muted/20 p-5">
            {destination?.qr ? (
              <img
                src={destination.qr}
                alt={`${method} collection QR`}
                className="size-48 object-contain"
              />
            ) : (
              <QrCode className="size-28" strokeWidth={1} aria-hidden="true" />
            )}
            <p className="text-sm font-semibold">
              JMWired · {state.organizations.find((org) => org.id === customer.orgId)?.area}
            </p>
            <p className="text-xs text-muted-foreground">{method} collection code</p>
            {destination ? (
              <>
                <p className="text-sm">
                  {destination.accountName} · {destination.accountNumber}
                </p>
                <p className="text-xs text-muted-foreground">{destination.instructions}</p>
              </>
            ) : (
              <p className="text-xs font-medium text-destructive">
                Collection QR awaiting setup · ask your provider for payment details
              </p>
            )}
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            1. Use your provider’s verified collection QR in your payment app.
            <br />
            2. Save the payment screenshot.
            <br />
            3. Enter the reference and attach your screenshot for review.
          </p>
          <Field label="Transaction reference">
            <Input
              density="comfortable"
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              placeholder="e.g. GC-10482975"
              required
              minLength={4}
              maxLength={80}
            />
          </Field>
          <Field label="Payment screenshot (PNG, JPEG, WebP · up to 1 MB)">
            <Input
              density="comfortable"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => void upload(event.target.files?.[0])}
            />
          </Field>
          {proof && (
            <img
              src={proof}
              alt="Preview of your payment screenshot"
              className="max-h-40 w-full border object-contain"
            />
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="touch" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="touch"
              type="submit"
              disabled={!proof || reference.trim().length < 4 || reading}
            >
              <Upload />
              {reading ? "Reading screenshot…" : "Submit payment proof"}
            </Button>
          </div>
        </form>
      )}
    </FormFrame>
  );
}
