"use client";

import { useCallback, useState } from "react";
import { Dialog } from "@/lib/components/ui/Dialog";
import { AddExchangerForm } from "@/lib/components/forms/AddExchangerForm";

type AddExchangerDialogProps = {
  collectionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddExchangerDialog({
  collectionId,
  open,
  onOpenChange,
}: AddExchangerDialogProps) {
  const handleSuccess = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add Exchanger"
    >
      <AddExchangerForm
        collectionId={collectionId}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </Dialog>
  );
}
