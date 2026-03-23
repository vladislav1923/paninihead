import { expect, test } from "@playwright/test";

test.describe("Collections List Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/collections");
  });

  test("shows page heading", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Collections" })).toBeVisible();
  });

  test("shows main content area", async ({ page }) => {
    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("main").getByRole("link", { name: "Create new collection" }),
    ).toBeVisible();
  });

  test("lists collections in a list", async ({ page }) => {
    await expect(page.getByRole("main").getByRole("list")).toHaveCount(1);
  });

  test("shows empty hint or at least one collection row", async ({ page }) => {
    const items = page.getByRole("main").getByRole("listitem");
    const count = await items.count();
    if (count === 0) {
      await expect(
        page.getByText("No collections yet. Create one to get started.", { exact: true }),
      ).toBeVisible();
    } else {
      await expect(items.first()).toBeVisible();
    }
  });

  test("Create new collection links to the form", async ({ page }) => {
    const create = page.getByRole("link", { name: "Create new collection" });
    await expect(create).toBeVisible();
    await expect(create).toHaveAttribute("href", "/collections/new");
  });

  test("navigates to new collection from CTA", async ({ page }) => {
    await page.getByRole("link", { name: "Create new collection" }).click();
    await expect(page).toHaveURL(/\/collections\/new\/?$/);
    await expect(page.getByRole("heading", { name: "New collection" })).toBeVisible();
  });
});
