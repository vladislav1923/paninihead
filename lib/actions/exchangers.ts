"use server";

import { revalidatePath } from "next/cache";
import { addExchangerSchema } from "@/lib/schemas/exchanger";
import { parseCommaSeparatedNumbers } from "@/lib/utilities/collected";
import { db } from "@/lib/utilities/db";
import { logger } from "@/lib/utilities/logger";
import { validateFormSchema } from "@/lib/utilities/validation";

type Result = { ok: true } | { ok: false; errors: Record<string, string> };

export async function createExchanger(collectionId: string, raw: unknown): Promise<Result> {
  try {
    logger.info("Create exchanger", { collectionId });

    const validated = validateFormSchema(addExchangerSchema, raw);
    if (!validated.ok) return { ok: false, errors: validated.errors };

    const { name, link, has, needs } = validated.data;

    logger.info("Creating exchanger with params", { collectionId, name });

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
    logger.info("Exchanger created successfully", { collectionId });
    return { ok: true };
  } catch (cause) {
    const errorMessage = cause instanceof Error ? cause.message : String(cause);
    logger.error("Failed to create exchanger with error", {
      collectionId,
      error: errorMessage,
    });
    return { ok: false, errors: { _: "Failed to create exchanger" } };
  }
}

export async function updateExchanger(
  collectionId: string,
  exchangerId: string,
  raw: unknown,
): Promise<Result> {
  try {
    logger.info("Update exchanger", { collectionId, exchangerId });

    const validated = validateFormSchema(addExchangerSchema, raw);
    if (!validated.ok) return { ok: false, errors: validated.errors };

    const { name, link, has, needs } = validated.data;

    logger.info("Updating exchanger with params", { collectionId, exchangerId, name });

    await db.exchangers.update({
      where: { id: exchangerId, collectionId },
      data: {
        name,
        link,
        has: parseCommaSeparatedNumbers(has ?? ""),
        needs: parseCommaSeparatedNumbers(needs ?? ""),
      },
    });

    revalidatePath(`/collections/${collectionId}`);
    logger.info("Exchanger updated successfully", { collectionId, exchangerId });
    return { ok: true };
  } catch (cause) {
    const errorMessage = cause instanceof Error ? cause.message : String(cause);
    logger.error("Failed to update exchanger with error", {
      collectionId,
      exchangerId,
      error: errorMessage,
    });
    return { ok: false, errors: { _: "Failed to update exchanger" } };
  }
}

export async function deleteExchanger(collectionId: string, exchangerId: string): Promise<Result> {
  try {
    logger.info("Delete exchanger", { collectionId, exchangerId });

    await db.exchangers.update({
      where: { id: exchangerId, collectionId },
      data: { deletedAt: new Date() },
    });
    revalidatePath(`/collections/${collectionId}`);
    logger.info("Exchanger deleted successfully", { collectionId, exchangerId });
    return { ok: true };
  } catch (cause) {
    const errorMessage = cause instanceof Error ? cause.message : String(cause);
    logger.error("Failed to delete exchanger with error", {
      collectionId,
      exchangerId,
      error: errorMessage,
    });
    return { ok: false, errors: { _: "Failed to delete exchanger" } };
  }
}
