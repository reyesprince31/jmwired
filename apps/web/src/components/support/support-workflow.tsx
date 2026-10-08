"use client";

import Link from "@/components/workspace/organization-link";
import { useState } from "react";
import { Button } from "@jmwired/ui/components/button";
import { Input } from "@jmwired/ui/components/input";
import { Textarea } from "@jmwired/ui/components/textarea";
import { ArrowUpRight, MessageSquare, Plus, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { Customer, Ticket } from "@/lib/mock-data";
import { timestamp, visibleAnnouncements, publicMessages } from "@/lib/mock-data";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import { Avatar, Empty, Field, FormFrame, Select, Status } from "@/components/portal/portal-ui";

export function SupportInbox({
  admin,
  customer,
  initialTicket,
}: {
  admin: boolean;
  customer?: Customer;
  initialTicket?: string;
}) {
  const { state, dispatch, orgId } = useWorkspace();
  const [filter, setFilter] = useState("All tickets");
  const [search, setSearch] = useState("");
  const [reply, setReply] = useState("");
  const [summary, setSummary] = useState(false);
  const [visibility, setVisibility] = useState("public");
  const [assignee, setAssignee] = useState("All assignees");
  const members =
    state.organizations
      .find((org) => org.id === orgId)
      ?.members.filter((member) => !member.invited) ?? [];

  const scope = customer?.orgId ?? orgId;
  const tickets = state.tickets.filter(
    (ticket) =>
      ticket.orgId === scope &&
      (admin || ticket.customerId === customer?.id) &&
      (filter === "All tickets" || ticket.status === filter) &&
      (!admin ||
        assignee === "All assignees" ||
        (ticket.assigneeId || "unassigned") === assignee) &&
      `${ticket.subject} ${ticket.id}`.toLowerCase().includes(search.toLowerCase()),
  );
  const selected = initialTicket
    ? tickets.find((ticket) => ticket.id === initialTicket)
    : tickets[0];
  const contact = state.customers.find(
    (entry) => entry.id === selected?.customerId && entry.orgId === scope,
  );
  function suggestion(ticket: Ticket) {
    const subscriber = state.customers.find(
      (entry) => entry.id === ticket.customerId && entry.orgId === scope,
    );
    const outage =
      subscriber &&
      visibleAnnouncements(state, subscriber).find(
        (entry) => entry.kind === "Outage" && !entry.resolved,
      );
    if (outage)
      return `Hi ${subscriber.name.split(" ")[0]}, we have an outage in your area: ${outage.title}. ${outage.body} We will update you in your portal when service is restored.`;
    if (ticket.category === "Billing")
      return `Hi ${contact?.name.split(" ")[0] ?? "there"}, thanks for reaching out. We can review your billing request. Please confirm your preferred billing date and our team will check the available options.`;
    if (ticket.category === "Slow connection")
      return `Hi ${contact?.name.split(" ")[0] ?? "there"}, please try a speed test with a device connected directly to the router. Send us the result and the time of the test so our team can investigate.`;
    return `Hi ${contact?.name.split(" ")[0] ?? "there"}, thanks for reporting this. Please check the router's power and fiber cable without unplugging the fiber connector. If the LOS light is red, let us know and our team will check your line.`;
  }
  function send(text = reply) {
    if (!selected || !text.trim()) return;
    dispatch({
      type: "reply",
      orgId: scope,
      id: selected.id,
      message: {
        id: crypto.randomUUID(),
        sender: admin ? "Support" : "Customer",
        text: text.trim(),
        time: timestamp(),
        visibility: admin && visibility === "staff_only" ? "staff_only" : "public",
      },
    });
    if (admin && visibility !== "staff_only" && selected.status === "Open")
      dispatch({ type: "ticket-status", orgId: scope, id: selected.id, status: "In progress" });
    setReply("");
    toast.success(
      admin && visibility === "staff_only"
        ? "Internal note saved"
        : admin
          ? "Reply sent to the customer portal"
          : "Reply sent to support",
    );
  }
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <div className="w-56">
            <Input
              aria-label="Search support tickets"
              placeholder="Search tickets…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          {admin && (
            <div className="w-40">
              <Select
                aria-label="Filter ticket assignee"
                value={assignee}
                onChange={(event) => setAssignee(event.target.value)}
              >
                <option>All assignees</option>
                <option value="unassigned">Unassigned</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </Select>
            </div>
          )}
          <div className="w-36">
            <Select
              aria-label="Filter ticket status"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option>All tickets</option>
              <option>Open</option>
              <option>In progress</option>
              <option>Resolved</option>
            </Select>
          </div>
        </div>
        {!admin && (
          <Button
            size="touch"
            nativeButton={false}
            role="link"
            render={<Link href="/portal/support/new" />}
          >
            <Plus />
            New request
          </Button>
        )}
      </div>
      <div className="grid min-h-96 border lg:grid-cols-[18rem_1fr]">
        <div className="border-b bg-muted/20 lg:border-r lg:border-b-0">
          <div className="border-b px-4 py-3 text-xs text-muted-foreground">
            {tickets.length} {tickets.length === 1 ? "conversation" : "conversations"}
          </div>
          {tickets.length ? (
            tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={admin ? `/organization/support/${ticket.id}` : `/portal/support/${ticket.id}`}
                aria-current={selected?.id === ticket.id ? "page" : undefined}
                className={
                  selected?.id === ticket.id
                    ? "flex w-full flex-col gap-2 border-b border-l-2 border-l-primary bg-accent px-4 py-4 text-left text-sm focus-visible:outline-2"
                    : "flex w-full flex-col gap-2 border-b border-l-2 border-l-transparent px-4 py-4 text-left text-sm hover:bg-muted focus-visible:outline-2"
                }
              >
                <span className="font-medium">{ticket.subject}</span>
                <span className="text-xs text-muted-foreground">
                  {ticket.id} ·{" "}
                  {state.customers.find((entry) => entry.id === ticket.customerId)?.name}
                </span>
                <Status>{ticket.status}</Status>
              </Link>
            ))
          ) : (
            <Empty title="No requests here" description="New support requests will appear here." />
          )}
        </div>
        {selected ? (
          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
              <div className="flex items-center gap-3">
                <Avatar name={contact?.name ?? "Customer"} />
                <div>
                  <h2 className="text-sm font-semibold">{selected.subject}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {selected.id} · {contact?.name} · {selected.category}
                  </p>
                </div>
              </div>
              {admin ? (
                <div className="flex flex-wrap gap-2">
                  <div className="w-40">
                    <Select
                      aria-label="Ticket assignee"
                      value={selected.assigneeId ?? ""}
                      onChange={(event) =>
                        dispatch({
                          type: "ticket-details",
                          orgId: scope,
                          id: selected.id,
                          assigneeId: event.target.value,
                          priority: selected.priority ?? "Normal",
                        })
                      }
                    >
                      <option value="">Unassigned</option>
                      {members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="w-28">
                    <Select
                      aria-label="Ticket priority"
                      value={selected.priority ?? "Normal"}
                      onChange={(event) =>
                        dispatch({
                          type: "ticket-details",
                          orgId: scope,
                          id: selected.id,
                          assigneeId: selected.assigneeId ?? "",
                          priority: event.target.value as "Normal" | "Urgent",
                        })
                      }
                    >
                      <option>Normal</option>
                      <option>Urgent</option>
                    </Select>
                  </div>
                  <div className="w-36">
                    <Select
                      aria-label="Ticket status"
                      value={selected.status}
                      onChange={(event) =>
                        dispatch({
                          type: "ticket-status",
                          orgId: scope,
                          id: selected.id,
                          status: event.target.value as Ticket["status"],
                        })
                      }
                    >
                      <option>Open</option>
                      <option>In progress</option>
                      <option>Resolved</option>
                    </Select>
                  </div>
                </div>
              ) : (
                <Status>{selected.status}</Status>
              )}
            </div>
            <div
              className="flex max-h-96 flex-1 flex-col gap-5 overflow-y-auto p-5"
              aria-label="Conversation messages"
            >
              {(admin ? selected.messages : publicMessages(selected)).map((message) => (
                <div
                  key={message.id}
                  className={
                    message.sender === "Support"
                      ? "ml-auto w-full max-w-lg border bg-muted/50 p-4"
                      : "mr-auto w-full max-w-lg border p-4"
                  }
                >
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-medium">
                      {message.sender === "Support" ? "JMWired support" : contact?.name}
                      {message.visibility === "staff_only" && " · Internal note"}
                    </span>
                    <span className="text-muted-foreground">{message.time}</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
                </div>
              ))}
            </div>
            {admin && state.platform.aiEnabled && (
              <div className="mx-5 mb-4 border bg-muted/30 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-xs font-semibold">
                    <Sparkles className="size-4" />
                    AI assistance
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setSummary(!summary)}>
                    Summarize
                  </Button>
                </div>
                {summary && (
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {contact?.name} reported {selected.category.toLowerCase()}. The conversation
                    contains {selected.messages.length} messages. Latest message: “
                    {selected.messages.at(-1)?.text}” Current status:{" "}
                    {selected.status.toLowerCase()}.
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReply(suggestion(selected))}
                  >
                    Draft quick response
                    <ArrowUpRight />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => send(suggestion(selected))}>
                    Send suggested reply
                    <Send />
                  </Button>
                </div>
              </div>
            )}
            <form
              className="grid gap-3 border-t p-5"
              onSubmit={(event) => {
                event.preventDefault();
                send();
              }}
            >
              <Field label={admin ? "Reply to customer" : "Reply to support"}>
                {admin && (
                  <Select
                    aria-label="Message visibility"
                    value={visibility}
                    onChange={(event) => setVisibility(event.target.value)}
                  >
                    <option value="public">Public reply</option>
                    <option value="staff_only">Internal staff note</option>
                  </Select>
                )}
                <Textarea
                  aria-label={admin ? "Reply to customer" : "Reply to support"}
                  placeholder="Write your message…"
                  value={reply}
                  maxLength={2000}
                  onChange={(event) => setReply(event.target.value)}
                  required
                />
              </Field>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  {selected.status === "Resolved"
                    ? "This request is resolved. You can still add a follow-up."
                    : "Replies appear in the customer portal."}
                </p>
                <Button size={admin ? "default" : "touch"} type="submit" disabled={!reply.trim()}>
                  <Send />
                  {admin && visibility === "staff_only" ? "Save internal note" : "Send reply"}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <Empty
            title="Your support inbox is clear"
            description="Choose a conversation or submit a new request."
          />
        )}
      </div>
    </>
  );
}

export function NewTicket({
  customer,
  onClose,
  onCreated,
  page = false,
}: {
  customer: Customer;
  onClose: () => void;
  onCreated?: (id: string) => void;
  page?: boolean;
}) {
  const { state, dispatch } = useWorkspace();
  return (
    <FormFrame
      page={page}
      title="How can we help?"
      description="Your local support team will see this request in their inbox."
      onClose={onClose}
    >
      <form
        className="grid gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const subject = String(data.get("subject")).trim();
          const details = String(data.get("details")).trim();
          if (subject.length < 3 || details.length < 5) {
            toast.error("Please enter a subject and a short description of the issue.");
            return;
          }
          const id = `TK-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
          dispatch({
            type: "ticket",
            ticket: {
              id,
              orgId: customer.orgId,
              customerId: customer.id,
              subject,
              category: String(data.get("category")),
              status: "Open",
              messages: [
                {
                  id: crypto.randomUUID(),
                  sender: "Customer",
                  text: details,
                  time: timestamp(),
                },
              ],
            },
          });
          const responder = state.organizations.find((org) => org.id === customer.orgId)?.responder;
          const hour = Number(
            // ponytail: off-hours are 8 AM–5 PM; use branch schedules when live automation is connected.
            new Intl.DateTimeFormat("en-PH", {
              hour: "numeric",
              hourCycle: "h23",
              timeZone: "Asia/Manila",
            }).format(new Date()),
          );
          const outage = visibleAnnouncements(state, customer).some(
            (entry) => entry.kind === "Outage" && !entry.resolved,
          );
          if (
            responder?.enabled &&
            responder.message.trim() &&
            (responder.mode === "Outages" ? outage : hour < 8 || hour >= 17)
          )
            dispatch({
              type: "reply",
              orgId: customer.orgId,
              id,
              message: {
                id: crypto.randomUUID(),
                sender: "Support",
                text: responder.message,
                time: timestamp(),
              },
            });
          if (onCreated) onCreated(id);
          else onClose();
          toast.success("Request submitted. You can track it in Support.");
        }}
      >
        <Field label="What is the issue?">
          <Select name="category">
            <option>No internet</option>
            <option>Red LOS light</option>
            <option>Slow connection</option>
            <option>Billing</option>
            <option>Relocation</option>
            <option>Other</option>
          </Select>
        </Field>
        <Field label="Subject">
          <Input
            name="subject"
            density="comfortable"
            placeholder="e.g. Red LOS light on my router"
            required
            minLength={3}
            maxLength={120}
            pattern=".*\S.*"
          />
        </Field>
        <Field label="Tell us what happened">
          <Textarea
            name="details"
            placeholder="When did it start? What have you tried?"
            required
            minLength={5}
            maxLength={2000}
          />
        </Field>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="touch" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button size="touch" type="submit">
            <MessageSquare />
            Submit request
          </Button>
        </div>
      </form>
    </FormFrame>
  );
}
