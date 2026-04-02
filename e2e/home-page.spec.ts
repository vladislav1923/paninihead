import { expect, test } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows logo", async ({ page }) => {
    await expect(page.getByRole("img", { name: "PaniniHead" })).toBeVisible();
  });

  test("shows tagline", async ({ page }) => {
    await expect(
      page.getByText("A service for tracking your collections", { exact: true }),
    ).toBeVisible();
  });

  test("sets document title", async ({ page }) => {
    await expect(page).toHaveTitle(/PaniniHead/);
  });

  test("main content is in a main landmark", async ({ page }) => {
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("main").getByRole("img", { name: "PaniniHead" })).toBeVisible();
  });

  test("collections CTA is a link to /collections", async ({ page }) => {
    const cta = page.getByRole("link", { name: "Go To Collections" });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/collections");
  });

  test("navigates to collections when CTA is clicked", async ({ page }) => {
    await page.getByRole("link", { name: "Go To Collections" }).click();
    await expect(page).toHaveURL(/\/login\/?$/);
  });
});
