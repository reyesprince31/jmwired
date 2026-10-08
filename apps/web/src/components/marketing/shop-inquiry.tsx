"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Download } from "lucide-react";
import { Button } from "@jmwired/ui/components/button";
import { Input } from "@jmwired/ui/components/input";
import { Textarea } from "@jmwired/ui/components/textarea";
import { Field, Select } from "@/components/portal/portal-ui";
import { shopItems } from "@/lib/shop-data";

export function ShopInquiry({ selectedItem }: { selectedItem: string }) {
  const [request, setRequest] = useState<{
    reference: string;
    item: string;
    quantity: number;
    name: string;
    phone: string;
    email: string;
    notes: string;
  } | null>(null);
  const [stored, setStored] = useState(true);
  function download() {
    if (!request) return;
    const text = [
      `JMWired inquiry ${request.reference}`,
      `Item: ${request.item}`,
      `Quantity / locations: ${request.quantity}`,
      `Name: ${request.name}`,
      `Phone: ${request.phone}`,
      `Email: ${request.email || "Not provided"}`,
      "",
      request.notes,
      "",
      "Prepared inquiry only. Availability, pricing, and delivery to the team need confirmation.",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${request.reference}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }
  return (
    <section className="mx-auto max-w-3xl px-5 py-12 lg:py-16">
      <Link href="/shop" className="text-sm text-muted-foreground hover:underline">
        ← Back to the shop
      </Link>
      {request ? (
        <div className="mt-8 grid gap-5 border p-6 sm:p-8">
          <Check className="size-8" />
          <h1 className="text-3xl font-semibold tracking-tight">Your inquiry is ready.</h1>
          <p className="text-sm text-muted-foreground">Reference {request.reference}</p>
          <div className="grid gap-2 border-y py-5">
            <p className="font-medium">{request.item}</p>
            <p className="text-sm">Quantity / locations: {request.quantity}</p>
            <p className="text-sm">
              {request.name} · {request.phone}
            </p>
            {request.notes && (
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">{request.notes}</p>
            )}
          </div>
          <p role="status" className="text-sm leading-relaxed text-muted-foreground">
            {stored
              ? "A copy is saved on this device."
              : "Browser storage is unavailable; download a copy to keep your request."}{" "}
            Download it to share with your local team. Online delivery is awaiting connection; no
            order or payment has been placed.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="touch" onClick={download}>
              <Download />
              Download inquiry
            </Button>
            <Button size="touch" variant="outline" onClick={() => setRequest(null)}>
              Prepare another inquiry
            </Button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="mt-8 text-4xl font-semibold tracking-tight">
            Let’s put your request together.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Choose an item or describe your project. Your team can confirm the right equipment,
            service scope, and price.
          </p>
          <form
            className="mt-8 grid gap-5"
            onSubmit={(event) => {
              event.preventDefault();
              const fields = new FormData(event.currentTarget);
              const inquiry = {
                reference: `JW-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
                item: String(fields.get("item")),
                quantity: Number(fields.get("quantity")),
                name: String(fields.get("name")).trim(),
                phone: String(fields.get("phone")).trim(),
                email: String(fields.get("email")).trim(),
                notes: String(fields.get("notes")).trim(),
              };
              if (
                !inquiry.name ||
                !inquiry.phone ||
                !Number.isInteger(inquiry.quantity) ||
                inquiry.quantity < 1 ||
                inquiry.quantity > 999
              )
                return;
              // ponytail: keep only the latest local inquiry; add a shared queue when online delivery is connected.
              try {
                localStorage.setItem("jmwired-shop-inquiry", JSON.stringify(inquiry));
                setStored(true);
              } catch {
                setStored(false);
              }
              setRequest(inquiry);
            }}
          >
            <Field label="Product or service">
              <Select
                name="item"
                defaultValue={
                  shopItems.find((entry) => entry.slug === selectedItem)?.name ?? "Custom request"
                }
              >
                <option>Custom request</option>
                {shopItems.map((entry) => (
                  <option key={entry.slug}>{entry.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Quantity or number of locations">
              <Input
                name="quantity"
                type="number"
                required
                min={1}
                max={999}
                step={1}
                defaultValue={1}
                density="comfortable"
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name">
                <Input
                  name="name"
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  density="comfortable"
                />
              </Field>
              <Field label="Phone number">
                <Input
                  name="phone"
                  type="tel"
                  required
                  minLength={7}
                  maxLength={30}
                  autoComplete="tel"
                  density="comfortable"
                />
              </Field>
            </div>
            <Field label="Email (optional)">
              <Input
                name="email"
                type="email"
                maxLength={150}
                autoComplete="email"
                density="comfortable"
              />
            </Field>
            <Field label="What do you need?">
              <Textarea
                name="notes"
                maxLength={1500}
                placeholder="Cable length, camera count, location, or the paperwork you need help with."
              />
            </Field>
            <p className="text-xs leading-relaxed text-muted-foreground">
              This prepares a downloadable inquiry on your device. Online submission will be
              available when connected. Use sample contact details for now, and keep passwords and
              personal documents out of this form.
            </p>
            <div>
              <Button type="submit" size="touch">
                Prepare inquiry
              </Button>
            </div>
          </form>
        </>
      )}
    </section>
  );
}
