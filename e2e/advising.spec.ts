import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const ROUTES = [
  ["/advising/", /Make your next move/],
  ["/advising/career/", /Career guidance/],
  ["/advising/admissions/", /Admissions support/],
  ["/advising/test-prep/", /Test preparation planning/],
  ["/advising/scholarships/", /Scholarship guides/],
  ["/advising/stories/", /stories/i],
  ["/advising/updates/", /updates/i],
  ["/advising/updates/chevening-2027-28-applications-closed/", /Chevening 2027–28/],
  ["/advising/book/", /Book a conversation/],
] as const;

async function expectCleanPage(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(axe.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
}

for (const [path, heading] of ROUTES) {
  test(`${path} loads directly with one h1, the advising nav, no overflow and no axe violations`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await expect(page.getByRole("navigation", { name: "Advising" })).toBeVisible();
    await expectCleanPage(page);
  });
}

test("Advising is in the primary nav and the command menu", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Advising" })).toHaveAttribute("href", "/advising/");
  await page.getByRole("button", { name: /Jump to/ }).click();
  await page.keyboard.type("book an advising");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/advising\/book\/$/);
});

test("service finder points each situation to the right service", async ({ page }) => {
  await page.goto("/advising/");
  await page.getByLabel("I need to prepare for a standardized test").check();
  await expect(page.getByRole("link", { name: /Go to test preparation planning/i })).toHaveAttribute("href", "/advising/test-prep/");
  await page.getByLabel("I’m applying for a scholarship").check();
  await expect(page.getByRole("link", { name: /Go to admissions support/i })).toHaveAttribute("href", "/advising/admissions/");
});

test("career reflection gives an editable, rule-based result without an account", async ({ page }) => {
  await page.goto("/advising/career/");
  await expect(page.getByText("Answer all three questions")).toBeVisible();

  await page.getByText("Changing sector or role").click();
  await page.getByText("How to move into a new field").click();
  await page.getByText("Leaving with a concrete next step").click();
  await expect(page.getByText("Map your transferable experience")).toBeVisible();
  await expect(page.getByRole("link", { name: "Book a conversation about this" })).toHaveAttribute("href", "/advising/book/?topic=career");

  await page.getByText("Whether to study further or keep working").click();
  await expect(page.getByText("Weigh further study against staying in work")).toBeVisible();
  await expect(page.getByRole("link", { name: "Book a conversation about this" })).toHaveAttribute("href", "/advising/book/?topic=admissions");

  const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Download .txt" }).click()]);
  expect(download.suggestedFilename()).toBe("career-reflection.txt");
  expect(page.url()).not.toContain("Changing");
});

test("career reflection works from the keyboard", async ({ page }) => {
  await page.goto("/advising/career/");
  const first = page.getByRole("radio", { name: "Student or recent graduate" });
  await first.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: "Early career (0–3 years)" })).toBeChecked();
});

test("readiness checklist shows progress, saves only when asked, and resets", async ({ page }) => {
  await page.goto("/advising/admissions/");
  const progress = page.getByRole("progressbar", { name: "Checklist tasks completed" });
  await page.getByLabel(/two sentences what I want to study/).check();
  await page.getByLabel(/shortlist with a balance/).check();
  await expect(progress).toHaveAttribute("aria-valuenow", "2");
  await expect(page.getByText(/^2 of \d+ tasks done$/)).toBeVisible();

  await page.reload();
  await expect(progress).toHaveAttribute("aria-valuenow", "0");

  await page.getByLabel(/shortlist with a balance/).check();
  await page.getByLabel("Save my progress on this device").check();
  await page.reload();
  await expect(progress).toHaveAttribute("aria-valuenow", "1");
  await expect(page.getByLabel("Save my progress on this device")).toBeChecked();

  await page.getByRole("button", { name: "Reset checklist" }).click();
  await expect(progress).toHaveAttribute("aria-valuenow", "0");
  await page.getByLabel("Save my progress on this device").uncheck();
  expect(await page.evaluate(() => window.localStorage.getItem("advising.readiness.v1"))).toBeNull();
});

test("study plan builder validates input and builds a week-by-week estimate", async ({ page }) => {
  await page.goto("/advising/test-prep/");
  const weeks = page.getByLabel("Weeks until your test");
  const table = page.getByRole("region", { name: /Weekly study plan/ });
  await expect(table.locator("tbody tr")).toHaveCount(8);
  await expect(page.getByText(/planning estimate · 8 weeks · 64 hours in total · no score prediction/)).toBeVisible();

  await weeks.fill("0");
  await expect(page.getByRole("alert").filter({ hasText: "Choose between" })).toContainText("Choose between 1 and 52 weeks.");
  await expect(table).toHaveCount(0);

  await weeks.fill("3");
  await page.getByText("Writing", { exact: true }).click();
  await expect(table.locator("tbody tr")).toHaveCount(3);
  await expect(table.locator("tbody tr").first()).toContainText("Baseline");
  await expect(page.getByRole("option")).toHaveCount(1);
});

test("updates support search, filters, sort, shareable URLs and an empty state", async ({ page }) => {
  await page.goto("/advising/updates/");
  await expect(page.getByRole("status").filter({ hasText: /of 4 updates/ })).toHaveText("4 of 4 updates");

  await page.getByLabel("Search", { exact: true }).fill("chevening");
  await expect(page).toHaveURL(/q=chevening/);
  await expect(page.locator("main li h3")).toHaveCount(1);

  await page.getByLabel("Search", { exact: true }).fill("");
  await page.getByLabel("Status").selectOption("closed");
  await expect(page).toHaveURL(/status=closed/);
  await expect(page.locator("main li h3")).toHaveCount(2);

  await page.getByLabel("Search", { exact: true }).fill("zzzz");
  await expect(page.getByText("No updates match these filters.")).toBeVisible();
  await page.getByRole("button", { name: "Clear search and filters" }).click();
  await expect(page.locator("main li h3")).toHaveCount(4);

  await page.goto("/advising/updates/?type=application-guidance&sort=deadline");
  await expect(page.getByLabel("Type")).toHaveValue("application-guidance");
  await expect(page.getByLabel("Sort by")).toHaveValue("deadline");
  await expect(page.locator("main li h3")).toHaveCount(2);
});

test("update pages link the official source and offer a calendar file only for future verified deadlines", async ({ page }) => {
  await page.clock.install({ time: new Date("2026-11-20T00:00:00Z") });
  await page.goto("/advising/updates/chevening-2027-28-applications-closed/");
  await expect(page.getByRole("link", { name: /Official source/ })).toHaveAttribute("href", "https://www.chevening.org/scholarships/application-timeline/");
  await expect(page.getByText("8 July 2027, 17:00 BST (UK time)")).toBeVisible();
  const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: /Add deadline to calendar/ }).click()]);
  const ics = await (await download.createReadStream()).toArray();
  expect(Buffer.concat(ics).toString()).toContain("DTSTART:20270708T160000Z");

  await page.goto("/advising/updates/fulbright-pakistan-cycle-april-2026-closed/");
  await expect(page.getByText("Closed", { exact: true })).toBeVisible();
  await expect(page.getByText("1 April 2026 (date only; no time zone stated)")).toBeVisible();
  await expect(page.getByRole("button", { name: /Add deadline to calendar/ })).toHaveCount(0);

  await page.goto("/advising/updates/australia-awards-official-resource/");
  await expect(page.getByText("Not verified: check the official source").first()).toBeVisible();
});

test("a verified deadline stops offering a calendar file once the visitor's clock passes it", async ({ page }) => {
  await page.clock.install({ time: new Date("2027-07-09T00:00:00Z") });
  await page.goto("/advising/updates/chevening-2027-28-applications-closed/");
  await expect(page.getByRole("link", { name: /Official source/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Add deadline to calendar/ })).toHaveCount(0);
});

test("booking falls back to verified email while no provider is configured", async ({ page }) => {
  await page.goto("/advising/book/?topic=career");
  await expect(page.getByRole("radio", { name: "Career guidance" })).toBeChecked();
  await expect(page.getByText("Online booking isn’t open yet.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Email me to arrange a time" })).toHaveAttribute(
    "href",
    "mailto:frazahmed79@gmail.com?subject=Advising%20conversation",
  );
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.getByText(/currently free · 30 minutes/).first()).toBeVisible();
});

test("stories show an honest empty state and no fabricated story pages", async ({ page }) => {
  await page.goto("/advising/stories/");
  await expect(page.getByText("No stories published yet.")).toBeVisible();
  await expect(page.locator('a[href^="/advising/stories/"]:not([href="/advising/stories/"])')).toHaveCount(0);

  await page.goto("/advising/stories/none/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
});
