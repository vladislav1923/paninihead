import { expect, type Page } from "@playwright/test";
import { nanoid } from "nanoid";

export async function signUpAndLogin(page: Page) {
  const username = `e2e-${nanoid(8)}`;
  const password = "password123";

  await page.goto("/signup");
  await page.locator("#username").fill(username);
  await page.locator("#password").fill(password);
  await page.locator("#passwordConfirmation").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/collections\/?$/);

  return { username, password };
}

export async function loginWithCredentials(page: Page, username: string, password: string) {
  await page.goto("/login");
  await page.locator("#username").fill(username);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/collections\/?$/);
}
