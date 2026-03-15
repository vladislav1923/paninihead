"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createExchanger, updateExchanger } from "@/lib/actions/exchangers";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import { cn } from "@/lib/utilities/styles";
import { type AddExchangerFormValues, addExchangerSchema } from "@/lib/schemas/exchanger";

const textareaClassName =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30";

function formatNumbersText(text: string): string {
  if (!text.trim()) return "";
  // 1. Remove content in parenthesis
  let s = text.replace(/\([^)]*\)/g, "");
  // 2. Remove all symbols that are not numbers, commas, or spaces
  s = s.replace(/[^0-9,\s]/g, "");
  // 3. Numbers divided by spaces → replace spaces with commas
  s = s.replace(/\s+/g, ",");
  // 4. Normalize: split by comma, trim, drop empty, join with single comma
  const parts = s.split(",").map((p) => p.trim()).filter((p) => p.length > 0);
  return parts.join(",");
}

const emptyDefaultValues: AddExchangerFormValues = {
  name: "",
  link: "",
  has: "",
  needs: "",
};

type AddExchangerFormProps = {
  collectionId: string;
  exchangerId?: string;
  defaultValues?: Partial<AddExchangerFormValues>;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function AddExchangerForm({
  collectionId,
  exchangerId,
  defaultValues: defaultValuesProp,
  onSuccess,
  onCancel,
}: AddExchangerFormProps) {
  const formDefaultValues: AddExchangerFormValues = {
    ...emptyDefaultValues,
    ...defaultValuesProp,
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    setError,
    setValue,
    getValues,
    reset,
  } = useForm<AddExchangerFormValues>({
    resolver: yupResolver(addExchangerSchema),
    defaultValues: formDefaultValues,
  });

  const onSubmit = async (data: AddExchangerFormValues) => {
    try {
      const result = exchangerId
        ? await updateExchanger(collectionId, exchangerId, data)
        : await createExchanger(collectionId, data);
      if (result.ok) {
        reset(formDefaultValues);
        onSuccess?.();
      } else {
        for (const [field, message] of Object.entries(result.errors)) {
          setError(field as keyof AddExchangerFormValues, { message });
        }
        toast.error("Request failed. Please fix the errors and try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
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
        {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
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
        {errors.link && <p className="mt-1 text-sm text-destructive">{errors.link.message}</p>}
      </div>

      <div>
        <Label htmlFor="add-exchanger-has">Has (comma-separated numbers)</Label>
        <div className="flex flex-col gap-2">
          <textarea
            id="add-exchanger-has"
            {...register("has")}
            rows={3}
            placeholder="e.g. 1, 2, 5"
            className={textareaClassName}
            aria-invalid={!!errors.has}
          />
          <Button
            type="button"
            variant="outline"
            className="w-fit"
            onClick={() => setValue("has", formatNumbersText(getValues("has") ?? ""))}
          >
            Format
          </Button>
        </div>
        {errors.has && <p className="mt-1 text-sm text-destructive">{errors.has.message}</p>}
      </div>

      <div>
        <Label htmlFor="add-exchanger-needs">Needs (comma-separated numbers)</Label>
        <div className="flex flex-col gap-2">
          <textarea
            id="add-exchanger-needs"
            {...register("needs")}
            rows={3}
            placeholder="e.g. 3, 4, 6"
            className={textareaClassName}
            aria-invalid={!!errors.needs}
          />
          <Button
            type="button"
            variant="outline"
            className="w-fit"
            onClick={() => setValue("needs", formatNumbersText(getValues("needs") ?? ""))}
          >
            Format
          </Button>
        </div>
        {errors.needs && <p className="mt-1 text-sm text-destructive">{errors.needs.message}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || (!!exchangerId && !isDirty)}>
          {isSubmitting ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}
