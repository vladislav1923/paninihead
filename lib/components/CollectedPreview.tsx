import { cn } from "@/lib/components/utils";

type CollectedPreviewProps = {
  collected: number[];
  total: number;
};

export function CollectedPreview({ collected, total }: CollectedPreviewProps) {
  if (total < 1) return null;

  const numbers = Array.from({ length: total }, (_, i) => i + 1);
  const collectedSet = new Set(collected);

  return (
    <div className="mb-4">
      <p className="mb-2 text-sm text-muted-foreground">
        {collected.length} / {total} collected
      </p>
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
    </div>
  );
}
