export type Member = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member" | "billing" | "technician" | "support";
  invited?: boolean;
};
export type Organization = {
  id: string;
  name: string;
  area: string;
  members: Member[];
  phone?: string;
  contactEmail?: string;
  officeHours?: string;
  responder?: { enabled: boolean; mode: "Outages" | "Off-hours"; message: string };
};
export type Customer = {
  id: string;
  orgId: string;
  name: string;
  email: string;
  address: string;
  plan: string;
  speed: number;
  price: number;
  dueDay: number;
  status: "Active" | "Suspended" | "Pending installation";
  usage: number;
  phone?: string;
  area?: string;
  type?: "Existing" | "New";
  installationDate?: string;
  notes?: string;
  portalStatus?: "Unregistered" | "Invited" | "Activated";
  activationCode?: string;
};
export type Payment = {
  id: string;
  orgId: string;
  customerId: string;
  period: string;
  amount: number;
  method: "GCash" | "Maya" | "Bank" | "Cash";
  reference: string;
  status: "Pending review" | "Paid" | "Rejected";
  proof?: string;
  proofName?: string;
  submitted: string;
  note?: string;
  reviewedBy?: string;
};
export type Message = {
  id: string;
  sender: "Customer" | "Support";
  text: string;
  time: string;
  visibility?: "public" | "staff_only";
};
export type Ticket = {
  id: string;
  orgId: string;
  customerId: string;
  subject: string;
  category: string;
  status: "Open" | "In progress" | "Resolved";
  messages: Message[];
  assigneeId?: string;
  priority?: "Normal" | "Urgent";
};
export type Expense = {
  id: string;
  orgId: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  payee: string;
  note: string;
  receipt?: string;
};
export type PaymentDestination = {
  orgId: string;
  method: "GCash" | "Maya" | "Bank";
  accountName: string;
  accountNumber: string;
  instructions: string;
  qr?: string;
  enabled: boolean;
};
export type Application = {
  id: string;
  orgId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  plan: number;
  note: string;
  status: "New" | "Contacted" | "Approved" | "Declined";
  date: string;
  customerId?: string;
};
export type PlatformConfig = {
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  aiEnabled: boolean;
  aiProvider: string;
  aiModel: string;
  monthlyAiTokenCap: number;
  aiKeyConfigured: boolean;
};
export type AuditEntry = {
  id: string;
  orgId?: string;
  action: string;
  actor: string;
  time: string;
};
export type Announcement = {
  id: string;
  orgId: string;
  title: string;
  body: string;
  kind: "Announcement" | "Maintenance" | "Outage";
  customerIds: string[];
  date: string;
  scheduled?: string;
  resolved?: boolean;
};
export type MockState = {
  organizations: Organization[];
  customers: Customer[];
  payments: Payment[];
  tickets: Ticket[];
  announcements: Announcement[];
  preferences: Record<string, { billing: boolean; maintenance: boolean }>;
  userRoles: Record<string, "user" | "admin">;
  expenses: Expense[];
  destinations: PaymentDestination[];
  applications: Application[];
  platform: PlatformConfig;
  audit: AuditEntry[];
  profile: {
    name: string;
    email: string;
    sessions: { id: string; device: string; lastActive: string; current: boolean }[];
  };
};

export const BILLING_PERIOD = "2026-10";
export const money = (amount: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(amount);
export const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
export const timestamp = () =>
  new Date().toLocaleString("en-PH", {
    timeZone: "Asia/Manila",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
export function cashPayment(customer: Customer, period = BILLING_PERIOD): Payment {
  const id = crypto.randomUUID();
  return {
    id,
    orgId: customer.orgId,
    customerId: customer.id,
    period,
    amount: customer.price,
    method: "Cash",
    reference: `CASH-${id.slice(0, 6)}`,
    status: "Paid",
    submitted: timestamp(),
    note: "Cash payment recorded by staff.",
    reviewedBy: "Staff",
  };
}
export function billDueDate(period: string, day: number) {
  const [year, month] = period.split("-").map(Number);
  const lastDay = new Date(year!, month!, 0).getDate();
  return `${period}-${String(Math.min(day, lastDay)).padStart(2, "0")}`;
}
const owner: Member = {
  id: "owner",
  name: "Prince Reyes",
  email: "prince@example.com",
  role: "owner",
};
const names = [
  "Maria Santos",
  "Paolo Reyes",
  "Ana Garcia",
  "Carlo Mendoza",
  "Luis Dela Cruz",
  "Isabella Ramos",
  "Rafael Lim",
  "Nico Torres",
  "Bea Aquino",
];
const prices = [999, 1499, 1499, 999, 999, 999, 1199, 999, 999];
const customers: Customer[] = names.map((name, index) => ({
  id: `JM-00${index + 1}`,
  orgId: "poblacion",
  name,
  email: `${name.toLowerCase().replaceAll(" ", ".")}@example.com`,
  address: `${index + 12} Mabini Street, Poblacion`,
  plan:
    prices[index] === 1499
      ? "Home Fiber 100"
      : prices[index] === 1199
        ? "Home Fiber 75"
        : "Home Fiber 50",
  speed: prices[index] === 1499 ? 100 : prices[index] === 1199 ? 75 : 50,
  price: prices[index]!,
  dueDay: index % 2 ? 10 : 15,
  status: index === 8 ? "Suspended" : "Active",
  usage: index ? 89.6 + index * 17 : 186.4,
  phone: "0917 555 0100",
  area: "Poblacion",
  type: "Existing",
  installationDate: "2025-06-15",
  portalStatus: index === 0 ? "Invited" : "Unregistered",
  activationCode: `JM-ACT-00${index + 1}`,
  notes: index === 8 ? "Line cut. Follow up before reconnecting." : "",
}));

export const initialState: MockState = {
  organizations: [
    {
      id: "poblacion",
      name: "JMWired",
      area: "Poblacion",
      members: [
        owner,
        { id: "staff", name: "Alex Cruz", email: "alex@example.com", role: "admin" },
        { id: "tech", name: "Marco Dela Cruz", email: "marco@example.com", role: "technician" },
      ],
    },
    { id: "san-jose", name: "JMWired", area: "San Jose", members: [owner] },
  ],
  customers: [
    ...customers,
    {
      ...customers[0]!,
      id: "SJ-001",
      orgId: "san-jose",
      name: "Sofia Villanueva",
      email: "sofia@example.com",
      address: "24 Rizal Street, San Jose",
      usage: 112.7,
    },
  ],
  payments: [
    ...[2, 3, 5, 6, 7].map((index): Payment => ({
      id: `PAY-${index}`,
      orgId: "poblacion",
      customerId: customers[index]!.id,
      period: BILLING_PERIOD,
      amount: prices[index]!,
      method: "GCash",
      reference: `GC-826100${index}`,
      status: "Paid",
      submitted: "Oct 5, 10:30 AM",
    })),
    {
      id: "PAY-1",
      orgId: "poblacion",
      customerId: "JM-002",
      period: BILLING_PERIOD,
      amount: 1499,
      method: "Maya",
      reference: "MY-10482973",
      status: "Pending review",
      submitted: "Oct 8, 8:16 AM",
      proof: "/mock-payment.svg",
      proofName: "maya-receipt-demo.svg",
    },
    {
      id: "PAY-4",
      orgId: "poblacion",
      customerId: "JM-005",
      period: BILLING_PERIOD,
      amount: 999,
      method: "GCash",
      reference: "GC-10482974",
      status: "Pending review",
      submitted: "Oct 8, 9:42 AM",
      proof: "/mock-payment.svg",
      proofName: "gcash-receipt-demo.svg",
    },
    {
      id: "PAY-history",
      orgId: "poblacion",
      customerId: "JM-001",
      period: "2026-09",
      amount: 999,
      method: "GCash",
      reference: "GC-SEP-1001",
      status: "Paid",
      submitted: "Sep 14, 4:02 PM",
    },
    {
      id: "PAY-history-2",
      orgId: "poblacion",
      customerId: "JM-001",
      period: "2026-08",
      amount: 999,
      method: "Cash",
      reference: "CASH-AUG-1001",
      status: "Paid",
      submitted: "Aug 15, 10:02 AM",
    },
  ],
  tickets: [
    {
      id: "TK-1001",
      orgId: "poblacion",
      customerId: "JM-001",
      subject: "No internet since this morning",
      category: "No internet",
      status: "Open",
      assigneeId: "tech",
      priority: "Urgent",
      messages: [
        {
          id: "m1",
          sender: "Customer",
          text: "Hi! Our internet stopped working around 8 AM. The LOS light on our router is blinking red. Can someone check our connection?",
          time: "Oct 8, 8:24 AM",
        },
      ],
    },
    {
      id: "TK-1002",
      orgId: "poblacion",
      customerId: "JM-003",
      subject: "Slow speeds in the evening",
      category: "Slow connection",
      status: "In progress",
      messages: [
        {
          id: "m2",
          sender: "Customer",
          text: "Our connection slows down after 7 PM. It works fine in the morning.",
          time: "Oct 7, 7:42 PM",
        },
        {
          id: "m3",
          sender: "Support",
          text: "Thanks, Ana. We are checking the evening traffic in your area. Could you send a speed test using a wired connection?",
          time: "Oct 7, 8:10 PM",
        },
      ],
    },
    {
      id: "TK-1003",
      orgId: "poblacion",
      customerId: "JM-004",
      subject: "Billing question",
      category: "Billing",
      status: "Open",
      messages: [
        {
          id: "m4",
          sender: "Customer",
          text: "Can I move my billing date to the 20th of each month?",
          time: "Oct 8, 9:15 AM",
        },
      ],
    },
    {
      id: "TK-0998",
      orgId: "poblacion",
      customerId: "JM-001",
      subject: "Router setup assistance",
      category: "Other",
      status: "Resolved",
      messages: [
        {
          id: "m5",
          sender: "Customer",
          text: "How do I change my Wi-Fi name?",
          time: "Sep 22, 1:00 PM",
        },
        {
          id: "m6",
          sender: "Support",
          text: "We helped update your Wi-Fi name during our call. Please reach out if you need anything else!",
          time: "Sep 22, 1:24 PM",
        },
      ],
    },
  ],
  announcements: [
    {
      id: "ANN-1",
      orgId: "poblacion",
      title: "Scheduled network maintenance",
      body: "Brief interruptions expected while we improve your connection.",
      kind: "Maintenance",
      customerIds: [],
      date: "Oct 8",
      scheduled: "October 12, 1:00–3:00 AM",
    },
    {
      id: "ANN-2",
      orgId: "poblacion",
      title: "Welcome to your customer portal",
      body: "Upload payment proof, get updates, and reach your support team in one place.",
      kind: "Announcement",
      customerIds: [],
      date: "Oct 5",
    },
    {
      id: "ANN-3",
      orgId: "san-jose",
      title: "San Jose is now connected",
      body: "Welcome to JMWired. Your local support team is here to help.",
      kind: "Announcement",
      customerIds: [],
      date: "Oct 5",
    },
  ],
  preferences: {},
  userRoles: { owner: "admin" },
  expenses: [
    {
      id: "EXP-1",
      orgId: "poblacion",
      title: "Upstream internet",
      category: "Internet",
      amount: 1800,
      date: "2026-10-01",
      payee: "Upstream provider",
      note: "Monthly bandwidth",
    },
    {
      id: "EXP-2",
      orgId: "poblacion",
      title: "Tower electricity",
      category: "Electricity",
      amount: 550,
      date: "2026-10-03",
      payee: "Local electric cooperative",
      note: "",
    },
    {
      id: "EXP-3",
      orgId: "poblacion",
      title: "Fiber repair",
      category: "Repairs",
      amount: 400,
      date: "2026-10-06",
      payee: "Field crew",
      note: "Mabini Street splice",
    },
  ],
  destinations: [],
  applications: [
    {
      id: "APP-1001",
      orgId: "poblacion",
      name: "Daniel Flores",
      phone: "0918 555 0123",
      email: "daniel@example.com",
      address: "45 Mabini Street, Poblacion",
      plan: 50,
      note: "Available for a survey on Saturday.",
      status: "New",
      date: "Oct 8, 10:00 AM",
    },
  ],
  platform: {
    maintenanceMode: false,
    allowRegistrations: true,
    aiEnabled: true,
    aiProvider: "OpenAI",
    aiModel: "Provider default",
    monthlyAiTokenCap: 1000000,
    aiKeyConfigured: false,
  },
  audit: [
    {
      id: "AUD-1",
      action: "Organization created · Poblacion",
      actor: "Prince Reyes",
      time: "Oct 5, 9:00 AM",
      orgId: "poblacion",
    },
  ],
  profile: {
    name: "Prince Reyes",
    email: "prince@example.com",
    sessions: [
      { id: "current", device: "Windows · Edge", lastActive: "Active now", current: true },
      { id: "phone", device: "Android · Chrome", lastActive: "Oct 7, 8:30 PM", current: false },
    ],
  },
};

// Older browser previews retain their records when new UI fields are introduced.
export function restoreWorkspace(saved: MockState): MockState {
  return { ...initialState, ...saved, platform: { ...initialState.platform, ...saved.platform } };
}

export function publicMessages(ticket: Ticket) {
  return ticket.messages.filter((message) => message.visibility !== "staff_only");
}

export function monthlySummary(state: MockState, orgId: string, period: string) {
  // ponytail: historical totals use current subscriber records; replace with per-month Convex bills before live accounting.
  const customers = state.customers.filter(
    (customer) =>
      customer.orgId === orgId &&
      (!customer.installationDate || customer.installationDate.slice(0, 7) <= period),
  );
  const paid = state.payments.filter(
    (payment) => payment.orgId === orgId && payment.period === period && payment.status === "Paid",
  );
  const collections = paid.reduce((sum, payment) => sum + payment.amount, 0);
  const expenses = state.expenses
    .filter((expense) => expense.orgId === orgId && expense.date.startsWith(period))
    .reduce((sum, expense) => sum + expense.amount, 0);
  return {
    customers: customers.length,
    paid: new Set(paid.map((payment) => payment.customerId)).size,
    collections,
    expenses,
    profit: collections - expenses,
  };
}

export function workspaceCustomer(state: MockState, orgId: string, customerId: string) {
  return (
    state.customers.find((customer) => customer.orgId === orgId && customer.id === customerId) ??
    state.customers.find((customer) => customer.orgId === orgId)
  );
}

export function customerPayments(state: MockState, customer: Customer) {
  return state.payments.filter(
    (payment) => payment.orgId === customer.orgId && payment.customerId === customer.id,
  );
}
export function visibleAnnouncements(state: MockState, customer: Customer) {
  return state.announcements.filter(
    (announcement) =>
      announcement.orgId === customer.orgId &&
      (!announcement.customerIds.length || announcement.customerIds.includes(customer.id)),
  );
}
export function currentPayment(state: MockState, customer: Customer, period = BILLING_PERIOD) {
  return customerPayments(state, customer).find(
    (payment) => payment.period === period && payment.status !== "Rejected",
  );
}

export type Action =
  | { type: "organization"; organization: Organization }
  | { type: "customer"; customer: Customer }
  | { type: "payment"; payment: Payment }
  | { type: "review"; orgId: string; id: string; status: "Paid" | "Rejected"; note: string }
  | { type: "ticket"; ticket: Ticket }
  | { type: "reply"; orgId: string; id: string; message: Message }
  | { type: "ticket-status"; orgId: string; id: string; status: Ticket["status"] }
  | { type: "announcement"; announcement: Announcement }
  | { type: "resolve-alert"; orgId: string; id: string }
  | { type: "member"; orgId: string; member: Member }
  | { type: "member-role"; orgId: string; id: string; role: Member["role"] }
  | { type: "preferences"; customerId: string; billing: boolean; maintenance: boolean }
  | { type: "platform-role"; id: string; role: "user" | "admin" }
  | { type: "customer-status"; orgId: string; id: string; status: Customer["status"] }
  | {
      type: "customer-details";
      orgId: string;
      id: string;
      changes: Partial<
        Pick<
          Customer,
          | "name"
          | "email"
          | "phone"
          | "address"
          | "area"
          | "notes"
          | "dueDay"
          | "installationDate"
          | "type"
          | "portalStatus"
          | "activationCode"
        >
      >;
    }
  | {
      type: "organization-settings";
      orgId: string;
      changes: Partial<
        Pick<Organization, "name" | "area" | "phone" | "contactEmail" | "officeHours" | "responder">
      >;
    }
  | { type: "expense"; expense: Expense }
  | { type: "delete-expense"; orgId: string; id: string }
  | { type: "destination"; destination: PaymentDestination }
  | {
      type: "ticket-details";
      orgId: string;
      id: string;
      assigneeId: string;
      priority: "Normal" | "Urgent";
    }
  | { type: "application"; application: Application }
  | {
      type: "application-status";
      orgId: string;
      id: string;
      status: Application["status"];
      customerId?: string;
    }
  | { type: "activate"; code: string; email: string }
  | { type: "platform-settings"; changes: Partial<PlatformConfig>; time: string; id: string }
  | { type: "profile"; name: string; email: string }
  | { type: "revoke-session"; id: string }
  | { type: "audit"; entry: AuditEntry }
  | { type: "reset" };

// ponytail: browser snapshots use last-writer-wins across tabs; use scoped Convex mutations for concurrent production edits.
function transition(state: MockState, action: Action): MockState {
  switch (action.type) {
    case "organization":
      return state.organizations.some((org) => org.id === action.organization.id)
        ? state
        : { ...state, organizations: [...state.organizations, action.organization] };
    case "customer":
      return state.customers.some((customer) => customer.id === action.customer.id) ||
        !state.organizations.some((org) => org.id === action.customer.orgId)
        ? state
        : { ...state, customers: [...state.customers, action.customer] };
    case "payment": {
      const customer = state.customers.find(
        (entry) => entry.id === action.payment.customerId && entry.orgId === action.payment.orgId,
      );
      if (
        !customer ||
        customer.status === "Pending installation" ||
        action.payment.amount !== customer.price ||
        !/^\d{4}-(0[1-9]|1[0-2])$/.test(action.payment.period) ||
        currentPayment(state, customer, action.payment.period)
      )
        return state;
      return {
        ...state,
        payments: [
          {
            ...action.payment,
            reviewedBy:
              action.payment.method === "Cash" ? state.profile.name : action.payment.reviewedBy,
          },
          ...state.payments,
        ],
      };
    }
    case "review":
      return {
        ...state,
        payments: state.payments.map((payment) =>
          payment.id === action.id &&
          payment.orgId === action.orgId &&
          payment.status === "Pending review"
            ? {
                ...payment,
                status: action.status,
                note: action.note,
                reviewedBy: state.profile.name,
              }
            : payment,
        ),
      };
    case "ticket":
      return !action.ticket.subject.trim() ||
        !action.ticket.messages[0]?.text.trim() ||
        !state.customers.some(
          (customer) =>
            customer.id === action.ticket.customerId && customer.orgId === action.ticket.orgId,
        )
        ? state
        : { ...state, tickets: [action.ticket, ...state.tickets] };
    case "reply":
      return {
        ...state,
        tickets: state.tickets.map((ticket) =>
          ticket.id === action.id && ticket.orgId === action.orgId && action.message.text.trim()
            ? { ...ticket, messages: [...ticket.messages, action.message] }
            : ticket,
        ),
      };
    case "ticket-status":
      return {
        ...state,
        tickets: state.tickets.map((ticket) =>
          ticket.id === action.id && ticket.orgId === action.orgId
            ? { ...ticket, status: action.status }
            : ticket,
        ),
      };
    case "announcement":
      return !state.organizations.some((org) => org.id === action.announcement.orgId)
        ? state
        : { ...state, announcements: [action.announcement, ...state.announcements] };
    case "resolve-alert":
      return {
        ...state,
        announcements: state.announcements.map((announcement) =>
          announcement.id === action.id && announcement.orgId === action.orgId
            ? { ...announcement, resolved: true }
            : announcement,
        ),
      };
    case "member":
      return {
        ...state,
        organizations: state.organizations.map((org) =>
          org.id === action.orgId &&
          !org.members.some(
            (member) => member.email.toLowerCase() === action.member.email.toLowerCase(),
          )
            ? { ...org, members: [...org.members, action.member] }
            : org,
        ),
      };
    case "member-role":
      return {
        ...state,
        organizations: state.organizations.map((org) =>
          org.id === action.orgId
            ? {
                ...org,
                members: org.members.map((member) =>
                  member.id === action.id && member.role !== "owner"
                    ? { ...member, role: action.role }
                    : member,
                ),
              }
            : org,
        ),
      };
    case "preferences":
      return {
        ...state,
        preferences: {
          ...state.preferences,
          [action.customerId]: { billing: action.billing, maintenance: action.maintenance },
        },
      };
    case "platform-role":
      return { ...state, userRoles: { ...state.userRoles, [action.id]: action.role } };
    case "customer-status":
      return {
        ...state,
        customers: state.customers.map((customer) =>
          customer.orgId === action.orgId && customer.id === action.id
            ? { ...customer, status: action.status }
            : customer,
        ),
      };
    case "customer-details":
      if (
        action.changes.dueDay !== undefined &&
        (!Number.isInteger(action.changes.dueDay) ||
          action.changes.dueDay < 1 ||
          action.changes.dueDay > 31)
      )
        return state;
      return {
        ...state,
        customers: state.customers.map((customer) =>
          customer.orgId === action.orgId && customer.id === action.id
            ? { ...customer, ...action.changes }
            : customer,
        ),
      };
    case "organization-settings":
      return {
        ...state,
        organizations: state.organizations.map((org) =>
          org.id === action.orgId ? { ...org, ...action.changes } : org,
        ),
      };
    case "expense":
      if (
        !state.organizations.some((org) => org.id === action.expense.orgId) ||
        !Number.isFinite(action.expense.amount) ||
        action.expense.amount <= 0 ||
        !action.expense.title.trim() ||
        !/^\d{4}-\d{2}-\d{2}$/.test(action.expense.date)
      )
        return state;
      return {
        ...state,
        expenses: [
          action.expense,
          ...state.expenses.filter(
            (entry) => !(entry.orgId === action.expense.orgId && entry.id === action.expense.id),
          ),
        ],
      };
    case "delete-expense":
      return {
        ...state,
        expenses: state.expenses.filter(
          (entry) => !(entry.orgId === action.orgId && entry.id === action.id),
        ),
      };
    case "destination":
      if (!state.organizations.some((org) => org.id === action.destination.orgId)) return state;
      return {
        ...state,
        destinations: [
          ...state.destinations.filter(
            (entry) =>
              !(
                entry.orgId === action.destination.orgId &&
                entry.method === action.destination.method
              ),
          ),
          action.destination,
        ],
      };
    case "ticket-details":
      if (
        action.assigneeId &&
        !state.organizations
          .find((org) => org.id === action.orgId)
          ?.members.some((member) => member.id === action.assigneeId && !member.invited)
      )
        return state;
      return {
        ...state,
        tickets: state.tickets.map((ticket) =>
          ticket.id === action.id && ticket.orgId === action.orgId
            ? { ...ticket, assigneeId: action.assigneeId, priority: action.priority }
            : ticket,
        ),
      };
    case "application":
      if (
        !state.platform.allowRegistrations ||
        state.platform.maintenanceMode ||
        !state.organizations.some((org) => org.id === action.application.orgId) ||
        !action.application.name.trim() ||
        !action.application.phone.trim()
      )
        return state;
      return { ...state, applications: [action.application, ...state.applications] };
    case "application-status":
      return {
        ...state,
        applications: state.applications.map((entry) =>
          entry.id === action.id && entry.orgId === action.orgId
            ? { ...entry, status: action.status, customerId: action.customerId ?? entry.customerId }
            : entry,
        ),
      };
    case "activate":
      if (!action.email.trim()) return state;
      return {
        ...state,
        customers: state.customers.map((customer) =>
          customer.activationCode === action.code && customer.portalStatus !== "Activated"
            ? {
                ...customer,
                email: action.email,
                portalStatus: "Activated",
                activationCode: undefined,
              }
            : customer,
        ),
      };
    case "platform-settings":
      if (
        action.changes.monthlyAiTokenCap !== undefined &&
        (!Number.isInteger(action.changes.monthlyAiTokenCap) ||
          action.changes.monthlyAiTokenCap < 0)
      )
        return state;
      return {
        ...state,
        platform: { ...state.platform, ...action.changes },
        audit: [
          {
            id: action.id,
            action: "Platform settings updated",
            actor: state.profile.name,
            time: action.time,
          },
          ...state.audit,
        ],
      };
    case "profile":
      return action.name.trim() && action.email.trim()
        ? {
            ...state,
            profile: { ...state.profile, name: action.name, email: action.email },
            organizations: state.organizations.map((org) => ({
              ...org,
              members: org.members.map((member) =>
                member.id === "owner"
                  ? { ...member, name: action.name, email: action.email }
                  : member,
              ),
            })),
          }
        : state;
    case "revoke-session":
      return {
        ...state,
        profile: {
          ...state.profile,
          sessions: state.profile.sessions.filter(
            (session) => session.id !== action.id || session.current,
          ),
        },
      };
    case "audit":
      return { ...state, audit: [action.entry, ...state.audit] };
    case "reset":
      return initialState;
  }
}

export function mockReducer(state: MockState, action: Action): MockState {
  const next = transition(state, action);
  const fields: Partial<
    Record<
      Action["type"],
      | "organizations"
      | "customers"
      | "payments"
      | "expenses"
      | "destinations"
      | "tickets"
      | "applications"
      | "announcements"
    >
  > = {
    organization: "organizations",
    "organization-settings": "organizations",
    member: "organizations",
    "member-role": "organizations",
    customer: "customers",
    "customer-status": "customers",
    "customer-details": "customers",
    activate: "customers",
    payment: "payments",
    review: "payments",
    expense: "expenses",
    "delete-expense": "expenses",
    destination: "destinations",
    ticket: "tickets",
    "ticket-status": "tickets",
    "ticket-details": "tickets",
    application: "applications",
    "application-status": "applications",
    announcement: "announcements",
    "resolve-alert": "announcements",
  };
  const field = fields[action.type];
  if (!field || next === state) return next;
  const changed =
    next[field].length !== state[field].length ||
    next[field].some((entry, index) => entry !== state[field][index]);
  if (!changed) return next;
  return {
    ...next,
    audit: [
      {
        id: crypto.randomUUID(),
        orgId:
          "orgId" in action
            ? action.orgId
            : "organization" in action
              ? action.organization.id
              : "customer" in action
                ? action.customer.orgId
                : "payment" in action
                  ? action.payment.orgId
                  : "expense" in action
                    ? action.expense.orgId
                    : "destination" in action
                      ? action.destination.orgId
                      : "ticket" in action
                        ? action.ticket.orgId
                        : "application" in action
                          ? action.application.orgId
                          : "announcement" in action
                            ? action.announcement.orgId
                            : undefined,
        action: action.type.replaceAll("-", " "),
        actor: state.profile.name,
        time: timestamp(),
      },
      ...next.audit,
    ],
  };
}
