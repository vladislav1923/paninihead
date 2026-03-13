"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { updateCollected } from "@/lib/actions/collections";
import { Button } from "@/lib/components/ui/button";
import { cn } from "@/lib/components/utils";

type CollectedFormProps = {
  collectionId: string;
  total: number;
  initialCollected: number[];
  onSaved?: () => void;
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

type CellProps = {
  n: number;
  count: number;
  onIncrement: (n: number) => void;
  onDecrement: (n: number) => void;
};

const Cell = memo(function Cell({ n, count, onIncrement, onDecrement }: CellProps) {
  const isCollected = count > 0;
  const greenLevel =
    count >= 3
      ? "bg-green-500/50 text-green-800 dark:bg-green-500/55 dark:text-green-200"
      : count >= 2
        ? "bg-green-500/35 text-green-700 dark:bg-green-500/45 dark:text-green-300"
        : count >= 1
          ? "bg-green-500/20 text-green-700 dark:bg-green-500/30 dark:text-green-300"
          : null;
  return (
    <div className="min-h-0 w-full min-w-0 [aspect-ratio:1]">
      <div
        className={cn(
          "relative h-full w-full min-h-0 min-w-0 overflow-hidden rounded-md p-0.5 tabular-nums",
          greenLevel ?? "bg-muted/60 text-muted-foreground"
        )}
      >
        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold leading-none -translate-y-[5px]">
          {n}
        </span>
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-0.5 p-0.5">
          <button
            type="button"
            onClick={() => onDecrement(n)}
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
            onClick={() => onIncrement(n)}
            aria-label={`Add one of ${n}`}
            className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded p-0 text-current hover:bg-black/10 dark:hover:bg-white/10"
          >
            <Plus className="size-2.5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
});

export function CollectedForm({
  collectionId,
  total,
  initialCollected,
  onSaved,
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

  const savePreviewLists = useMemo(() => {
    const adding: { n: number; delta: number }[] = [];
    const removing: { n: number; delta: number }[] = [];
    const allN = new Set([...initialCounts.keys(), ...counts.keys()]);
    for (const n of allN) {
      const init = initialCounts.get(n) ?? 0;
      const cur = counts.get(n) ?? 0;
      if (cur > init) adding.push({ n, delta: cur - init });
      if (cur < init) removing.push({ n, delta: init - cur });
    }
    adding.sort((a, b) => a.n - b.n);
    removing.sort((a, b) => a.n - b.n);
    return { adding, removing };
  }, [initialCounts, counts]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await updateCollected(collectionId, collected, total);
      onSaved?.();
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [collectionId, collected, total, onSaved]);

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
          {numbers.map((n) => (
            <Cell
              key={n}
              n={n}
              count={counts.get(n) ?? 0}
              onIncrement={increment}
              onDecrement={decrement}
            />
          ))}
        </div>
      </div>
      {hasChanges && (
        <div className="sticky bottom-0 mt-auto shrink-0 border-t border-border bg-background pt-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-1 text-sm text-muted-foreground">
              {savePreviewLists.adding.length > 0 && (
                <span className="shrink-0 text-green-600 dark:text-green-400">
                  Adding:{" "}
                  {savePreviewLists.adding
                    .map(({ n, delta }) => (delta > 1 ? `${n} (${delta})` : String(n)))
                    .join(", ")}
                </span>
              )}
              {savePreviewLists.removing.length > 0 && (
                <span className="shrink-0 text-red-600 dark:text-red-400">
                  Removing:{" "}
                  {savePreviewLists.removing
                    .map(({ n, delta }) => (delta > 1 ? `${n} (${delta})` : String(n)))
                    .join(", ")}
                </span>
              )}
            </div>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="shrink-0"
            >
              {isSaving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
