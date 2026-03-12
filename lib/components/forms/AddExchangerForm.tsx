"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createExchanger } from "@/lib/actions/exchangers";
import { addExchangerSchema, type AddExchangerFormValues } from "@/lib/schemas/exchanger";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import { cn } from "@/lib/components/utils";

const textareaClassName =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30";

const defaultValues: AddExchangerFormValues = {
  name: "",
  link: "",
  has: "",
  needs: "",
};

type AddExchangerFormProps = {
  collectionId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function AddExchangerForm({
  collectionId,
  onSuccess,
  onCancel,
}: AddExchangerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<AddExchangerFormValues>({
    resolver: yupResolver(addExchangerSchema),
    defaultValues,
  });

  const onSubmit = async (data: AddExchangerFormValues) => {
    const result = await createExchanger(collectionId, data);
    if (result.ok) {
      reset(defaultValues);
      onSuccess?.();
    } else {
      for (const [field, message] of Object.entries(result.errors)) {
        setError(field as keyof AddExchangerFormValues, { message });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="add-exchanger-name">Name</Label>
        <Input
          id="add-exchanger-name"
          {...register("name")}
          maxLength={50}
          placeholder="Name"
          className={cn(errors.name && "border-destructive")}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="add-exchanger-link">Link</Label>
        <Input
          id="add-exchanger-link"
          type="url"
          {...register("link")}
          maxLength={300}
          placeholder="https://..."
          className={cn(errors.link && "border-destructive")}
          aria-invalid={!!errors.link}
        />
        {errors.link && (
          <p className="mt-1 text-sm text-destructive">{errors.link.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="add-exchanger-has">Has (comma-separated numbers)</Label>
        <textarea
          id="add-exchanger-has"
          {...register("has")}
          rows={3}
          placeholder="e.g. 1, 2, 5"
          className={textareaClassName}
          aria-invalid={!!errors.has}
        />
        {errors.has && (
          <p className="mt-1 text-sm text-destructive">{errors.has.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="add-exchanger-needs">
          Needs (comma-separated numbers)
        </Label>
        <textarea
          id="add-exchanger-needs"
          {...register("needs")}
          rows={3}
          placeholder="e.g. 3, 4, 6"
          className={textareaClassName}
          aria-invalid={!!errors.needs}
        />
        {errors.needs && (
          <p className="mt-1 text-sm text-destructive">{errors.needs.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}
