import { expect, test } from "@playwright/test";
import { nanoid } from "nanoid";

test.describe("New collection page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/collections/new");
  });

  test("shows page heading", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: "New collection" })).toBeVisible();
  });

  test("shows main and form", async ({ page }) => {
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.locator("form")).toBeVisible();
  });

  test("back link goes to collections list", async ({ page }) => {
    const back = page.getByRole("link", { name: /Back to collections/i });
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute("href", "/collections");
    await back.click();
    await expect(page).toHaveURL(/\/collections\/?$/);
  });

  test("shows name, image URL, and total fields", async ({ page }) => {
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/^image url$/i)).toBeVisible();
    await expect(page.getByLabel(/total/i)).toBeVisible();
  });

  test("shows create and reset actions", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Create collection" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Reset" })).toBeVisible();
  });

  test("shows validation errors when submitting empty form", async ({ page }) => {
    await page.getByRole("button", { name: "Create collection" }).click();
    await expect(page.getByText("Name is required.", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Total is required and must be a number.", { exact: true }),
    ).toBeVisible();
  });

  test("reset clears filled fields", async ({ page }) => {
    await page.getByLabel(/name/i).fill("Temp name");
    await page.getByLabel(/total/i).fill("5");
    await page.getByRole("button", { name: "Reset" }).click();
    await expect(page.getByLabel(/name/i)).toHaveValue("");
    await expect(page.getByLabel(/total/i)).toHaveValue("");
  });

  test("creates collection and navigates to list", async ({ page }) => {
    const name = `Collection-${nanoid(5)}`;
    await page.getByLabel(/name/i).fill(name);
    await page.getByLabel(/total/i).fill("10");
    await page.getByRole("button", { name: "Create collection" }).click();
    await expect(page).toHaveURL(/\/collections\/?$/);
    await expect(
      page.getByRole("listitem").filter({ has: page.getByText(name, { exact: true }) }),
    ).toBeVisible();
  });
});
