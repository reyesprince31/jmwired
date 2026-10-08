"use client";
import { useState } from "react";
import { Button } from "@jmwired/ui/components/button";
import { Input } from "@jmwired/ui/components/input";
import { Textarea } from "@jmwired/ui/components/textarea";
import { QrCode } from "lucide-react";
import { toast } from "sonner";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import type { PaymentDestination } from "@/lib/mock-data";
import { readImage } from "@/lib/read-image";
import { Field, PageHeading, Panel, TextLink } from "@/components/portal/portal-ui";

export function PaymentSettingsPage() {
  const { state, orgId } = useWorkspace();
  return (
    <>
      <PageHeading
        title="Collection QR settings"
        description="Choose where your branch receives GCash, Maya, and bank payments."
      >
        <TextLink href="/organization/payments">Back to payments</TextLink>
      </PageHeading>
      <p className="border bg-muted/20 p-4 text-sm">
        Customers pay in their payment app and upload proof. Confirm the transfer in your collection
        account before approving it.
      </p>
      <div className="grid gap-5 xl:grid-cols-3">
        {(["GCash", "Maya", "Bank"] as const).map((method) => (
          <DestinationEditor
            key={`${orgId}-${method}`}
            method={method}
            destination={state.destinations.find(
              (entry) => entry.orgId === orgId && entry.method === method,
            )}
          />
        ))}
      </div>
    </>
  );
}
function DestinationEditor({
  method,
  destination,
}: {
  method: PaymentDestination["method"];
  destination?: PaymentDestination;
}) {
  const { dispatch, orgId } = useWorkspace();
  const [initial] = useState(destination);
  const [qr, setQr] = useState(destination?.qr ?? "");
  const [reading, setReading] = useState(false);
  return (
    <Panel title={method}>
      <form
        className="grid gap-4 border-t p-5"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const enabled = data.get("enabled") === "on";
          if (enabled && !qr) {
            toast.error("Attach your collection QR before enabling this method.");
            return;
          }
          dispatch({
            type: "destination",
            destination: {
              orgId,
              method,
              qr: qr || undefined,
              enabled,
              accountName: String(data.get("name")).trim(),
              accountNumber: String(data.get("number")).trim(),
              instructions: String(data.get("instructions")).trim(),
            },
          });
          toast.success(`${method} collection settings saved`);
        }}
      >
        {qr ? (
          <img
            src={qr}
            alt={`${method} QR preview`}
            className="h-40 w-full border object-contain"
          />
        ) : (
          <div className="flex h-40 flex-col items-center justify-center gap-3 border bg-muted/20">
            <QrCode className="size-12" />
            <span className="text-xs text-muted-foreground">No collection QR attached</span>
          </div>
        )}
        <Field label={`${method} account name`}>
          <Input name="name" required maxLength={100} defaultValue={initial?.accountName} />
        </Field>
        <Field label={`${method} account number`}>
          <Input name="number" required maxLength={80} defaultValue={initial?.accountNumber} />
        </Field>
        <Field label={`${method} collection QR (image up to 1 MB)`}>
          <Input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setReading(true);
              try {
                setQr(await readImage(file));
              } catch (error) {
                toast.error((error as Error).message);
              } finally {
                setReading(false);
              }
            }}
          />
        </Field>
        <Field label="Payment instructions">
          <Textarea
            name="instructions"
            maxLength={500}
            defaultValue={initial?.instructions}
            placeholder="e.g. Include your account number in the transfer message."
          />
        </Field>
        <label className="flex min-h-11 items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="enabled"
            className="size-4 accent-primary"
            defaultChecked={initial?.enabled}
          />
          Show this method to customers
        </label>
        <Button type="submit" disabled={reading}>
          Save {method} settings
        </Button>
      </form>
    </Panel>
  );
}
