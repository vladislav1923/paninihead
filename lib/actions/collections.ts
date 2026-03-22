"use server";

import { revalidatePath } from "next/cache";
import { CollectionStatus } from "@/generated/prisma/enums";
import { createCollectionSchema } from "@/lib/schemas/collection";
import { db } from "@/lib/utilities/db";
import { logger } from "@/lib/utilities/logger";
import { validateFormSchema } from "@/lib/utilities/validation";

export type CreateCollectionResult = { ok: true } | { ok: false; errors: Record<string, string> };

export async function createCollection(raw: unknown): Promise<CreateCollectionResult> {
  try {
    logger.info("Create collection");

    const result = validateFormSchema(createCollectionSchema, raw);
    if (!result.ok) return { ok: false, errors: result.errors };

    const data = result.data;
    const name = data.name.trim();
    const imageUrl = data.imageUrl?.trim() || null;
    const total = data.total;

    logger.info("Creating collection with params", { name, total });

    await db.collections.create({
      data: {
        name,
        imageUrl,
        total,
        collected: [],
      },
    });

    revalidatePath("/collections");

    logger.info("Collection created successfully", { name });

    return { ok: true };
  } catch (cause) {
    const errorMessage = cause instanceof Error ? cause.message : String(cause);
    logger.error("Failed to create collection with error", { error: errorMessage });
    return { ok: false, errors: { _: "Failed to create collection" } };
  }
}

export async function updateCollected(collectionId: string, collected: number[], total: number) {
  try {
    logger.info("Update collected in the collection", { collectionId, collected, total });
    const isCompleted = collected.length === total;
    const status = isCompleted ? CollectionStatus.Completed : CollectionStatus.InProgress;
    const completedAt = isCompleted ? new Date() : null;

    logger.info("Updating collected with params", {
      collectionId,
      collectedCount: collected.length,
      total,
    });

    await db.collections.update({
      where: { id: collectionId },
      data: {
        collected,
        status,
        completedAt,
      },
    });

    logger.info("Collected updated successfully", { collectionId });

    return { ok: true };
  } catch (cause) {
    const errorMessage = cause instanceof Error ? cause.message : String(cause);
    logger.error("Failed to update collected with error", {
      error: errorMessage,
    });
    return { ok: false, errors: { _: "Failed to update collected" } };
  }
}
