"use server";

import { revalidatePath } from "next/cache";
import { CollectionStatus, DealStatus } from "@/generated/prisma/enums";
import { dealFormSchema } from "@/lib/schemas/deal";
import { parseCommaSeparatedNumbers } from "@/lib/utilities/collected";
import { db } from "@/lib/utilities/db";
import { logger } from "@/lib/utilities/logger";
import { validateFormSchema } from "@/lib/utilities/validation";

type Result = { ok: true } | { ok: false; errors: Record<string, string> };

export async function createDeal(
  collectionId: string,
  exchangerId: string,
  raw: unknown,
): Promise<Result> {
  try {
    logger.info("Create deal", { collectionId, exchangerId });

    const result = validateFormSchema(dealFormSchema, raw);
    if (!result.ok) return { ok: false, errors: result.errors };

    const data = result.data;
    const inNumbers = parseCommaSeparatedNumbers(data.in ?? "");
    const outNumbers = parseCommaSeparatedNumbers(data.out ?? "");
    const errors: Record<string, string> = {};
    if (inNumbers.length === 0 && outNumbers.length === 0) {
      errors.in = "Enter at least one number";
      errors.out = "Enter at least one number";
    }
    if (Object.keys(errors).length) return { ok: false, errors };

    logger.info("Finding collection and exchanger", { collectionId, exchangerId });

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
    if (!collection) {
      logger.error("Failed to find collection", { collectionId });
      return { ok: false, errors: { _: "Collection not found" } };
    }
    if (!exchanger) {
      logger.error("Failed to find exchanger", { collectionId, exchangerId });
      return { ok: false, errors: { _: "Exchanger not found" } };
    }

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
    const collectionStatus = isCompleted ? CollectionStatus.Completed : CollectionStatus.InProgress;
    const completedAt = isCompleted ? new Date() : null;

    logger.info("Creating deal with params", { collectionId, exchangerId, inNumbers, outNumbers });

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
          status: collectionStatus,
          completedAt,
        },
      }),
      db.exchangers.update({
        where: { id: exchangerId, collectionId },
        data: { has: newHas, needs: newNeeds },
      }),
    ]);

    revalidatePath(`/collections/${collectionId}`);
    logger.info("Deal created successfully", {
      collectionId,
      exchangerId,
      status: collectionStatus,
    });
    return { ok: true };
  } catch (cause) {
    const errorMessage = cause instanceof Error ? cause.message : String(cause);
    logger.error("createDeal failed", { collectionId, exchangerId, error: errorMessage });
    return { ok: false, errors: { _: "Failed to create deal" } };
  }
}

export async function revertDeal(collectionId: string, dealId: string): Promise<Result> {
  try {
    logger.info("Revert deal", { collectionId, dealId });

    const deal = await db.deals.findFirst({
      where: { id: dealId, collectionId },
      select: { exchangerId: true, inNumbers: true, outNumbers: true, status: true },
    });
    if (!deal) {
      logger.error("Failed to find deal", { collectionId, dealId });
      return { ok: false, errors: { _: "Deal not found" } };
    }
    if (deal.status !== DealStatus.Completed) {
      logger.error("Deal is already reverted or invalid", {
        collectionId,
        dealId,
        status: deal.status,
      });
      return { ok: false, errors: { _: "Deal is already reverted" } };
    }

    const collection = await db.collections.findUnique({
      where: { id: collectionId },
      select: { collected: true, total: true },
    });
    if (!collection) return { ok: false, errors: { _: "Collection not found" } };

    const exchanger = await db.exchangers.findUnique({
      where: { id: deal.exchangerId, collectionId },
      select: { has: true, needs: true },
    });
    if (!exchanger) return { ok: false, errors: { _: "Exchanger not found" } };

    const collected = [...(collection.collected ?? [])];
    for (const n of deal.inNumbers) {
      const i = collected.indexOf(n);
      if (i !== -1) collected.splice(i, 1);
    }
    for (const n of deal.outNumbers) {
      collected.push(n);
    }

    const isCompleted = collection.total > 0 && new Set(collected).size >= collection.total;
    const collectionStatus = isCompleted ? CollectionStatus.Completed : CollectionStatus.InProgress;
    const completedAt = isCompleted ? new Date() : null;
    const restoredHas = Array.from(new Set([...exchanger.has, ...deal.inNumbers]));
    const restoredNeeds = Array.from(new Set([...exchanger.needs, ...deal.outNumbers]));

    logger.info("Reverting deal with params", {
      collectionId,
      dealId,
      collected,
      total: collection.total,
    });

    await db.$transaction([
      db.deals.update({
        where: { id: dealId },
        data: { status: DealStatus.Reverted, revertedAt: new Date() },
      }),
      db.collections.update({
        where: { id: collectionId },
        data: {
          collected,
          status: collectionStatus,
          completedAt,
        },
      }),
      db.exchangers.update({
        where: { id: deal.exchangerId, collectionId },
        data: {
          has: restoredHas,
          needs: restoredNeeds,
        },
      }),
    ]);

    revalidatePath(`/collections/${collectionId}`);
    logger.info("Deal reverted successfully", { collectionId, dealId, status: collectionStatus });
    return { ok: true };
  } catch (cause) {
    const errorMessage = cause instanceof Error ? cause.message : String(cause);
    logger.error("Failed to revert deal with error", { collectionId, dealId, error: errorMessage });
    return { ok: false, errors: { _: "Failed to revert deal" } };
  }
}
