import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const ROUTES = [
  { path: "/", title: /Fraz Ahmed/, heading: /decide what to build/ },
  { path: "/work/", title: /^Work · Fraz Ahmed$/, heading: /^Work$/ },
  { path: "/tools/workflow-roi/", title: /^Workflow ROI calculator · Fraz Ahmed$/, heading: /Workflow ROI calculator/ },
  { path: "/about/", title: /^About · Fraz Ahmed$/, heading: /Fraz Ahmed/ },
] as const;

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
}

const results = (page: Page) => page.locator("[aria-live='polite']").first();

for (const route of ROUTES) {
  test(`${route.path} loads directly with a title, one h1, no overflow and no axe violations`, async ({ page }) => {
    const response = await page.goto(route.path);

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(route.title);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(route.heading);
    await expectNoHorizontalOverflow(page);

    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(axe.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });
}

test("a path without a trailing slash resolves to the page", async ({ page }) => {
  await page.goto("/work");

  await expect(page).toHaveURL(/\/work\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Work");
});

test("the unpublished case study is not exported or linked", async ({ page }) => {
  const response = await page.goto("/work/ehr-integration/");
  expect(response?.status()).toBe(404);

  for (const route of ROUTES) {
    await page.goto(route.path);
    await expect(page.locator("a[href*='ehr-integration']")).toHaveCount(0);
  }
});

test("homepage routes a first-time visitor to work and the calculator", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: /View selected work/ }).click();
  await expect(page).toHaveURL(/\/work\/$/);

  await page.goto("/");
  await page.getByRole("link", { name: "Try the ROI calculator" }).click();
  await expect(page).toHaveURL(/\/tools\/workflow-roi\/$/);
});

test("homepage preview shows the worked example and recalculates", async ({ page }) => {
  await page.goto("/");

  await expect(results(page)).toContainText("$1,200/mo");
  await expect(results(page)).toContainText("$600/mo");
  await expect(results(page)).toContainText("2 min/case");

  await page.getByLabel("Adoption").fill("0");
  await expect(results(page)).toContainText("Not calculable");

  await page.getByLabel("Adoption").fill("abc");
  await expect(page.getByLabel("Adoption")).toHaveAttribute("aria-invalid", "true");
  await expect(results(page)).toContainText("Fix the highlighted fields");

  await page.getByRole("button", { name: "Reset to example" }).click();
  await expect(results(page)).toContainText("$1,200/mo");
});

test("full tool lets every assumption change and shows negative and zero-cost cases", async ({ page }) => {
  await page.goto("/tools/workflow-roi/");

  for (const label of [
    "Monthly case volume",
    "Adoption",
    "Minutes saved per adopted case",
    "Loaded hourly labor cost",
    "Recurring monthly cost",
  ]) {
    await expect(page.getByLabel(label)).toBeEditable();
  }

  await page.getByLabel("Minutes saved per adopted case").fill("1");
  await expect(results(page)).toContainText("−$300/mo");
  await expect(results(page)).toContainText("recurring cost exceeds");

  await page.getByLabel("Recurring monthly cost").fill("0");
  await expect(results(page)).toContainText("0 min/case");

  await page.getByLabel("Loaded hourly labor cost").fill("0");
  await expect(results(page)).toContainText("Not calculable");

  await page.getByLabel("Adoption").fill("1,,2");
  await expect(page.getByLabel("Adoption")).toHaveAttribute("aria-invalid", "true");
  await page.getByLabel("Adoption").fill("75");

  await page.getByLabel("Monthly case volume").fill("2000000");
  await expect(page.getByText("Enter a value between 0 and 1,000,000.")).toBeVisible();
});

test("maximum valid inputs do not overflow the layout", async ({ page }) => {
  await page.goto("/tools/workflow-roi/");

  await page.getByLabel("Monthly case volume").fill("1000000");
  await page.getByLabel("Adoption").fill("100");
  await page.getByLabel("Minutes saved per adopted case").fill("480");
  await page.getByLabel("Loaded hourly labor cost").fill("1000");
  await expect(results(page)).toContainText("$8,000,000,000/mo");
  await expectNoHorizontalOverflow(page);

  const overflowing = await page.locator("[aria-live='polite'] dd").evaluateAll((nodes) =>
    nodes.filter((node) => node.scrollWidth > node.clientWidth).length,
  );
  expect(overflowing).toBe(0);
});

test("worked example on the tool page matches the brief", async ({ page }) => {
  await page.goto("/tools/workflow-roi/");
  const example = page.locator("ol").filter({ hasText: "Gross:" });

  await expect(example).toContainText("= $1,200");
  await expect(example).toContainText("= $600");
  await expect(example).toContainText("= 2 minutes");
});

test("command menu opens from the keyboard, selects a page and closes with Escape", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: /Jump to/ });
  const dialog = page.getByRole("dialog", { name: "Jump to a page" });

  await page.keyboard.press("Control+k");
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Search pages" })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();

  await trigger.click();
  await page.keyboard.type("about");
  await expect(page.getByRole("option")).toHaveCount(1);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/about\/$/);
});

test("command menu supports arrow keys and shows an empty state", async ({ page }) => {
  await page.goto("/work/");
  await page.getByRole("button", { name: /Jump to/ }).click();

  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("option", { selected: true })).toContainText("Work");

  await page.keyboard.type("work");
  await page.keyboard.press("Home");
  await page.keyboard.type("x");
  await expect(page.getByRole("combobox", { name: "Search pages" })).toHaveValue("xwork");
  await page.getByRole("combobox", { name: "Search pages" }).fill("");

  await page.keyboard.type("zzz");
  await expect(page.getByRole("option")).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("No pages match");

  const axe = await new AxeBuilder({ page }).include("dialog").analyze();
  expect(axe.violations.map((v) => v.id)).toEqual([]);
});

test("the first Tab stop is the skip link and it moves focus to main content", async ({ page }) => {
  await page.goto("/about/");

  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});
