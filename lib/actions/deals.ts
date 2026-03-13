"use server";

import { revalidatePath } from "next/cache";
import { CollectionStatus } from "@/generated/prisma/enums";
import { db } from "@/lib/utilities/db";
import { parseCommaSeparatedNumbers } from "@/lib/schemas/deal";
import { validateFormSchema } from "@/lib/utilities/validation";
import { dealFormSchema } from "@/lib/schemas/deal";

type Result = { ok: true } | { ok: false; errors: Record<string, string> };

export async function createDeal(
  collectionId: string,
  exchangerId: string,
  raw: unknown,
): Promise<Result> {
  const validated = validateFormSchema(dealFormSchema, raw);
  if (!validated.ok) return { ok: false, errors: validated.errors };

  const inNumbers = parseCommaSeparatedNumbers(validated.data.in ?? "");
  const outNumbers = parseCommaSeparatedNumbers(validated.data.out ?? "");

  const errors: Record<string, string> = {};
  if (inNumbers.length === 0) errors.in = "Enter at least one number";
  if (outNumbers.length === 0) errors.out = "Enter at least one number";
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const collection = await db.collections.findUnique({
    where: { id: collectionId },
    select: { collected: true, total: true },
  });
  if (!collection) return { ok: false, errors: { _: "Collection not found" } };

  const collected = [...(collection.collected ?? [])];
  for (const n of outNumbers) {
    const i = collected.indexOf(n);
    if (i !== -1) collected.splice(i, 1);
  }
  for (const n of inNumbers) {
    collected.push(n);
  }

  const isCompleted =
    collection.total > 0 &&
    new Set(collected).size >= collection.total;

  await db.$transaction([
    db.deals.create({
      data: {
        collectionId,
        exchangerId,
        inNumbers,
        outNumbers,
      },
    }),
    db.collections.update({
      where: { id: collectionId },
      data: {
        collected,
        status: isCompleted ? CollectionStatus.Completed : CollectionStatus.InProgress,
        completedAt: isCompleted ? new Date() : null,
      },
    }),
  ]);

  revalidatePath(`/collections/${collectionId}`);
  return { ok: true };
}
