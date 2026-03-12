"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { validateFormSchema } from "@/lib/utilities/validation";
import { addExchangerSchema, parseCommaSeparatedNumbers } from "@/lib/schemas/exchanger";

type Result =
  | { ok: true }
  | { ok: false; errors: Record<string, string> };

export async function createExchanger(
  collectionId: string,
  raw: unknown
): Promise<Result> {
  const validated = validateFormSchema(addExchangerSchema, raw);
  if (!validated.ok) return { ok: false, errors: validated.errors };

  const { name, link, has, needs } = validated.data;
  await db.exchangers.create({
    data: {
      collectionId,
      name,
      link,
      has: parseCommaSeparatedNumbers(has ?? ""),
      needs: parseCommaSeparatedNumbers(needs ?? ""),
    },
  });

  revalidatePath(`/collections/${collectionId}`);
  return { ok: true };
}
