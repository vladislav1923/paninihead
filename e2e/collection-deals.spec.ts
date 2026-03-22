import { expect, test } from "@playwright/test";
import { E2E_ORIGIN } from "./constants";
import { seedE2ECollection } from "./postgres";

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
