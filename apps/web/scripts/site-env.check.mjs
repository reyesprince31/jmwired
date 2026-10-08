import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

function buildPlan(siteUrl) {
  const report = JSON.parse(
    execSync("pnpm exec turbo run build --filter=web --dry=json", {
      cwd: fileURLToPath(new URL("../../../", import.meta.url)),
      env: { ...process.env, SITE_URL: siteUrl },
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }),
  );
  return { report, task: report.tasks.find((task) => task.taskId === "web#build") };
}

const production = buildPlan("https://jmwired.ayosgawa.com");
const variables = [
  ...production.report.globalCacheInputs.environmentVariables.specified.env,
  ...production.task.environmentVariables.specified.env,
];
assert(variables.includes("SITE_URL"), "Turbo must pass SITE_URL to the web build in strict mode");
const preview = buildPlan("http://127.0.0.1:3002");
assert.notEqual(
  production.task.hash,
  preview.task.hash,
  "Changing SITE_URL must invalidate the web build cache",
);
console.log("Passed: Turbo forwards SITE_URL and invalidates the web build cache when it changes.");
