import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const ROUTES = [
  { path: "/", title: /Fraz Ahmed/, heading: /^Fraz Ahmed$/ },
  { path: "/work/", title: /^Work · Fraz Ahmed$/, heading: /^Work$/ },
  { path: "/tools/workflow-roi/", title: /^Workflow ROI calculator · Fraz Ahmed$/, heading: /Workflow ROI calculator/ },
  { path: "/about/", title: /^About · Fraz Ahmed$/, heading: /Fraz Ahmed/ },
  { path: "/work/caretrak/", title: /^CareTrak case study · Fraz Ahmed$/, heading: /CareTrak/ },
  { path: "/work/pension-reform/", title: /^Pension reform case study · Fraz Ahmed$/, heading: /Pension reform/ },
  { path: "/work/product-management/", title: /^Product management portfolio · Fraz Ahmed$/, heading: /Product management portfolio/ },
  { path: "/work/public-finance/", title: /^Public finance · Fraz Ahmed$/, heading: /^Public finance$/ },
  { path: "/work/research/", title: /^Research · Fraz Ahmed$/, heading: /^Research$/ },
  { path: "/work/consulting/", title: /^Consulting · Fraz Ahmed$/, heading: /^Consulting$/ },
  { path: "/work/consulting/wabtec-mining/", title: /^Wabtec mining strategy case study · Fraz Ahmed$/, heading: /China question in mining/ },
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

test("draft routes and source material are not exported or linked", async ({ page }) => {
  const response = await page.goto("/work/ehr-integration/");
  expect(response?.status()).toBe(404);

  for (const route of ROUTES) {
    await page.goto(route.path);
    await expect(page.locator("a[href*='ehr-integration'], a[href*='case-drafts'], img[src*='persivia']")).toHaveCount(0);
  }
});

test("CareTrak walkthrough steps are keyboard operable and show their mockups", async ({ page }) => {
  await page.goto("/work/caretrak/");
  const tabs = page.getByRole("tab");
  await expect(tabs).toHaveCount(5);

  await tabs.first().focus();
  await page.keyboard.press("ArrowDown");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("Shared definitions");

  await page.keyboard.press("End");
  await expect(tabs.nth(4)).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("Operations dashboard");

  await page.getByRole("button", { name: /^Previous:/ }).click();
  await expect(tabs.nth(3)).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText("Candidates to review");
  await expectNoHorizontalOverflow(page);
});

test("CareTrak review mockup shows the evidence for the selected candidate", async ({ page }) => {
  await page.goto("/work/caretrak/");
  await page.getByRole("tab", { name: /Keep the clinician in the loop/ }).click();
  const panel = page.getByRole("tabpanel");

  await expect(panel.locator("mark")).toContainText("diabetic nephropathy");
  await panel.getByRole("button", { name: /I50\.22/ }).click();
  await expect(panel.getByRole("button", { name: /I50\.22/ })).toHaveAttribute("aria-pressed", "true");
  await expect(panel.locator("mark")).toHaveText("No history of heart failure");
  await expect(panel).toContainText("mentioned only to rule it out");

  const axe = await new AxeBuilder({ page }).include("[role='tabpanel']:not([hidden])").analyze();
  expect(axe.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
});

test("every CareTrak walkthrough step passes axe and fits the viewport", async ({ page }) => {
  await page.goto("/work/caretrak/");
  const tabs = page.getByRole("tab");

  for (let index = 0; index < 5; index += 1) {
    await tabs.nth(index).click();
    await expectNoHorizontalOverflow(page);
    const axe = await new AxeBuilder({ page }).include("[role='tabpanel']:not([hidden])").analyze();
    expect(axe.violations.map((v) => `step ${index + 1} ${v.id}: ${v.nodes.length}`)).toEqual([]);
  }
});

test("homepage routes employers to the product portfolio and everyone to all work", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "See my product portfolio" }).click();
  await expect(page).toHaveURL(/\/work\/product-management\/$/);

  await page.goto("/");
  await page.locator("#intro-heading").locator("..").getByRole("link", { name: "All work" }).click();
  await expect(page).toHaveURL(/\/work\/$/);
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

  // The shortcut listener attaches after hydration; retry until the page is interactive.
  await expect(async () => {
    await page.keyboard.press("Control+k");
    await expect(dialog).toBeVisible({ timeout: 500 });
  }).toPass();
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
  await expect(page.getByRole("option", { selected: true })).toContainText("Product");

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

test("homepage tells the story in numbered sections", async ({ page }) => {
  await page.goto("/");

  for (const name of ["Hi, I’m Fraz.", "Recent milestones", "Product delivery in regulated software", "Workflow ROI calculator"]) {
    await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
  }
  await expect(page.locator("#about dd").first()).toHaveText("12tn");
  await expect(page.locator("#log li")).toHaveCount(11);
});

test("strategy map renders, toggles node types and offers a list view", async ({ page }) => {
  await page.goto("/#map");
  const canvas = page.getByRole("img", { name: /Strategy map/ });
  await expect(canvas).toHaveAttribute("data-ready", "true");

  const methods = page.getByRole("button", { name: "Methods" });
  await expect(methods).toHaveAttribute("aria-pressed", "true");
  await methods.click();
  await expect(methods).toHaveAttribute("aria-pressed", "false");

  await page.getByText("Browse the map as a list").click();
  const list = page.locator("#map details");
  await expect(list.getByRole("link", { name: "CareTrak case study" })).toBeVisible();
  await expect(list).toContainText("Connected to");
  await expectNoHorizontalOverflow(page);
});

test("command menu lists case studies with kind tags", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Jump to/ }).click();
  await page.keyboard.type("care");

  await expect(page.getByRole("option").first()).toContainText("CareTrak case study");
  await expect(page.getByRole("option").first()).toContainText("case");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/work\/caretrak\/$/);
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("the hero is static and nothing errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await page.waitForTimeout(2500);

    await expect(page.locator("h1 + p [aria-hidden] span").nth(1)).toHaveText("deciding what to build");
    await expect(page.locator("#about dd").first()).toHaveText("12tn");
    expect(errors).toEqual([]);
  });
});

test("pension reform walkthrough shows sourced exhibits for every step", async ({ page }) => {
  await page.goto("/work/pension-reform/");
  const tabs = page.getByRole("tab");
  await expect(tabs).toHaveCount(5);

  await expect(page.getByRole("tabpanel")).toContainText("PKR 470bn");
  await tabs.nth(1).click();
  await expect(page.getByRole("tabpanel")).toContainText("≈ PKR 11.0tn");
  await expect(page.getByRole("tabpanel")).toContainText("PKR 12.0tn");
  await tabs.nth(2).click();
  await expect(page.getByRole("tabpanel").getByRole("row")).toHaveCount(6);

  for (let index = 0; index < 5; index += 1) {
    await tabs.nth(index).click();
    await expect(page.getByRole("tabpanel")).toContainText("Source:");
    await expectNoHorizontalOverflow(page);
    const axe = await new AxeBuilder({ page }).include("[role='tabpanel']:not([hidden])").analyze();
    expect(axe.violations.map((v) => `step ${index + 1} ${v.id}: ${v.nodes.length}`)).toEqual([]);
  }
  await expect(page.locator("#jamaica")).toContainText("174k");
});

test("work index shows the five tracks with product management first", async ({ page }) => {
  await page.goto("/work/");

  const tracks = page.locator("main ol > li h2 a");
  await expect(tracks).toHaveCount(5);
  await expect(tracks.first()).toHaveAttribute("href", "/work/product-management/");
  await expect(tracks.nth(4)).toHaveAttribute("href", "/advising/");
  await expect(tracks.nth(2)).toHaveAttribute("href", "/work/consulting/");
});

test("product portfolio: the hiring lens switches roles and every item names its source", async ({ page }) => {
  await page.goto("/work/product-management/");
  const lens = page.getByRole("tablist", { name: "What are you hiring for?" });
  await expect(lens.getByRole("tab")).toHaveCount(3);

  await lens.getByRole("tab", { name: "AI Product Manager" }).click();
  const panel = page.locator('[role="tabpanel"]:not([hidden])').first();
  await expect(panel).toContainText("Does this person know how to ship AI");
  await expect(panel).toContainText("not LLMs");

  await lens.getByRole("tab", { name: "AI Product Manager" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(lens.getByRole("tab", { name: "Product strategy" })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator('[role="tabpanel"]:not([hidden])').first().getByRole("link", { name: "see it" }).first()).toBeVisible();
});

test("product portfolio: the CareTrak canvas steps from problem to outcome by keyboard", async ({ page }) => {
  await page.goto("/work/product-management/");
  const canvas = page.getByRole("tablist", { name: /CareTrak product thinking/ });
  await expect(canvas.getByRole("tab")).toHaveCount(6);
  await canvas.getByRole("tab").first().focus();
  await page.keyboard.press("End");
  await expect(canvas.getByRole("tab").last()).toHaveAttribute("aria-selected", "true");
  await expect(page.locator('[role="tabpanel"]:not([hidden])').last()).toContainText("30% shorter implementation time");
  await page.keyboard.press("Home");
  await expect(page.locator('[role="tabpanel"]:not([hidden])').last()).toContainText("product thinking");
});

test("nav highlights Product on product case studies and Work on other tracks", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "desktop nav check");
  const nav = page.getByRole("navigation", { name: "Primary" });
  await page.goto("/work/caretrak/");
  await expect(nav.getByRole("link", { name: "Product" })).toHaveAttribute("aria-current", "page");
  await expect(nav.getByRole("link", { name: "Work" })).not.toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText("product-management");

  await page.goto("/work/research/");
  await expect(nav.getByRole("link", { name: "Work" })).toHaveAttribute("aria-current", "page");
  await expect(nav.getByRole("link", { name: "Product" })).not.toHaveAttribute("aria-current", "page");
});

test("Wabtec case: the battery-cost model reproduces the base case and responds to its inputs", async ({ page }) => {
  await page.goto("/work/consulting/wabtec-mining/");
  const results = page.locator("dl[aria-live]").first();
  await expect(results).toContainText("$546k");
  await expect(results).toContainText("$865k");
  await expect(results).toContainText("$319k");
  await expect(results).toContainText("8.3%");

  const premium = page.getByLabel("ABS premium over a Chinese pack");
  await premium.fill("2.73");
  await expect(results).toContainText("$945k");
  await expect(results).toContainText("24.5%");
  await page.getByRole("button", { name: "Reset to the base case" }).click();
  await expect(results).toContainText("$319k");
});

test("Wabtec case: regions explain their score and the scoring demo recomputes", async ({ page }) => {
  await page.goto("/work/consulting/wabtec-mining/");
  await page.getByRole("button", { name: /North America/ }).click();
  await expect(page.getByRole("button", { name: /North America/ })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText(/Triple-stacked US tariffs/)).toBeVisible();

  const score = page.locator("dl[aria-live]").last();
  const before = await score.innerText();
  await page.getByLabel("Fact 1 direction").selectOption("against");
  await expect(score).not.toHaveText(before);
  await expect(page.getByText(/Illustrative facts, not the engagement/)).toBeVisible();
});
