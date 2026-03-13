"use client";

import { useCallback, useMemo } from "react";
import { Dialog } from "@/lib/components/ui/Dialog";
import { MakeDealForm } from "@/lib/components/forms/MakeDealForm";

function countBy(arr: number[]): Map<number, number> {
  const m = new Map<number, number>();
  for (const n of arr) m.set(n, (m.get(n) ?? 0) + 1);
  return m;
}

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
    const collectedCounts = countBy(collected);
    const needCounts = countBy(exchanger.needs);
    const inNumbers = exchanger.has.join(", ");
    const outList: number[] = [];
    for (const [n, needCount] of needCounts) {
      const ourCount = collectedCounts.get(n) ?? 0;
      const give = Math.min(ourCount, needCount);
      for (let i = 0; i < give; i++) outList.push(n);
    }
    const outNumbers = outList.join(", ");
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
