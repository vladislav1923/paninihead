"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { revertDeal } from "@/lib/actions/deals";
import { Button } from "@/lib/components/ui/button";
import { Dialog } from "@/lib/components/ui/Dialog";

type RevertDealDialogProps = {
  collectionId: string;
  dealId: string;
  exchangerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function RevertDealDialog({
  collectionId,
  dealId,
  exchangerName,
  open,
  onOpenChange,
  onSuccess,
}: RevertDealDialogProps) {
  const [isReverting, setIsReverting] = useState(false);

  const handleConfirm = useCallback(async () => {
    setIsReverting(true);
    try {
      const result = await revertDeal(collectionId, dealId);
      if (result.ok) {
        toast.success(`Deal with ${exchangerName} reverted successfully.`);
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(result.errors?._ ?? "Failed to revert. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsReverting(false);
    }
  }, [collectionId, dealId, onOpenChange, onSuccess]);

  const handleCancel = useCallback(() => {
    if (!isReverting) onOpenChange(false);
  }, [isReverting, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleCancel} title="Revert deal">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to revert the deal with{" "}
          <strong className="text-foreground">{exchangerName}</strong>? Outs will be returned to
          your collection and ins will be removed.
        </p>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isReverting}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isReverting}
          >
            {isReverting ? "Reverting…" : "Revert"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
