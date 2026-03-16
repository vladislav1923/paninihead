"use server";

import { revalidatePath } from "next/cache";
import { CollectionStatus, DealStatus } from "@/generated/prisma/enums";
import { dealFormSchema, parseCommaSeparatedNumbers } from "@/lib/schemas/deal";
import { db } from "@/lib/utilities/db";
import { validateFormSchema } from "@/lib/utilities/validation";

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

  const [collection, exchanger] = await Promise.all([
    db.collections.findUnique({
      where: { id: collectionId },
      select: { collected: true, total: true },
    }),
    db.exchangers.findUnique({
      where: { id: exchangerId, collectionId },
      select: { has: true, needs: true },
    }),
  ]);
  if (!collection) return { ok: false, errors: { _: "Collection not found" } };
  if (!exchanger) return { ok: false, errors: { _: "Exchanger not found" } };

  const collected = [...(collection.collected ?? [])];
  for (const n of outNumbers) {
    const i = collected.indexOf(n);
    if (i !== -1) collected.splice(i, 1);
  }
  for (const n of inNumbers) {
    collected.push(n);
  }

  const newHas = [...exchanger.has];
  for (const n of inNumbers) {
    const i = newHas.indexOf(n);
    if (i !== -1) newHas.splice(i, 1);
  }
  const newNeeds = [...exchanger.needs];
  for (const n of outNumbers) {
    const i = newNeeds.indexOf(n);
    if (i !== -1) newNeeds.splice(i, 1);
  }

  const isCompleted = collection.total > 0 && new Set(collected).size >= collection.total;

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
    db.exchangers.update({
      where: { id: exchangerId, collectionId },
      data: { has: newHas, needs: newNeeds },
    }),
  ]);

  revalidatePath(`/collections/${collectionId}`);
  return { ok: true };
}

export async function revertDeal(collectionId: string, dealId: string): Promise<Result> {
  const deal = await db.deals.findFirst({
    where: { id: dealId, collectionId },
    select: { inNumbers: true, outNumbers: true, status: true },
  });
  if (!deal) return { ok: false, errors: { _: "Deal not found" } };
  if (deal.status !== DealStatus.Completed) {
    return { ok: false, errors: { _: "Deal is already reverted" } };
  }

  const collection = await db.collections.findUnique({
    where: { id: collectionId },
    select: { collected: true, total: true },
  });
  if (!collection) return { ok: false, errors: { _: "Collection not found" } };

  const collected = [...(collection.collected ?? [])];
  for (const n of deal.inNumbers) {
    const i = collected.indexOf(n);
    if (i !== -1) collected.splice(i, 1);
  }
  for (const n of deal.outNumbers) {
    collected.push(n);
  }

  const isCompleted =
    collection.total > 0 && new Set(collected).size >= collection.total;

  await db.$transaction([
    db.deals.update({
      where: { id: dealId },
      data: { status: DealStatus.Reverted, revertedAt: new Date() },
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
