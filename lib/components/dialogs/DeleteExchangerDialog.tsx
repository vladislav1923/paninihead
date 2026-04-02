"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { deleteExchanger } from "@/lib/actions/exchangers";
import { Button } from "@/lib/components/ui/button";
import { Dialog } from "@/lib/components/ui/Dialog";

type DeleteExchangerDialogProps = {
  collectionId: string;
  exchangerId: string;
  exchangerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function DeleteExchangerDialog({
  collectionId,
  exchangerId,
  exchangerName,
  open,
  onOpenChange,
  onSuccess,
}: DeleteExchangerDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = useCallback(async () => {
    setIsDeleting(true);
    try {
      const result = await deleteExchanger(collectionId, exchangerId);
      if (result.ok) {
        toast.success(`Exchanger ${exchangerName} deleted successfully.`);
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error("Failed to delete. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }, [collectionId, exchangerId, exchangerName, onOpenChange, onSuccess]);

  const handleCancel = useCallback(() => {
    if (!isDeleting) onOpenChange(false);
  }, [isDeleting, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleCancel} title="Delete exchanger">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <strong className="text-foreground">{exchangerName}</strong>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
