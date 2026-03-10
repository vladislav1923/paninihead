"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createCollectionSchema } from "@/lib/schemas/collection";
import { validateFormSchema } from "@/lib/utilities/validation";

export type CreateCollectionState = {
  errors?: {
    name?: string;
    imageUrl?: string;
    total?: string;
  };
  /** Submitted values when validation fails, so the form can re-display them */
  values?: {
    name: string;
    imageUrl: string;
    total: string;
  };
};

function formDataToValues(formData: FormData) {
  const totalRaw = formData.get("total");
  return {
    name: (formData.get("name") as string) ?? "",
    imageUrl: (formData.get("imageUrl") as string) ?? "",
    total:
      totalRaw === "" || totalRaw === null ? undefined : Number(totalRaw),
  };
}

export async function createCollection(
  _prev: CreateCollectionState,
  formData: FormData
): Promise<CreateCollectionState> {
  const raw = formDataToValues(formData);

  const result = validateFormSchema(createCollectionSchema, raw);
  if (!result.ok) {
    return {
      errors: result.errors,
      values: {
        name: raw.name,
        imageUrl: raw.imageUrl,
        total: raw.total !== undefined && raw.total !== null ? String(raw.total) : "",
      },
    };
  }
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
