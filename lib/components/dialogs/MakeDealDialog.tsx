"use client";

import { useCallback, useMemo } from "react";
import { MakeDealForm } from "@/lib/components/forms/MakeDealForm";
import { Dialog } from "@/lib/components/ui/Dialog";
import { getInNumbers, getOutNumbers } from "@/lib/utilities/collected";

type ExchangerForDeal = {
  id: string;
  name: string;
  has: number[];
  needs: number[];
};

type MakeDealDialogProps = {
  collectionId: string;
  exchanger: ExchangerForDeal | null;
  collected: number[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function MakeDealDialog({
  collectionId,
  exchanger,
  collected,
  open,
  onOpenChange,
  onSuccess,
}: MakeDealDialogProps) {
  const handleSuccess = useCallback(() => {
    onOpenChange(false);
    onSuccess?.();
  }, [onOpenChange, onSuccess]);

  const handleCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const { defaultIn, defaultOut } = useMemo(() => {
    if (!exchanger) return { defaultIn: "", defaultOut: "" };
    const inNumbers = getInNumbers(exchanger.has, collected).join(", ");
    const outNumbers = getOutNumbers(exchanger.needs, collected).join(", ");
    return { defaultIn: inNumbers, defaultOut: outNumbers };
  }, [exchanger, collected]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={exchanger ? `Make a Deal with ${exchanger.name}` : "Make a Deal"}
    >
      {exchanger && (
        <MakeDealForm
          collectionId={collectionId}
          exchangerId={exchanger.id}
          defaultIn={defaultIn}
          defaultOut={defaultOut}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}
    </Dialog>
  );
}
