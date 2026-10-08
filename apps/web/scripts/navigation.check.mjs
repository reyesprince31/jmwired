import assert from "node:assert/strict";
const { chromium } = await import(process.argv[2] ?? "playwright");
const browser = await chromium.launch({ headless: true, channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(page.url() + ": " + message.text());
});
const base = process.env.PORTAL_URL ?? "http://127.0.0.1:3001";
const docs = process.env.DOCS_URL ?? "http://127.0.0.1:4001";
const pixel = {
  name: "sample.png",
  mimeType: "image/png",
  buffer: Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aP1sAAAAASUVORK5CYII=",
    "base64",
  ),
};
async function go(route) {
  const response = await page.goto(base + route);
  assert.equal(response.status(), 200, route);
  await page.locator("main h1").first().waitFor();
}
async function state() {
  return page.evaluate(() => JSON.parse(localStorage.getItem("jmwired-mock-v1")));
}
async function saved(predicate) {
  await page.waitForFunction(predicate);
}
try {
  await go("/organization");
  await page.waitForURL(base + "/organization/poblacion");
  const nav = page.getByRole("navigation", { name: "Organization navigation" });
  assert.equal(await nav.getByRole("link").count(), 10);
  assert.equal(await nav.getByRole("link", { name: "Platform admin" }).count(), 0);
  assert.equal(await page.getByRole("button", { name: "Open user menu" }).count(), 1);
  assert.equal(await page.getByRole("link", { name: "Customer portal", exact: true }).count(), 0);
  assert.equal(await page.getByRole("button", { name: "Workspace setup", exact: true }).count(), 0);
  await page.getByRole("button", { name: "Open user menu" }).last().click();
  assert.equal(
    await page.getByRole("menuitem", { name: "Customer portal", exact: true }).count(),
    1,
  );
  await page.getByRole("menuitem", { name: "Platform admin", exact: true }).click();
  await page.waitForURL(base + "/admin");
  assert.equal(await page.getByRole("navigation", { name: "Organization navigation" }).count(), 0);
  await page.getByRole("button", { name: "Open workspace", exact: true }).nth(1).click();
  await page.waitForURL(base + "/organization/san-jose");
  await go("/organization/poblacion/support/TK-1001");
  await page.getByLabel("Ticket assignee", { exact: true }).selectOption("staff");
  await page.getByLabel("Ticket priority", { exact: true }).selectOption("Urgent");
  await page.getByLabel("Message visibility").selectOption("staff_only");
  await page
    .getByLabel("Reply to customer", { exact: true })
    .fill("Private handover: bring a spare ONU.");
  await page.getByRole("button", { name: "Save internal note", exact: true }).click();
  await page.getByText("Private handover: bring a spare ONU.", { exact: true }).waitFor();
  await go("/portal/support/TK-1001");
  assert.equal(
    await page.getByText("Private handover: bring a spare ONU.", { exact: true }).count(),
    0,
  );
  await page.getByRole("button", { name: /Notifications/ }).click();
  assert.equal(await page.getByText(/Private handover/).count(), 0);
  await page.keyboard.press("Escape");
  await go("/organization/poblacion/expenses");
  await page.getByRole("button", { name: "Log expense", exact: true }).click();
  await page.getByLabel("Expense title", { exact: true }).fill("Splice labor");
  await page.getByLabel("Amount (PHP)", { exact: true }).fill("250");
  await page.getByLabel("Expense category", { exact: true }).selectOption("Labor");
  await page.getByLabel("Payee", { exact: true }).fill("Field crew");
  await page
    .getByLabel("Receipt (optional · image up to 1 MB)", { exact: true })
    .setInputFiles(pixel);
  await page.getByAltText("Expense receipt", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Save expense", exact: true }).click();
  await page.getByText("Splice labor", { exact: true }).waitFor();
  await go("/organization/poblacion/ledger");
  await page
    .getByRole("row")
    .filter({ hasText: "Maria Santos" })
    .getByRole("button", { name: "Mark paid · Cash", exact: true })
    .click();
  await saved(() =>
    JSON.parse(localStorage.getItem("jmwired-mock-v1")).payments.some(
      (p) => p.customerId === "JM-001" && p.period === "2026-10" && p.status === "Paid",
    ),
  );
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV", exact: true }).click();
  assert.match((await download).suggestedFilename(), /poblacion-2026-10-ledger/);
  await go("/organization/poblacion/payments/settings");
  const gcash = page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: "GCash", exact: true }) });
  await gcash.getByLabel("GCash account name", { exact: true }).fill("Sample collection account");
  await gcash.getByLabel("GCash account number", { exact: true }).fill("09170000000");
  await gcash
    .getByLabel("GCash collection QR (image up to 1 MB)", { exact: true })
    .setInputFiles(pixel);
  await gcash.getByAltText("GCash QR preview", { exact: true }).waitFor();
  await gcash.getByLabel("Show this method to customers", { exact: true }).check();
  await gcash.getByRole("button", { name: "Save GCash settings", exact: true }).click();
  await saved(() =>
    JSON.parse(localStorage.getItem("jmwired-mock-v1")).destinations.some(
      (d) => d.method === "GCash" && d.enabled,
    ),
  );
  await go("/portal");
  await page.getByLabel("Account", { exact: true }).selectOption("JM-009");
  await go("/portal/bills/pay");
  await page.getByAltText("GCash collection QR", { exact: true }).waitFor();
  await go("/join/poblacion");
  await page.getByLabel("Full name", { exact: true }).fill("Application Test");
  await page.getByLabel("Phone number", { exact: true }).fill("09170000001");
  await page.getByLabel("Email (optional)", { exact: true }).fill("application@example.com");
  await page.getByLabel("Installation address", { exact: true }).fill("100 Test Street, Poblacion");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Request a connection", exact: true }).click();
  await page.getByRole("heading", { name: "Application received", exact: true }).waitFor();
  await go("/organization/poblacion/applications");
  await page
    .locator("div")
    .filter({ has: page.getByText("Application Test", { exact: true }) })
    .filter({ has: page.getByRole("button", { name: "Review request", exact: true }) })
    .last()
    .getByRole("button", { name: "Review request", exact: true })
    .click();
  await page.getByRole("button", { name: "Approve & create subscriber", exact: true }).click();
  await saved(() =>
    JSON.parse(localStorage.getItem("jmwired-mock-v1")).customers.some(
      (c) => c.name === "Application Test",
    ),
  );
  const applicant = (await state()).customers.find((c) => c.name === "Application Test");
  assert.equal(applicant.status, "Pending installation");
  await go("/activate?code=" + applicant.activationCode);
  await page.getByLabel("Email address", { exact: true }).fill("claimed@example.com");
  await page.getByLabel("Create password", { exact: true }).fill("placeholder-one");
  await page.getByLabel("Confirm password", { exact: true }).fill("placeholder-one");
  await page.getByRole("button", { name: "Activate account", exact: true }).click();
  await page.getByRole("heading", { name: "Your portal is ready", exact: true }).waitFor();
  await page.getByRole("link", { name: "Open your customer portal", exact: true }).click();
  await page.getByRole("heading", { name: /Application/ }).waitFor();
  await go("/organization/poblacion/support/automation");
  await page.getByLabel("Enable automatic replies", { exact: true }).check();
  await page.getByLabel("When to respond", { exact: true }).selectOption("Outages");
  await page
    .getByLabel("Reply message", { exact: true })
    .fill("Our crew is repairing the reported outage.");
  await page.getByRole("button", { name: "Save automation", exact: true }).click();
  await go("/organization/poblacion/announcements/new");
  await page.getByLabel("Update type", { exact: true }).selectOption("Outage");
  await page.getByLabel("Audience", { exact: true }).selectOption("area:Poblacion");
  await page.getByLabel("Title", { exact: true }).fill("Poblacion repair");
  await page.getByLabel("Message", { exact: true }).fill("Crew working on a fiber repair.");
  await page.getByRole("button", { name: "Publish update", exact: true }).click();
  await page.waitForURL(base + "/organization/poblacion/announcements");
  await go("/portal/support/new");
  await page.getByLabel("Subject", { exact: true }).fill("New outage request");
  await page
    .getByLabel("Tell us what happened", { exact: true })
    .fill("Internet is down since this morning.");
  await page.getByRole("button", { name: "Submit request", exact: true }).click();
  await page.getByText("Our crew is repairing the reported outage.", { exact: true }).waitFor();
  await go("/admin/system");
  await page.getByRole("button", { name: "Start maintenance", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Start maintenance", exact: true })
    .click();
  await go("/portal");
  await page.getByRole("heading", { name: "We’ll be back shortly", exact: true }).waitFor();
  await go("/join/poblacion");
  await page
    .getByRole("heading", { name: "Applications are currently paused", exact: true })
    .waitFor();
  await go("/admin/system");
  await page.getByRole("button", { name: "End maintenance", exact: true }).click();
  await page.getByLabel("Enable AI assistance in staff inboxes", { exact: true }).uncheck();
  await go("/organization/poblacion/support");
  assert.equal(
    await page.getByRole("button", { name: "Draft quick response", exact: true }).count(),
    0,
  );
  await go("/account");
  await page.getByRole("button", { name: "Sign out device", exact: true }).click();
  assert.equal(await page.getByText("Android · Chrome", { exact: true }).count(), 0);
  await go("/forgot-password");
  await page.getByLabel("Email address", { exact: true }).fill("recover@example.com");
  await page.getByRole("button", { name: "Send recovery link", exact: true }).click();
  await page.getByRole("heading", { name: "Check your email", exact: true }).waitFor();
  await go("/organization/poblacion/customers/JM-001");
  await page
    .getByLabel("Internal customer notes", { exact: true })
    .fill("Promised payment on the 20th.");
  await page.getByRole("button", { name: "Save subscriber details", exact: true }).click();
  await saved(
    () =>
      JSON.parse(localStorage.getItem("jmwired-mock-v1")).customers.find(
        (customer) => customer.id === "JM-001",
      ).notes === "Promised payment on the 20th.",
  );
  await go("/organization/poblacion/settings");
  await page.getByLabel("Contact phone", { exact: true }).fill("09175550101");
  await page.getByRole("button", { name: "Save workspace details", exact: true }).click();
  await page.getByRole("button", { name: "Invite member", exact: true }).click();
  await page.getByLabel("Name", { exact: true }).fill("Test Cashier");
  await page.getByLabel("Email", { exact: true }).fill("cashier@example.com");
  await page.getByLabel("Organization role", { exact: true }).selectOption("billing");
  await page.getByRole("button", { name: "Create invitation", exact: true }).click();
  await page.getByLabel("Role for Test Cashier", { exact: true }).waitFor();
  assert.equal(
    await page.getByLabel("Role for Test Cashier", { exact: true }).inputValue(),
    "billing",
  );
  await go("/admin/system");
  await page.getByLabel("Model", { exact: true }).fill("Example model");
  await page.getByLabel("Monthly token cap", { exact: true }).fill("10000");
  await page.getByLabel("API key", { exact: true }).fill("placeholder-secret-discarded");
  await page.getByRole("button", { name: "Save AI settings", exact: true }).click();
  await saved(
    () => JSON.parse(localStorage.getItem("jmwired-mock-v1")).platform.aiModel === "Example model",
  );
  assert(!JSON.stringify(await state()).includes("placeholder-secret-discarded"));
  await go("/account");
  await page.getByLabel("Your email", { exact: true }).fill("owner-updated@example.com");
  await page.getByRole("button", { name: "Save profile", exact: true }).click();
  await saved(
    () =>
      JSON.parse(localStorage.getItem("jmwired-mock-v1")).profile.email ===
      "owner-updated@example.com",
  );
  await go("/organization/new");
  await page.getByLabel("Organization name", { exact: true }).fill("JMWired");
  await page.getByLabel("Location or service area", { exact: true }).fill("San Isidro");
  await page.getByLabel("Workspace address", { exact: true }).fill("san-isidro");
  await page.getByRole("button", { name: "Create organization", exact: true }).click();
  await page.waitForURL(base + "/organization/san-isidro/settings");
  assert.equal(
    await page.getByLabel("Organization workspace", { exact: true }).inputValue(),
    "san-isidro",
  );
  await go("/organization/san-isidro/customers/new");
  await page.getByLabel("Full name", { exact: true }).fill("New Branch Subscriber");
  await page.getByLabel("Phone number", { exact: true }).fill("09175550102");
  await page.getByLabel("Service address", { exact: true }).fill("12 Test Street");
  await page.getByRole("button", { name: "Add customer", exact: true }).click();
  await page.waitForURL(base + "/organization/san-isidro/customers");
  await page.getByText("New Branch Subscriber", { exact: true }).waitFor();
  await go("/portal");
  await page.getByRole("heading", { name: "Hello, New.", exact: true }).waitFor();
  for (const route of [
    "/organization/poblacion",
    "/organization/poblacion/customers",
    "/organization/poblacion/customers/new",
    "/organization/poblacion/customers/JM-001",
    "/organization/poblacion/payments",
    "/organization/poblacion/payments/PAY-1",
    "/organization/poblacion/settings",
    "/organization/new",
    "/organization/poblacion/network",
    "/admin",
    "/admin/audit",
    "/sign-in",
    "/sign-up",
    "/reset-password",
    "/portal/account",
    "/portal/updates",
  ])
    await go(route);
  await go("/organization/san-jose");
  await page.getByRole("button", { name: "Open user menu" }).last().click();
  await page.getByRole("menuitem", { name: "Customer portal", exact: true }).click();
  await page.waitForURL(base + "/portal");
  await page.getByRole("heading", { name: /Sofia/ }).waitFor();
  await page.setViewportSize({ width: 390, height: 900 });
  for (const route of [
    "/organization/poblacion/ledger",
    "/organization/poblacion/expenses",
    "/organization/poblacion/support",
    "/admin/system",
    "/sign-in",
    "/join/poblacion",
    "/portal/account",
  ]) {
    await go(route);
    assert.ok(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      route + " mobile overflow",
    );
  }
  await page.setViewportSize({ width: 1536, height: 1024 });
  const guides = [
    "",
    "access",
    "connection-request",
    "shop",
    "preview",
    "customer",
    "customer/billing",
    "customer/support",
    "customer/updates",
    "customer/account",
    "customer/usage",
    "customer/troubleshooting",
    "staff",
    "staff/customers",
    "staff/billing",
    "staff/qr-settings",
    "staff/expenses",
    "staff/support",
    "staff/announcements",
    "staff/organization",
    "staff/getting-started",
    "staff/daily-work",
    "staff/network",
    "staff/applications",
    "platform",
    "platform/system",
    "platform/audit",
  ];
  console.log("Portal workflows and mobile layouts passed; checking documentation.");
  for (const guide of guides) {
    const r = await page.goto(docs + "/docs" + (guide ? "/" + guide : ""), {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });
    assert.equal(r.status(), 200, guide);
    await page.locator("h1").first().waitFor();
    assert(!(await page.getByText("Hello World", { exact: true }).count()));
  }
  const search = await page.request.get(docs + "/api/search?query=expenses");
  assert.equal(search.status(), 200);
  assert((await search.json()).length > 0);
  assert.equal(errors.length, 0, JSON.stringify(errors));
  console.log(
    "Passed: scoped routes, expenses/ledger/export, QR configuration, private notes, assignment, applications/activation, outage automation, maintenance/AI controls, account flows, mobile layouts, and all 27 help guides.",
  );
} finally {
  await browser.close();
}
