import { expect, test } from "@playwright/test";
import { e2eCollectionPageUrl } from "./playwright-utils";
import { seedE2ECollection } from "./postgres";

test.describe("Collection exchangers", () => {
  test.describe.configure({ mode: "serial" });

  const exchangerLink = "https://example.com/e2e-trader";
  const exchangerName = `E2E Trader ${Date.now()}`;

  let collectionPageUrl: string;

  test.beforeAll(async () => {
    const id = await seedE2ECollection([]);
    collectionPageUrl = e2eCollectionPageUrl(id);
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
