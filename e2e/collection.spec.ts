import { expect, type Page, test } from "@playwright/test";
import { nanoid } from "nanoid";

async function createCollectionAndOpenDetail(page: Page, total = "5"): Promise<string> {
  const name = `Collection-${nanoid(5)}`;
  await page.goto("/collections/new");
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
  return name;
}

test.describe("Collection page", () => {
  let collectionName: string;

  test.beforeEach(async ({ page }) => {
    collectionName = await createCollectionAndOpenDetail(page);
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
