import assert from "node:assert/strict";
import { test } from "node:test";
import {
  BILLING_PERIOD,
  currentPayment,
  initialState,
  mockReducer,
  visibleAnnouncements,
  workspaceCustomer,
  monthlySummary,
  publicMessages,
  restoreWorkspace,
  billDueDate,
} from "./mock-data.ts";

test("connected payment, ticket, and organization demo flows", () => {
  const maria = initialState.customers[0];
  assert.equal(workspaceCustomer(initialState, maria.orgId, maria.id)?.id, maria.id);
  assert.equal(workspaceCustomer(initialState, "san-jose", maria.id)?.id, "SJ-001");
  assert.equal(workspaceCustomer(initialState, "new-area", ""), undefined);
  assert.equal(
    workspaceCustomer(
      {
        ...initialState,
        customers: [...initialState.customers, { ...maria, id: "NEW-001", orgId: "new-area" }],
      },
      "new-area",
      "",
    )?.id,
    "NEW-001",
  );
  const submission = {
    id: "test-payment",
    orgId: maria.orgId,
    customerId: maria.id,
    period: BILLING_PERIOD,
    amount: maria.price,
    method: "GCash",
    reference: "DEMO123",
    status: "Pending review",
    submitted: "Today",
  };
  let state = mockReducer(initialState, { type: "payment", payment: submission });
  assert.equal(currentPayment(state, maria)?.status, "Pending review");
  assert.equal(
    mockReducer(state, { type: "payment", payment: submission }).payments.length,
    state.payments.length,
  );
  state = mockReducer(state, {
    type: "review",
    orgId: "san-jose",
    id: submission.id,
    status: "Paid",
    note: "",
  });
  assert.equal(currentPayment(state, maria)?.status, "Pending review");
  state = mockReducer(state, {
    type: "review",
    orgId: maria.orgId,
    id: submission.id,
    status: "Rejected",
    note: "Unreadable proof",
  });
  assert.equal(currentPayment(state, maria), undefined);
  state = mockReducer(state, { type: "payment", payment: { ...submission, id: "resubmitted" } });
  state = mockReducer(state, {
    type: "review",
    orgId: maria.orgId,
    id: "resubmitted",
    status: "Paid",
    note: "Verified",
  });
  assert.equal(currentPayment(state, maria)?.status, "Paid");
  assert.equal(
    mockReducer(state, { type: "payment", payment: { ...submission, id: "duplicate-paid" } })
      .payments.length,
    state.payments.length,
  );
  assert.equal(
    mockReducer(initialState, { type: "payment", payment: { ...submission, amount: 1 } }).payments
      .length,
    initialState.payments.length,
  );
  const announcement = {
    id: "targeted",
    orgId: maria.orgId,
    title: "Private update",
    body: "Demo",
    kind: "Announcement",
    customerIds: [maria.id],
    date: "Today",
  };
  state = mockReducer(state, { type: "announcement", announcement });
  assert(visibleAnnouncements(state, maria).some((entry) => entry.id === "targeted"));
  assert(
    !visibleAnnouncements(state, initialState.customers[1]).some(
      (entry) => entry.id === "targeted",
    ),
  );
  assert(
    !visibleAnnouncements(state, initialState.customers.at(-1)).some(
      (entry) => entry.id === "targeted",
    ),
  );
  const ticket = state.tickets[0];
  state = mockReducer(state, {
    type: "reply",
    orgId: "san-jose",
    id: ticket.id,
    message: { id: "reply", sender: "Support", text: "Wrong organization", time: "Today" },
  });
  assert.equal(state.tickets[0].messages.length, ticket.messages.length);
  state = mockReducer(state, {
    type: "reply",
    orgId: ticket.orgId,
    id: ticket.id,
    message: {
      id: "reply",
      sender: "Support",
      text: "Our technician is on the way.",
      time: "Today",
    },
  });
  assert.equal(state.tickets[0].messages.at(-1)?.text, "Our technician is on the way.");
  assert.equal(
    initialState.payments.find((entry) => entry.id === "PAY-1")?.status,
    "Pending review",
  );
  assert.equal(billDueDate("2026-02", 31), "2026-02-28");
  assert.equal(billDueDate("2028-02", 31), "2028-02-29");
  assert.equal(monthlySummary(initialState, "poblacion", BILLING_PERIOD).profit, 2945);
  const expense = {
    id: "expense-test",
    orgId: "poblacion",
    title: "Repairs",
    amount: 250,
    category: "Repairs",
    date: "2026-10-08",
    payee: "Crew",
    note: "",
  };
  state = mockReducer(state, { type: "expense", expense });
  assert.equal(monthlySummary(state, "poblacion", BILLING_PERIOD).expenses, 3000);
  assert.equal(monthlySummary(state, "san-jose", BILLING_PERIOD).expenses, 0);
  assert.equal(mockReducer(state, { type: "expense", expense: { ...expense, amount: -1 } }), state);
  state = mockReducer(state, { type: "delete-expense", orgId: "san-jose", id: expense.id });
  assert(state.expenses.some((entry) => entry.id === expense.id));
  state = mockReducer(state, {
    type: "reply",
    orgId: ticket.orgId,
    id: ticket.id,
    message: {
      id: "internal",
      sender: "Support",
      visibility: "staff_only",
      text: "Private repair notes",
      time: "Today",
    },
  });
  assert(
    !publicMessages(state.tickets.find((entry) => entry.id === ticket.id)).some(
      (message) => message.id === "internal",
    ),
  );
  const before = state.tickets.find((entry) => entry.id === ticket.id).assigneeId;
  state = mockReducer(state, {
    type: "ticket-details",
    orgId: "poblacion",
    id: ticket.id,
    assigneeId: "foreign-member",
    priority: "Urgent",
  });
  assert.equal(state.tickets.find((entry) => entry.id === ticket.id).assigneeId, before);
  state = mockReducer(state, {
    type: "activate",
    code: maria.activationCode,
    email: "claimed@example.com",
  });
  assert.equal(
    state.customers.find((customer) => customer.id === maria.id).portalStatus,
    "Activated",
  );
  const activated = state.customers.find((customer) => customer.id === maria.id);
  state = mockReducer(state, {
    type: "activate",
    code: maria.activationCode,
    email: "second@example.com",
  });
  assert.equal(
    state.customers.find((customer) => customer.id === maria.id),
    activated,
  );
  state = mockReducer(state, {
    type: "platform-settings",
    changes: { maintenanceMode: true },
    id: "audit-test",
    time: "Today",
  });
  assert(state.platform.maintenanceMode);
  assert.equal(state.audit[0].id, "audit-test");
  state = mockReducer(state, { type: "application", application: initialState.applications[0] });
  assert.equal(state.applications.length, initialState.applications.length);
  const legacy = { ...initialState };
  delete legacy.expenses;
  delete legacy.profile;
  delete legacy.platform;
  assert.equal(restoreWorkspace(legacy).expenses.length, 3);
  state = mockReducer(state, { type: "revoke-session", id: "current" });
  assert(state.profile.sessions.some((session) => session.current));
  assert.equal(
    mockReducer(
      { ...initialState, customers: [{ ...maria, status: "Pending installation" }] },
      { type: "payment", payment: submission },
    ).payments.length,
    initialState.payments.length,
  );
});
