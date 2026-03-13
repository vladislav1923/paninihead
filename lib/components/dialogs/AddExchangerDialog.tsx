"use client";

import { useCallback } from "react";
import { AddExchangerForm } from "@/lib/components/forms/AddExchangerForm";
import { Dialog } from "@/lib/components/ui/Dialog";
import type { AddExchangerFormValues } from "@/lib/schemas/exchanger";

type ExchangerForEdit = {
  id: string;
  name: string;
  link: string;
  has: number[];
  needs: number[];
};

type AddExchangerDialogProps = {
  collectionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exchanger?: ExchangerForEdit | null;
  onSuccess?: () => void;
};

export function AddExchangerDialog({
  collectionId,
  open,
  onOpenChange,
  exchanger,
  onSuccess,
}: AddExchangerDialogProps) {
  const handleSuccess = useCallback(() => {
    onOpenChange(false);
    onSuccess?.();
  }, [onOpenChange, onSuccess]);

  const handleCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const defaultValues: Partial<AddExchangerFormValues> | undefined = exchanger
    ? {
        name: exchanger.name,
        link: exchanger.link,
        has: exchanger.has.length > 0 ? exchanger.has.join(", ") : "",
        needs: exchanger.needs.length > 0 ? exchanger.needs.join(", ") : "",
      }
    : undefined;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={exchanger ? "Edit Exchanger" : "Add Exchanger"}
    >
      <AddExchangerForm
        collectionId={collectionId}
        exchangerId={exchanger?.id}
        defaultValues={defaultValues}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </Dialog>
  );
}
