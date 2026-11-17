import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const AREAS = ["Research", "Product management", "Consulting", "Public finance", "Career advising"] as const;

const controls = (page: Page) => page.getByRole("list", { name: "Areas on the workbench" });
const area = (page: Page, name: string) => controls(page).getByRole("button", { name, exact: true });
const detail = (page: Page) => page.locator("section[id$='-detail']");
const detailHeading = (page: Page) => detail(page).getByRole("heading", { level: 3 });
const reset = (page: Page) => page.getByRole("button", { name: "Reset exploration" });
/** The wide scene (tablet and up) is the one visible in the desktop project. */
const wideObject = (page: Page, id: string) => page.locator(`.wb-depth-front .wb-object[data-area="${id}"]`);

test.beforeEach(async ({ page }) => {
  await page.goto("/about/");
});

test("the workbench sits between the introduction and the career narrative", async ({ page }) => {
  const order = await page.evaluate(() => {
    const top = (selector: string) => document.querySelector(selector)?.getBoundingClientRect().top ?? NaN;
    const narrative = Array.from(document.querySelectorAll("strong")).find((el) => el.textContent === "Public finance.");
    return { intro: top("h1"), workbench: top("#workbench-title"), narrative: narrative?.getBoundingClientRect().top ?? NaN };
  });
  expect(order.intro).toBeLessThan(order.workbench);
  expect(order.workbench).toBeLessThan(order.narrative);
  await expect(page.getByRole("heading", { level: 2, name: "Different settings. A consistent approach." })).toBeVisible();
});

test("the overview describes the scene and lists all five areas with links", async ({ page }) => {
  await expect(detailHeading(page)).toHaveText("One notebook, four settings");
  await expect(detail(page)).toContainText("An open research notebook sits at the centre");
  for (const name of AREAS) await expect(detail(page)).toContainText(name);
  await expect(detail(page).getByRole("link")).toHaveCount(5);
  await expect(reset(page)).toHaveAttribute("aria-disabled", "true");
  for (const name of AREAS) await expect(area(page, name)).toHaveAttribute("aria-pressed", "false");
});

test("every area opens its details, and every link in them resolves", async ({ page, request }) => {
  const hrefs = new Set<string>();
  for (const name of AREAS) {
    await area(page, name).click();
    await expect(area(page, name)).toHaveAttribute("aria-pressed", "true");
    await expect(detailHeading(page)).toHaveText(name);
    for (const href of await detail(page).getByRole("link").evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""))) hrefs.add(href);
  }
  expect(hrefs.size).toBeGreaterThan(5);
  for (const href of hrefs) {
    expect(href, `${href} should be a site page`).toMatch(/^\/.*\/(#.*)?$/);
    const response = await request.get(href.split("#")[0]);
    expect(response.status(), href).toBe(200);
  }
});

test("hovering another object previews it without replacing the selection", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "phone", "hover previews need a pointer that hovers");
  await area(page, "Consulting").click();
  await area(page, "Public finance").hover();

  await expect(wideObject(page, "public-finance")).toHaveAttribute("data-state", "preview");
  await expect(wideObject(page, "consulting")).toHaveAttribute("data-state", "selected");
  await expect(detailHeading(page)).toHaveText("Consulting");
  await expect(area(page, "Public finance")).toHaveAttribute("aria-pressed", "false");

  await page.mouse.move(2, 2);
  await expect(wideObject(page, "public-finance")).toHaveAttribute("data-state", "dimmed");
  await expect(detailHeading(page)).toHaveText("Consulting");
});

test("keyboard: Enter and Space select, Escape and Reset return to the overview", async ({ page }) => {
  await area(page, "Research").focus();
  await page.keyboard.press("Enter");
  await expect(area(page, "Research")).toHaveAttribute("aria-pressed", "true");
  await expect(detailHeading(page)).toHaveText("Research");

  await page.keyboard.press("Tab");
  await expect(area(page, "Product management")).toBeFocused();
  await page.keyboard.press("Space");
  await expect(area(page, "Product management")).toHaveAttribute("aria-pressed", "true");
  await expect(area(page, "Research")).toHaveAttribute("aria-pressed", "false");

  await page.keyboard.press("Escape");
  await expect(detailHeading(page)).toHaveText("One notebook, four settings");
  await expect(area(page, "Product management")).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(detailHeading(page)).toHaveText("Product management");
  await reset(page).click();
  await expect(detailHeading(page)).toHaveText("One notebook, four settings");
  await expect(reset(page)).toBeFocused();
  await expect(reset(page)).toHaveAttribute("aria-disabled", "true");
});

test("research stages step both ways and a setting can be highlighted", async ({ page }) => {
  await area(page, "Research").click();
  const stageBox = detail(page).getByText(/^stage \d of 5$/);
  const next = detail(page).getByRole("button", { name: /^Next/ });
  const previous = detail(page).getByRole("button", { name: /^Previous/ });

  await expect(stageBox).toHaveText("stage 1 of 5");
  await expect(previous).toHaveAttribute("aria-disabled", "true");
  for (let i = 0; i < 4; i += 1) await next.click();
  await expect(stageBox).toHaveText("stage 5 of 5");
  await expect(detail(page)).toContainText("Implications");
  await expect(next).toHaveAttribute("aria-disabled", "true");
  await expect(next).toBeFocused(); // reaching the end doesn't drop keyboard focus
  await page.keyboard.press("Enter");
  await expect(stageBox).toHaveText("stage 5 of 5");

  await previous.click();
  await expect(stageBox).toHaveText("stage 4 of 5");
  await expect(detail(page).getByRole("button", { name: /Findings/ })).toHaveAttribute("aria-current", "step");
  await detail(page).getByRole("button", { name: /Method/ }).click();
  await expect(stageBox).toHaveText("stage 2 of 5");

  const lens = detail(page).getByRole("group", { name: "How research informs each setting" });
  await lens.getByRole("button", { name: "Consulting" }).click();
  await expect(lens.getByRole("button", { name: "Consulting" })).toHaveAttribute("aria-pressed", "true");
  await expect(detail(page)).toContainText("all 50 slide claims");
  await expect(page.locator(`.wb-canvas:visible .wb-link[data-area="consulting"]`)).toHaveAttribute("data-state", "active");
  await expect(page.locator(`.wb-canvas:visible .wb-link[data-area="advising"]`)).toHaveAttribute("data-state", "faint");
});

test("phones get numbered selectors beneath the scene and tap to select", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "phone", "phone layout only");
  const scene = page.locator(".wb-canvas:visible");
  await expect(scene).toHaveCount(1);
  const sceneBox = await scene.boundingBox();
  const firstButton = await area(page, "Research").boundingBox();
  expect(sceneBox && firstButton && firstButton.y).toBeGreaterThanOrEqual((sceneBox?.y ?? 0) + (sceneBox?.height ?? 0));
  for (const name of AREAS) expect((await area(page, name).boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);

  await area(page, "Public finance").tap();
  await expect(detailHeading(page)).toHaveText("Public finance");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("pointer movement tilts the scene and settles back when the pointer leaves", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "phone", "tilt is for hovering pointers on wider screens");
  const stage = page.locator(".wb-stage");
  await expect(stage).toHaveAttribute("data-motion", "");
  await stage.scrollIntoViewIfNeeded();
  const box = await stage.boundingBox();
  if (!box) throw new Error("no stage");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.move(box.x + box.width * 0.95, box.y + box.height / 2, { steps: 4 });
  await expect.poll(async () => Number(await stage.evaluate((el) => el.style.getPropertyValue("--wb-ry") || "0"))).toBeGreaterThan(3);
  await page.mouse.move(2, 2);
  await expect.poll(async () => Math.abs(Number(await stage.evaluate((el) => el.style.getPropertyValue("--wb-ry") || "0")))).toBeLessThan(0.05);
});

test("with reduced motion the scene stays still but selection still works", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "phone", "desktop pointer check");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  const stage = page.locator(".wb-stage");
  await expect(stage).not.toHaveAttribute("data-motion", "");
  await stage.scrollIntoViewIfNeeded();
  const box = await stage.boundingBox();
  if (!box) throw new Error("no stage");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.move(box.x + box.width * 0.95, box.y + box.height / 2, { steps: 4 });
  await page.waitForTimeout(300);
  expect(await stage.evaluate((el) => el.style.getPropertyValue("--wb-ry"))).toBe("");
  await area(page, "Career advising").click();
  await expect(detailHeading(page)).toHaveText("Career advising");
  await expect(detail(page)).toContainText("not a guarantee");
});

test("no axe violations with research open and a setting highlighted", async ({ page }) => {
  await area(page, "Research").click();
  await detail(page).getByRole("group", { name: "How research informs each setting" }).getByRole("button", { name: "Public finance" }).click();
  const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(axe.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
});

test("a click leaves no lingering preview once the pointer moves away", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "phone", "checks the wide scene");
  await area(page, "Consulting").click();
  await area(page, "Consulting").click(); // selecting again returns to the overview
  await page.mouse.move(2, 2);
  await expect(detailHeading(page)).toHaveText("One notebook, four settings");
  await expect(wideObject(page, "consulting")).toHaveAttribute("data-state", "idle");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the overview stands alone and no control is left that can't work", async ({ page }) => {
    await page.goto("/about/");
    await expect(detailHeading(page)).toHaveText("One notebook, four settings");
    await expect(detail(page).getByRole("link")).toHaveCount(5);
    await expect(page.locator(".wb-controls button")).toHaveCount(0);
    await expect(page.locator(".wb-controls")).toContainText("Career advising");
    await expect(page.getByRole("button", { name: "Reset exploration" })).toHaveCount(0);
  });
});
