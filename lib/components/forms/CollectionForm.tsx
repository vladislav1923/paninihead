"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import {
  NAME_MAX,
  IMAGE_URL_MAX,
  TOTAL_MAX,
} from "@/lib/schemas/collection";
import type { CreateCollectionFormInput } from "@/lib/schemas/collection";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";

type CollectionFormProps = {
  register: UseFormRegister<CreateCollectionFormInput>;
  errors: FieldErrors<CreateCollectionFormInput>;
  defaultValues?: Partial<CreateCollectionFormInput>;
};

export function CollectionForm({
  register,
  errors,
  defaultValues,
}: CollectionFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          {...register("name")}
          maxLength={NAME_MAX}
          placeholder="Collection name"
          defaultValue={defaultValues?.name}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-destructive" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          type="url"
          {...register("imageUrl")}
          maxLength={IMAGE_URL_MAX}
          placeholder="https://..."
          defaultValue={defaultValues?.imageUrl}
          aria-invalid={!!errors.imageUrl}
          aria-describedby={errors.imageUrl ? "imageUrl-error" : undefined}
        />
        {errors.imageUrl && (
          <p
            id="imageUrl-error"
            className="text-sm text-destructive"
            role="alert"
          >
            {errors.imageUrl.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="total">
          Total <span className="text-destructive">*</span>
        </Label>
        <Input
          id="total"
          type="number"
          {...register("total")}
          min={1}
          max={TOTAL_MAX}
          step={1}
          placeholder="e.g. 500"
          defaultValue={defaultValues?.total}
          aria-invalid={!!errors.total}
          aria-describedby={errors.total ? "total-error" : undefined}
        />
        {errors.total && (
          <p id="total-error" className="text-sm text-destructive" role="alert">
            {errors.total.message}
          </p>
        )}
      </div>
    </div>
  );
}
