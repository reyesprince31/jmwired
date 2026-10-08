import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const { chromium } = await import(process.argv[2] ?? "playwright");
const base = process.env.PORTAL_URL ?? "http://127.0.0.1:3001";
const browser = await chromium.launch({ headless: true, channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
async function go(route) {
  const response = await page.goto(base + route);
  assert.equal(response.status(), 200, route);
  await page.locator("main h1").waitFor();
}
async function prepare() {
  await page.getByLabel("Full name", { exact: true }).fill("Sample Customer");
  await page.getByLabel("Phone number", { exact: true }).fill("09170000000");
  await page.getByLabel("Quantity or number of locations").fill("2");
  await page.getByLabel("What do you need?").fill("Two routers for a small office.");
  await page.getByRole("button", { name: "Prepare inquiry", exact: true }).click();
  await page.getByRole("heading", { name: "Your inquiry is ready." }).waitFor();
}
async function capture(name, fullPage = true) {
  if (!process.env.SHOP_CAPTURE_DIR) return;
  await mkdir(process.env.SHOP_CAPTURE_DIR, { recursive: true });
  await page.screenshot({
    path: join(process.env.SHOP_CAPTURE_DIR, name + ".png"),
    fullPage,
    caret: "initial",
  });
}
try {
  await go("/shop");
  assert.equal(await page.locator("#catalog article").count(), 15);
  assert.equal(
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Shop", exact: true })
      .count(),
    1,
  );
  await page.locator("#catalog").scrollIntoViewIfNeeded();
  // Load the whole catalog before checking its five shared category photographs.
  for (const photo of await page.locator("main img").all()) {
    await photo.scrollIntoViewIfNeeded();
    await photo.evaluate((img) => img.decode());
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture("shop-desktop");
  await page
    .getByRole("navigation", { name: "Shop categories" })
    .getByRole("link", { name: "Local services", exact: true })
    .click();
  await page.waitForURL(/category=services/);
  await page.getByRole("status").filter({ hasText: "5 items" }).waitFor();
  assert.equal(await page.locator("#catalog article").count(), 5);
  await go("/shop?category=unknown&q=%20MIKROTIK%20");
  assert.equal(await page.locator("#catalog article").count(), 1);
  await page.getByLabel("Search products and services").fill("no-such-item");
  await page.getByRole("button", { name: "Search shop", exact: true }).click();
  await page.getByRole("heading", { name: "No items match your search." }).waitFor();
  assert.equal(await page.locator("#catalog article").count(), 0);
  await page.getByRole("link", { name: "View all items", exact: true }).click();
  await page.getByRole("status").filter({ hasText: "15 items" }).waitFor();
  await page.getByRole("link", { name: "View MikroTik routers", exact: true }).click();
  await page.waitForURL(base + "/shop/mikrotik-routers");
  await page.locator("main h1").filter({ hasText: "MikroTik routers" }).waitFor();
  await page
    .locator("main img")
    .first()
    .evaluate((img) => img.decode());
  await capture("shop-product");
  await page.getByRole("link", { name: "Request a quote", exact: true }).click();
  await page.getByLabel("Product or service").waitFor();
  assert.equal(await page.getByLabel("Product or service").inputValue(), "MikroTik routers");
  await page.getByRole("button", { name: "Prepare inquiry", exact: true }).click();
  assert.equal(await page.getByRole("heading", { name: "Your inquiry is ready." }).count(), 0);
  await prepare();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("jmwired-shop-inquiry")));
  assert.equal(saved.item, "MikroTik routers");
  assert.equal(saved.quantity, 2);
  assert.match(saved.reference, /^JW-[A-F0-9]{8}$/);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download inquiry", exact: true }).click();
  const file = await download;
  assert.equal(file.suggestedFilename(), saved.reference + ".txt");
  assert.match(
    await readFile(await file.path(), "utf8"),
    /MikroTik routers[\s\S]*Quantity \/ locations: 2[\s\S]*Two routers for a small office/,
  );
  await page.getByRole("button", { name: "Prepare another inquiry", exact: true }).click();
  await page.getByLabel("Full name", { exact: true }).waitFor();
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error("Storage unavailable");
    };
  });
  await prepare();
  await page.getByRole("status").filter({ hasText: "Browser storage is unavailable" }).waitFor();
  assert(await page.getByRole("button", { name: "Download inquiry", exact: true }).isEnabled());

  const xmlResponse = await page.request.get(base + "/sitemap.xml");
  assert.equal(xmlResponse.status(), 200);
  const xml = await xmlResponse.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  assert.equal(urls.length, 24);
  assert.equal(new Set(urls).size, 24);
  assert(urls.every((url) => url.startsWith(base + "/")));
  assert(
    !urls.some((url) =>
      /\/(admin|organization|portal|shop\/inquiry)(\/|$)/.test(new URL(url).pathname),
    ),
  );
  const products = urls.filter((url) => new URL(url).pathname.startsWith("/shop/"));
  assert.equal(products.length, 15);
  const responses = await Promise.all(products.map((url) => page.request.get(url)));
  assert(responses.every((response) => response.status() === 200));
  assert.equal((await page.request.get(base + "/shop/unknown-product")).status(), 404);
  const robots = await (await page.request.get(base + "/robots.txt")).text();
  for (const route of ["admin", "organization", "portal", "shop/inquiry"])
    assert(robots.includes("Disallow: /" + route));
  assert(robots.includes("Sitemap: " + base + "/sitemap.xml"));
  await go("/sitemap");
  assert.equal(await page.locator("main a[href='/shop/mikrotik-routers']").count(), 1);
  for (const width of [390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/shop", "/shop/mikrotik-routers", "/shop/inquiry"]) {
      await go(route);
      assert(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${width}: ${route} overflows`,
      );
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await go("/shop");
  await capture("shop-mobile", false);
  await page.getByLabel("Open navigation", { exact: true }).click();
  assert(
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "Shop", exact: true })
      .isVisible(),
  );
  if (process.env.DOCS_URL) {
    assert.equal((await page.goto(process.env.DOCS_URL + "/docs/shop")).status(), 200);
    await page.getByRole("heading", { name: "Equipment and services", exact: true }).waitFor();
    const search = await page.request.get(process.env.DOCS_URL + "/api/search?query=inquiry");
    assert.equal(search.status(), 200);
    assert((await search.json()).length > 0);
  }
  assert.deepEqual(errors, []);
  console.log(
    "Passed: 15 listings and images, categories/search/empty state, inquiry validation/download/storage fallback, all product routes, public sitemap, robots, and responsive layouts.",
  );
} finally {
  await browser.close();
}
