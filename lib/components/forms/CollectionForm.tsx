"use client";

import type { Collections } from "@/app/generated/prisma/client";
import {
  NAME_MAX,
  IMAGE_URL_MAX,
  TOTAL_MAX,
} from "@/lib/schemas/collection";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";

export type CollectionFormCollection = Pick<Collections, "name" | "imageUrl" | "total">;

/** Same shape as CollectionFormCollection but total may be string (e.g. from failed submit) */
export type CollectionFormValues = {
  name: string;
  imageUrl?: string | null;
  total: number | string;
};

export type CollectionFormErrors = {
  name?: string;
  imageUrl?: string;
  total?: string;
};

type CollectionFormProps = {
  errors?: CollectionFormErrors;
  collection?: CollectionFormValues | null;
};

export function CollectionForm({
  errors = {},
  collection,
}: CollectionFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          maxLength={NAME_MAX}
          placeholder="Collection name"
          defaultValue={collection?.name ?? ""}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-destructive" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          maxLength={IMAGE_URL_MAX}
          placeholder="https://..."
          defaultValue={collection?.imageUrl ?? ""}
          aria-invalid={!!errors.imageUrl}
          aria-describedby={errors.imageUrl ? "imageUrl-error" : undefined}
        />
        {errors.imageUrl && (
          <p
            id="imageUrl-error"
            className="text-sm text-destructive"
            role="alert"
          >
            {errors.imageUrl}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="total">
          Total <span className="text-destructive">*</span>
        </Label>
        <Input
          id="total"
          name="total"
          type="number"
          required
          min={1}
          max={TOTAL_MAX}
          step={1}
          placeholder="e.g. 500"
          defaultValue={collection?.total ?? ""}
          aria-invalid={!!errors.total}
          aria-describedby={errors.total ? "total-error" : undefined}
        />
        {errors.total && (
          <p id="total-error" className="text-sm text-destructive" role="alert">
            {errors.total}
          </p>
        )}
      </div>
    </div>
  );
}
