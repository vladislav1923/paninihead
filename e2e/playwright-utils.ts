import type { Page } from "@playwright/test";
import { nanoid } from "nanoid";

/** Must match `playwright.config.ts` use.baseURL (origin only). */
export const E2E_ORIGIN = "http://127.0.0.1:3001";

/** Collection name max 20 chars (`NAME_MAX`); `nanoid` avoids collisions across workers. */
export function uniqueE2ECollectionName(): string {
  return nanoid(20);
}

export function e2eCollectionPageUrl(collectionId: string): string {
  return `${E2E_ORIGIN}/collections/${collectionId}`;
}

/** Opens a collection from the list page (card is a link; heading role is unreliable inside the link). */
export async function openCollectionDetailFromList(page: Page, collectionName: string) {
  await page
    .getByRole("listitem")
    .filter({ has: page.getByText(collectionName, { exact: true }) })
    .getByRole("link")
    .click();
}
