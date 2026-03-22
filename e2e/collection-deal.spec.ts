import { expect, test } from "@playwright/test";
import { nanoid } from "nanoid";
import pg from "pg";
import { E2E_ORIGIN } from "./constants";

async function seedE2ECollection(collected: number[], total = 5): Promise<string> {
  const id = `Collection-${nanoid(5)}`;
  const name = `D${Date.now()}`;
  const client = new pg.Client({ connectionString: process.env.POSTGRES_URL });
  await client.connect();
  try {
    await client.query(
      `INSERT INTO "Collections" (id, name, status, total, collected, "createdAt")
       VALUES ($1, $2, 'InProgress'::"CollectionStatus", $3, $4, NOW())`,
      [id, name, total, collected],
    );
    return id;
  } finally {
    await client.end();
  }
}

test.describe("Collection exchangers", () => {
  test.describe.configure({ mode: "serial" });

  const exchangerLink = "https://example.com/e2e-trader";
  const exchangerName = `E2E Trader ${Date.now()}`;

  let collectionPageUrl: string;

  test.beforeAll(async () => {
    const id = await seedE2ECollection([]);
    collectionPageUrl = `${E2E_ORIGIN}/collections/${id}`;
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

  test.beforeAll(async () => {
    const id = await seedE2ECollection([2, 2]);
    collectionPageUrl = `${E2E_ORIGIN}/collections/${id}`;
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
