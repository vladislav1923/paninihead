import { expect, test } from "@playwright/test";

test.describe("Home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows primary heading", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: "PaniniHead" })).toBeVisible();
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
    await expect(page.getByRole("main").getByRole("heading", { name: "PaniniHead" })).toBeVisible();
  });

  test("collections CTA is a link to /collections", async ({ page }) => {
    const cta = page.getByRole("link", { name: "Go To Collections" });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/collections");
  });

  test("navigates to collections when CTA is clicked", async ({ page }) => {
    await page.getByRole("link", { name: "Go To Collections" }).click();
    await expect(page).toHaveURL(/\/collections\/?$/);
  });
});
