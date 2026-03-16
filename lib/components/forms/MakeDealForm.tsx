"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createDeal } from "@/lib/actions/deals";
import { Button } from "@/lib/components/ui/Button";
import { Label } from "@/lib/components/ui/Label";
import type { DealFormValues } from "@/lib/schemas/deal";
import { dealFormSchema } from "@/lib/schemas/deal";

const textareaClassName =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30";

function formatNumbersText(text: string): string {
  if (!text.trim()) return "";
  let s = text.replace(/\([^)]*\)/g, "");
  s = s.replace(/[^0-9,]/g, "");
  const parts = s.split(",").filter(p => p.length > 0);
  return parts.join(",");
}

type MakeDealFormProps = {
  collectionId: string;
  exchangerId: string;
  defaultIn: string;
  defaultOut: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function MakeDealForm({
  collectionId,
  exchangerId,
  defaultIn,
  defaultOut,
  onSuccess,
  onCancel,
}: MakeDealFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    getValues,
  } = useForm<DealFormValues>({
    resolver: yupResolver(dealFormSchema),
    defaultValues: { in: defaultIn, out: defaultOut },
  });

  const inVal = watch("in") ?? "";
  const outVal = watch("out") ?? "";
  const canSave = inVal.trim().length > 0 && outVal.trim().length > 0;

  const onSubmit = async (data: DealFormValues) => {
    try {
      const result = await createDeal(collectionId, exchangerId, data);
      if (result.ok) {
        onSuccess?.();
      } else {
        for (const [field, message] of Object.entries(result.errors)) {
          if (message) setError(field as keyof DealFormValues, { message });
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
        <Label htmlFor="make-deal-in">In</Label>
        <div className="flex flex-col gap-2">
          <textarea
            id="make-deal-in"
            {...register("in")}
            rows={3}
            placeholder="e.g. 1, 2, 5"
            className={textareaClassName}
            aria-invalid={!!errors.in}
          />
          <Button
            type="button"
            variant="outline"
            className="w-fit"
            onClick={() => setValue("in", formatNumbersText(getValues("in") ?? ""))}
          >
            Format
          </Button>
        </div>
        {errors.in && <p className="mt-1 text-sm text-destructive">{errors.in.message}</p>}
      </div>

      <div>
        <Label htmlFor="make-deal-out">Out</Label>
        <div className="flex flex-col gap-2">
          <textarea
            id="make-deal-out"
            {...register("out")}
            rows={3}
            placeholder="e.g. 3, 4, 6"
            className={textareaClassName}
            aria-invalid={!!errors.out}
          />
          <Button
            type="button"
            variant="outline"
            className="w-fit"
            onClick={() => setValue("out", formatNumbersText(getValues("out") ?? ""))}
          >
            Format
          </Button>
        </div>
        {errors.out && <p className="mt-1 text-sm text-destructive">{errors.out.message}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || !canSave}>
          {isSubmitting ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}
