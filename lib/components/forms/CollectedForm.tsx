"use client";

import { useCallback, useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { updateCollected } from "@/lib/actions/collections";
import { Button } from "@/lib/components/ui/button";
import { cn } from "@/lib/components/utils";

type CollectedFormProps = {
  collectionId: string;
  total: number;
  initialCollected: number[];
};

function collectedToCounts(arr: number[]): Map<number, number> {
  const m = new Map<number, number>();
  for (const n of arr) {
    m.set(n, (m.get(n) ?? 0) + 1);
  }
  return m;
}

function countsToCollected(counts: Map<number, number>, total: number): number[] {
  const arr: number[] = [];
  for (let n = 1; n <= total; n++) {
    const c = counts.get(n) ?? 0;
    for (let i = 0; i < c; i++) arr.push(n);
  }
  return arr;
}

export function CollectedForm({
  collectionId,
  total,
  initialCollected,
}: CollectedFormProps) {
  const initialCounts = useMemo(
    () => collectedToCounts(initialCollected),
    [initialCollected]
  );

  const [counts, setCounts] = useState<Map<number, number>>(() => new Map(initialCounts));
  const [isSaving, setIsSaving] = useState(false);

  const increment = useCallback((n: number) => {
    setCounts((prev) => {
      const next = new Map(prev);
      next.set(n, (next.get(n) ?? 0) + 1);
      return next;
    });
  }, []);

  const decrement = useCallback((n: number) => {
    setCounts((prev) => {
      const next = new Map(prev);
      const current = next.get(n) ?? 0;
      if (current <= 0) return prev;
      if (current === 1) next.delete(n);
      else next.set(n, current - 1);
      return next;
    });
  }, []);

  const collected = useMemo(
    () => countsToCollected(counts, total),
    [counts, total]
  );

  const hasChanges = useMemo(() => {
    if (initialCounts.size !== counts.size) return true;
    for (const [n, c] of counts) {
      if ((initialCounts.get(n) ?? 0) !== c) return true;
    }
    for (const [n, c] of initialCounts) {
      if ((counts.get(n) ?? 0) !== c) return true;
    }
    return false;
  }, [initialCounts, counts]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await updateCollected(collectionId, collected, total);
    } finally {
      setIsSaving(false);
    }
  }, [collectionId, collected, total]);

  if (total < 1) return null;

  const numbers = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="min-h-0 overflow-auto">
        <div
          className="grid gap-1.5"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(calc((1.5rem + 2px) * 2), 1fr))",
          }}
        >
          {numbers.map((n) => {
            const count = counts.get(n) ?? 0;
            const isCollected = count > 0;
            return (
              <div key={n} className="min-h-0 w-full min-w-0 [aspect-ratio:1]">
                <div
                  className={cn(
                    "relative h-full w-full min-h-0 min-w-0 overflow-hidden rounded-md p-0.5 tabular-nums",
                    isCollected
                      ? "bg-green-500/20 text-green-700 dark:bg-green-500/30 dark:text-green-300"
                      : "bg-muted/60 text-muted-foreground"
                  )}
                >
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold leading-none -translate-y-[5px]">
                  {n}
                </span>
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-0.5 p-0.5">
                  <button
                    type="button"
                    onClick={() => decrement(n)}
                    disabled={count <= 0}
                    aria-label={`Remove one of ${n}`}
                    className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded p-0 text-current hover:bg-black/10 disabled:opacity-40 dark:hover:bg-white/10"
                  >
                    <Minus className="size-2.5" aria-hidden />
                  </button>
                  <span className="min-w-0 shrink-0 text-center text-[8px] leading-none">
                    {count}
                  </span>
                  <button
                    type="button"
                    onClick={() => increment(n)}
                    aria-label={`Add one of ${n}`}
                    className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded p-0 text-current hover:bg-black/10 dark:hover:bg-white/10"
                  >
                    <Plus className="size-2.5" aria-hidden />
                  </button>
                </div>
              </div>
            </div>
            );
          })}
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
