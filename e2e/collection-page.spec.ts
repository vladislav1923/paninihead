import { expect, type Page, test } from "@playwright/test";
import { nanoid } from "nanoid";
import { loginWithCredentials, signUpAndLogin } from "./helpers/auth";

/** Must match `playwright.config.ts` use.baseURL (origin only). */
const E2E_ORIGIN = "http://127.0.0.1:3001";

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

test.describe.configure({ mode: "serial" });

let collectionName: string;
let collectionPageUrl: string;
let authUsername: string;
let authPassword: string;

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const auth = await signUpAndLogin(page);
  authUsername = auth.username;
  authPassword = auth.password;
  const created = await createCollectionAndOpenDetail(page);
  collectionName = created.name;
  collectionPageUrl = created.url;
  await context.close();
});

test.beforeEach(async ({ page }) => {
  await loginWithCredentials(page, authUsername, authPassword);
});

test.describe("Collection page", () => {
  test("shows collection name as page title and controls", async ({ page }) => {
    await page.goto(collectionPageUrl);
    await expect(page.getByRole("heading", { level: 1, name: collectionName })).toBeVisible();
    await expect(page.getByRole("button", { name: "Add Stickers" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Add Exchanger" })).toBeVisible();
  });

  test("shows in-progress badge and progress", async ({ page }) => {
    await page.goto(collectionPageUrl);
    await expect(page.getByText("IN PROGRESS", { exact: true })).toBeVisible();
    await expect(page.getByText("0 / 5 collected", { exact: true })).toBeVisible();
  });

  test("back link returns to collections list", async ({ page }) => {
    await page.goto(collectionPageUrl);
    await page.getByRole("link", { name: /Back to collections/i }).click();
    await expect(page).toHaveURL(/\/collections\/?$/);
    await expect(page.getByRole("heading", { level: 1, name: "Collections" })).toBeVisible();
  });
});

test.describe("Collection 404", () => {
  test("responds with not found for unknown id", async ({ page }) => {
    const response = await page.goto("/collections/clnonexistent00000000000000000");
    expect(response?.status(), "expected HTTP 404").toBe(404);
  });
});

test.describe("Collected", () => {
  test("adds stickers and synchronizes with collected preview", async ({ page }) => {
    await page.goto(collectionPageUrl);

    await page.getByRole("button", { name: "Add Stickers" }).click();
    const dialog = page.getByRole("dialog", { name: "Add Stickers" });
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: "Add one of 1" }).click();
    await dialog.getByRole("button", { name: "Add one of 1" }).click();
    await dialog.getByRole("button", { name: "Add one of 3" }).click();

    await expect(dialog.getByText("Adding:")).toBeVisible();
    await expect(dialog.getByText("1 (2), 3", { exact: true })).toBeVisible();

    await dialog.getByRole("button", { name: "Save" }).click();
    await expect(dialog).toBeHidden({ timeout: 15_000 });
    await expect(page.getByText("2 / 5 collected", { exact: true })).toBeVisible();
  });

  test("removes stickers and synchronizes with collected preview", async ({ page }) => {
    await page.goto(collectionPageUrl);
    await expect(page.getByText("2 / 5 collected", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Add Stickers" }).click();
    const dialog = page.getByRole("dialog", { name: "Add Stickers" });
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: "Remove one of 1" }).click();
    await dialog.getByRole("button", { name: "Remove one of 1" }).click();
    await dialog.getByRole("button", { name: "Remove one of 3" }).click();

    await expect(dialog.getByText("Removing:")).toBeVisible();
    await expect(dialog.getByText("1 (2), 3", { exact: true })).toBeVisible();

    await dialog.getByRole("button", { name: "Save" }).click();
    await expect(dialog).toBeHidden({ timeout: 15_000 });
    await expect(page.getByText("0 / 5 collected", { exact: true })).toBeVisible();
  });
});

test.describe("Collection exchangers", () => {
  const exchangerLink = "https://example.com/e2e-trader";
  const exchangerName = `E2E Trader ${Date.now()}`;
  const editedExchangerName = `${exchangerName} Edited`;

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

  test("edits an exchanger", async ({ page }) => {
    await page.goto(collectionPageUrl);
    await page.getByRole("button", { name: `Edit ${exchangerName}` }).click();
    const dialog = page.getByRole("dialog", { name: "Edit Exchanger" });
    await expect(dialog).toBeVisible();

    await dialog.locator("#add-exchanger-name").fill(editedExchangerName);
    await dialog.locator("#add-exchanger-has").fill("4, 5");
    await dialog.locator("#add-exchanger-needs").fill("1");
    await dialog.getByRole("button", { name: "Save" }).click();
    await expect(dialog).toBeHidden({ timeout: 15_000 });

    await expect(page.getByText(editedExchangerName, { exact: true })).toBeVisible();
    await expect(page.getByText(exchangerName, { exact: true })).toHaveCount(0);
  });

  test("exchanger in/out numbers sync with collected updates", async ({ page }) => {
    await page.goto(collectionPageUrl);

    const syncExchangerName = `E2E Sync ${nanoid(5)}`;
    await page.getByRole("button", { name: "Add Exchanger" }).click();
    const addDialog = page.getByRole("dialog", { name: "Add Exchanger" });
    await expect(addDialog).toBeVisible();
    await addDialog.locator("#add-exchanger-name").fill(syncExchangerName);
    await addDialog.locator("#add-exchanger-link").fill("https://example.com/e2e-sync");
    await addDialog.locator("#add-exchanger-has").fill("1, 2");
    await addDialog.locator("#add-exchanger-needs").fill("2");
    await addDialog.getByRole("button", { name: "Save" }).click();
    await expect(addDialog).toBeHidden({ timeout: 15_000 });

    const syncCard = page
      .locator("li")
      .filter({ has: page.getByText(syncExchangerName, { exact: true }) });
    await expect(syncCard.getByText(/2\s*\/\s*0/)).toBeVisible();

    await addTwoOfSticker(page, 2);
    await expect(syncCard.getByText(/1\s*\/\s*1/)).toBeVisible();
  });

  test("deletes the exchanger", async ({ page }) => {
    await page.goto(collectionPageUrl);
    await page.getByRole("button", { name: `Delete ${editedExchangerName}` }).click();
    const dialog = page.getByRole("dialog", { name: "Delete exchanger" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(dialog).toBeHidden({ timeout: 15_000 });
    await expect(page.getByRole("button", { name: `Delete ${editedExchangerName}` })).toHaveCount(
      0,
    );
  });
});

test.describe("Collection deals", () => {
  const exchangerLink = "https://example.com/e2e-trader-deals";
  const exchangerName = `E2E Deals ${Date.now()}`;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginWithCredentials(page, authUsername, authPassword);
    await page.goto(collectionPageUrl);
    await addTwoOfSticker(page, 2);
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
    await expect(dealsBlock.getByText(/1\s*\/\s*1/)).toBeVisible();
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
    await expect(page.getByText("1 / 5 collected", { exact: true })).toBeVisible();
    const exchangerCard = page
      .locator("li")
      .filter({ has: page.getByRole("button", { name: `Make deal with ${exchangerName}` }) });
    await expect(exchangerCard.getByText(/1\s*\/\s*1/)).toBeVisible();
  });
});
