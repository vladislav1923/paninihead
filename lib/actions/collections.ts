"use server";

import { redirect } from "next/navigation";
import { CollectionStatus } from "@/generated/prisma/enums";
import { createCollectionSchema } from "@/lib/schemas/collection";
import { db } from "@/lib/utilities/db";
import { validateFormSchema } from "@/lib/utilities/validation";

export type CreateCollectionResult = { ok: true } | { ok: false; errors: Record<string, string> };

export async function createCollection(raw: unknown): Promise<CreateCollectionResult> {
  const result = validateFormSchema(createCollectionSchema, raw);
  if (!result.ok) return { ok: false, errors: result.errors };

  const data = result.data;

  await db.collections.create({
    data: {
      name: data.name.trim(),
      imageUrl: data.imageUrl?.trim() || null,
      total: data.total,
      collected: [],
    },
  });

  redirect("/collections");
}

export async function updateCollected(collectionId: string, collected: number[], total: number) {
  const isCompleted = collected.length === total;
  await db.collections.update({
    where: { id: collectionId },
    data: {
      collected,
      status: isCompleted ? CollectionStatus.Completed : CollectionStatus.InProgress,
      completedAt: isCompleted ? new Date() : null,
    },
  });
}
