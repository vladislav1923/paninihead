import { expect, type Page, test } from "@playwright/test";
import { nanoid } from "nanoid";
import { E2E_ORIGIN } from "./constants";

async function createCollectionAndOpenDetail(
  page: Page,
  total = "5",
): Promise<{ name: string; url: string }> {
  const name = `Collection-${nanoid(5)}`;
  await page.goto(`${E2E_ORIGIN}/collections/new`);
  await page.getByLabel(/name/i).fill(name);
  await page.getByLabel(/total/i).fill(total);
  await page.getByRole("button", { name: "Create collection" }).click();
  await expect(page).toHaveURL(/\/collections\/?$/);
  await page
    .getByRole("listitem")
    .filter({ has: page.getByText(name, { exact: true }) })
    .getByRole("link")
    .click();
  await expect(page).toHaveURL(/\/collections\/[^/]+\/?$/);
  return { name, url: page.url() };
}

async function addTwoOfSticker(page: Page, n: number): Promise<void> {
  await page.getByRole("button", { name: "Add Stickers" }).click();
  const dialog = page.getByRole("dialog", { name: "Add Stickers" });
  await expect(dialog).toBeVisible();
  const add = dialog.getByRole("button", { name: `Add one of ${n}` });
  await add.click();
  await add.click();
  await dialog.getByRole("button", { name: "Save" }).click();
  await expect(dialog).toBeHidden({ timeout: 15_000 });
}

test.describe("Collection page", () => {
  let collectionName: string;

  test.beforeEach(async ({ page }) => {
    const created = await createCollectionAndOpenDetail(page);
    collectionName = created.name;
  });

  test("shows collection name as page title", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: collectionName })).toBeVisible();
  });

  test("shows in-progress badge for new collection", async ({ page }) => {
    await expect(page.getByText("IN PROGRESS", { exact: true })).toBeVisible();
  });

  test("shows collected progress", async ({ page }) => {
    await expect(page.getByText("0 / 5 collected", { exact: true })).toBeVisible();
  });

  test("shows Add Stickers control", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Add Stickers" })).toBeVisible();
  });

  test("shows exchangers section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Exchangers" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Add Exchanger" })).toBeVisible();
  });

  test("back link returns to collections list", async ({ page }) => {
    await page.getByRole("link", { name: /Back to collections/i }).click();
    await expect(page).toHaveURL(/\/collections\/?$/);
    await expect(page.getByRole("heading", { level: 1, name: "Collections" })).toBeVisible();
  });

  test("main wraps primary content", async ({ page }) => {
    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("main").getByRole("heading", { level: 1, name: collectionName }),
    ).toBeVisible();
  });
});

test.describe("Collection 404", () => {
  test("responds with not found for unknown id", async ({ page }) => {
    const response = await page.goto("/collections/clnonexistent00000000000000000");
    expect(response?.status(), "expected HTTP 404").toBe(404);
  });
});

test.describe("Collection exchangers", () => {
  test.describe.configure({ mode: "serial" });

  const exchangerLink = "https://example.com/e2e-trader";
  const exchangerName = `E2E Trader ${Date.now()}`;

  let collectionPageUrl: string;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const { url } = await createCollectionAndOpenDetail(page);
    collectionPageUrl = url;
    await context.close();
  });

  test("creates an exchanger", async ({ page }) => {
    await page.goto(collectionPageUrl);
    await page.getByRole("button", { name: "Add Exchanger" }).click();
    const dialog = page.getByRole("dialog", { name: "Add Exchanger" });
    await expect(dialog).toBeVisible();
    await dialog.locator("#add-exchanger-name").fill(exchangerName);
    await dialog.locator("#add-exchanger-link").fill(exchangerLink);
    await dialog.locator("#add-exchanger-has").fill("1");
    await dialog.locator("#add-exchanger-needs").fill("2");
    await dialog.getByRole("button", { name: "Save" }).click();
    await expect(dialog).toBeHidden({ timeout: 15_000 });
    await expect(page.getByText(exchangerName, { exact: true })).toBeVisible();
  });

  test("exchanger external link points to the saved URL", async ({ page }) => {
    await page.goto(collectionPageUrl);
    const link = page.getByRole("link", { name: `Open ${exchangerName} link in new tab` });
    await expect(link).toHaveAttribute("href", exchangerLink);
    const popupPromise = page.waitForEvent("popup");
    await link.click();
    const popup = await popupPromise;
    await expect(popup).toHaveURL(exchangerLink);
    await popup.close();
  });

  test("deletes the exchanger", async ({ page }) => {
    await page.goto(collectionPageUrl);
    await page.getByRole("button", { name: `Delete ${exchangerName}` }).click();
    const dialog = page.getByRole("dialog", { name: "Delete exchanger" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(dialog).toBeHidden({ timeout: 15_000 });
    await expect(page.getByText("No exchangers yet.")).toBeVisible();
  });
});

test.describe("Collection deals", () => {
  test.describe.configure({ mode: "serial" });

  const exchangerLink = "https://example.com/e2e-trader-deals";
  const exchangerName = `E2E Deals ${Date.now()}`;

  let collectionPageUrl: string;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const { url } = await createCollectionAndOpenDetail(page);
    await addTwoOfSticker(page, 2);
    collectionPageUrl = url;
    await context.close();
  });

  test("creates an exchanger for deal flow", async ({ page }) => {
    await page.goto(collectionPageUrl);
    await page.getByRole("button", { name: "Add Exchanger" }).click();
    const dialog = page.getByRole("dialog", { name: "Add Exchanger" });
    await expect(dialog).toBeVisible();
    await dialog.locator("#add-exchanger-name").fill(exchangerName);
    await dialog.locator("#add-exchanger-link").fill(exchangerLink);
    await dialog.locator("#add-exchanger-has").fill("1");
    await dialog.locator("#add-exchanger-needs").fill("2");
    await dialog.getByRole("button", { name: "Save" }).click();
    await expect(dialog).toBeHidden({ timeout: 15_000 });
    await expect(page.getByText(exchangerName, { exact: true })).toBeVisible();
  });

  test("makes a deal using suggested in/out numbers", async ({ page }) => {
    await page.goto(collectionPageUrl);
    await page.getByRole("button", { name: `Make deal with ${exchangerName}` }).click();
    const dialog = page.getByRole("dialog", { name: `Make a Deal with ${exchangerName}` });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("#make-deal-in")).toHaveValue(/1/);
    await expect(dialog.locator("#make-deal-out")).toHaveValue(/2/);
    await dialog.getByRole("button", { name: "Save" }).click();
    await expect(dialog).toBeHidden({ timeout: 15_000 });

    const dealsBlock = page.getByRole("heading", { name: "Deals" }).locator("..");
    await expect(dealsBlock.getByText(exchangerName, { exact: true })).toBeVisible();
    await expect(dealsBlock.getByText(/^Created /)).toBeVisible();
  });

  test("reverts the active deal", async ({ page }) => {
    await page.goto(collectionPageUrl);
    await page.getByRole("button", { name: `Revert deal with ${exchangerName}` }).click();
    const dialog = page.getByRole("dialog", { name: "Revert deal" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Revert" }).click();
    await expect(dialog).toBeHidden({ timeout: 15_000 });

    const dealsBlock = page.getByRole("heading", { name: "Deals" }).locator("..");
    await expect(dealsBlock.getByText(/^Reverted /)).toBeVisible();
    await expect(
      page.getByRole("button", { name: `Revert deal with ${exchangerName}` }),
    ).toHaveCount(0);
  });
});
