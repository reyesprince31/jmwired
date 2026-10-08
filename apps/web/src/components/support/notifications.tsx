"use client";

import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@jmwired/ui/components/button";
import { currentPayment, money, visibleAnnouncements, publicMessages } from "@/lib/mock-data";
import type { Customer } from "@/lib/mock-data";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import { Empty, Modal } from "@/components/portal/portal-ui";

export function Notifications({ admin, customer }: { admin: boolean; customer?: Customer }) {
  const { state, orgId } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState<string[]>([]);
  const scope = customer?.orgId ?? orgId;
  const entries = admin
    ? [
        ...state.payments
          .filter((payment) => payment.orgId === scope && payment.status === "Pending review")
          .map((payment) => ({
            id: payment.id,
            title: "Payment proof awaiting review",
            body: `${state.customers.find((entry) => entry.id === payment.customerId)?.name} · ${money(payment.amount)}`,
            date: payment.submitted,
          })),
        ...state.tickets
          .filter((ticket) => ticket.orgId === scope && ticket.status !== "Resolved")
          .map((ticket) => ({
            id: `${ticket.id}-${ticket.messages.at(-1)?.id}`,
            title: ticket.subject,
            body: `${ticket.id} · ${ticket.messages.at(-1)?.text}`,
            date: ticket.messages.at(-1)?.time,
          })),
      ]
    : customer
      ? [
          ...visibleAnnouncements(state, customer).map((announcement) => ({
            id: `${announcement.id}-${announcement.resolved}`,
            title: announcement.resolved ? `${announcement.title} · Resolved` : announcement.title,
            body: announcement.body,
            date: announcement.date,
          })),
          ...state.payments
            .filter((payment) => payment.customerId === customer.id && payment.orgId === scope)
            .slice(0, 2)
            .map((payment) => ({
              id: `${payment.id}-${payment.status}`,
              title: `Payment ${payment.status.toLowerCase()}`,
              body: `${money(payment.amount)} · ${payment.period}${payment.note ? ` · ${payment.note}` : ""}`,
              date: payment.submitted,
            })),
          ...state.tickets
            .filter(
              (ticket) =>
                ticket.orgId === scope &&
                ticket.customerId === customer.id &&
                publicMessages(ticket).at(-1)?.sender === "Support",
            )
            .map((ticket) => ({
              id: `${ticket.id}-${publicMessages(ticket).at(-1)?.id}`,
              title: `Support replied · ${ticket.subject}`,
              body: publicMessages(ticket).at(-1)?.text,
              date: publicMessages(ticket).at(-1)?.time,
            })),
          ...(state.preferences[customer.id]?.billing
            ? [
                {
                  id: `billing-reminder-${currentPayment(state, customer)?.status ?? "unpaid"}`,
                  title:
                    currentPayment(state, customer)?.status === "Paid"
                      ? "Your October bill is paid"
                      : "Your October bill is due soon",
                  body:
                    currentPayment(state, customer)?.status === "Paid"
                      ? "Your bill is already paid. Thank you!"
                      : `${money(customer.price)} due October ${customer.dueDay}.`,
                  date: "October billing cycle",
                },
              ]
            : []),
        ]
      : [];
  const unread = entries.filter((entry) => !read.includes(entry.id)).length;
  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="icon-touch"
          aria-label={`Notifications, ${unread} unread`}
          onClick={() => setOpen(true)}
        >
          <Bell />
        </Button>
        {unread > 0 && (
          <span className="pointer-events-none absolute right-1 top-1 size-1.5 rounded-full bg-primary" />
        )}
      </div>
      {open && (
        <Modal
          title="Notifications"
          description="Recent updates from your workspace."
          onClose={() => setOpen(false)}
        >
          <div className="mb-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRead(entries.map((entry) => entry.id))}
            >
              <CheckCheck />
              Mark all read
            </Button>
          </div>
          <div className="grid gap-3">
            {entries.length ? (
              entries.map((entry) => (
                <div
                  key={entry.id}
                  className={
                    read.includes(entry.id) ? "border p-4 opacity-60" : "border bg-muted/30 p-4"
                  }
                >
                  <p className="text-sm font-medium">{entry.title}</p>
                  <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                    {entry.body}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">{entry.date}</p>
                </div>
              ))
            ) : (
              <Empty title="All caught up" description="New activity will appear here." />
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
