"use client";

import { useCallback, useState } from "react";
import { updateCollected } from "@/lib/actions/collections";
import { Button } from "@/lib/components/ui/button";
import { RoundedButton } from "@/lib/components/ui/rounded-button";

type CollectedFormProps = {
  collectionId: string;
  total: number;
  initialCollected: number[];
};

export function CollectedForm({
  collectionId,
  total,
  initialCollected,
}: CollectedFormProps) {
  const [collected, setCollected] = useState<number[]>(
    () => [...initialCollected].sort((a, b) => a - b)
  );
  const [isSaving, setIsSaving] = useState(false);

  const toggle = useCallback((n: number) => {
    setCollected((prev) => {
      if (prev.includes(n)) {
        return prev.filter((x) => x !== n).sort((a, b) => a - b);
      }
      return [...prev, n].sort((a, b) => a - b);
    });
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await updateCollected(collectionId, collected, total);
    } finally {
      setIsSaving(false);
    }
  }, [collectionId, collected, total]);

  const initialSorted = [...initialCollected].sort((a, b) => a - b);
  const hasChanges =
    collected.length !== initialSorted.length ||
    collected.some((v, i) => v !== initialSorted[i]);

  if (total < 1) return null;

  const numbers = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="min-h-0 overflow-auto">
        <div className="grid grid-cols-8 gap-x-.5 gap-y-4 sm:grid-cols-10 md:grid-cols-12">
          {numbers.map((n) => (
            <RoundedButton
              key={n}
              pressed={collected.includes(n)}
              onClick={() => toggle(n)}
              aria-label={
                collected.includes(n)
                  ? `Sticker ${n} collected`
                  : `Sticker ${n} not collected`
              }
            >
              {n}
            </RoundedButton>
          ))}
        </div>
      </div>
      {hasChanges && (
        <div className="sticky bottom-0 mt-auto shrink-0 border-t border-border bg-background pt-4">
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-fit"
          >
            {isSaving ? "Saving…" : "Save"}
          </Button>
        </div>
      )}
    </div>
  );
}
