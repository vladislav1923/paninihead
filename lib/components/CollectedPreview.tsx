"use client";

import { useState } from "react";
import { cn } from "@/lib/components/utils";
import { Button } from "@/lib/components/ui/button";
import { Dialog } from "@/lib/components/ui/Dialog";
import { CollectedForm } from "@/lib/components/forms/CollectedForm";

type CollectedPreviewProps = {
  collectionId: string;
  collected: number[];
  total: number;
};

export function CollectedPreview({
  collectionId,
  collected,
  total,
}: CollectedPreviewProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  if (total < 1) return null;

  const numbers = Array.from({ length: total }, (_, i) => i + 1);
  const collectedSet = new Set(collected);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {collected.length} / {total} collected
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="bg-black !text-white hover:bg-black/90 dark:bg-black dark:!text-white dark:hover:bg-black/90"
          onClick={() => setDialogOpen(true)}
        >
          Add Stickers
        </Button>
      </div>
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(calc(1.25rem + 2px), 1fr))",
        }}
      >
        {numbers.map((n) => (
          <div
            key={n}
            className={cn(
              "flex aspect-square min-w-0 items-center justify-center text-[10px] font-medium tabular-nums",
              collectedSet.has(n)
                ? "bg-green-500/20 text-green-700 dark:bg-green-500/30 dark:text-green-300"
                : "bg-muted/60 text-muted-foreground"
            )}
          >
            {n}
          </div>
        ))}
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Add Stickers"
        fullScreen
      >
        <CollectedForm
          collectionId={collectionId}
          total={total}
          initialCollected={collected}
        />
      </Dialog>
    </div>
  );
}
