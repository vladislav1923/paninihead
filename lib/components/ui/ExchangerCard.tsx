import Link from "next/link";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import type { Exchangers } from "@/generated/prisma/client";
import { formatDate } from "@/lib/utils/date";
import { Button } from "@/lib/components/ui/button";
import { cn } from "@/lib/components/utils";

type ExchangerCardProps = {
  exchanger: Exchangers;
  collected: number[];
  onEdit?: (exchanger: Exchangers) => void;
  onDelete?: (exchanger: Exchangers) => void;
};

function countBy(arr: number[]): Map<number, number> {
  const m = new Map<number, number>();
  for (const n of arr) m.set(n, (m.get(n) ?? 0) + 1);
  return m;
}

export function ExchangerCard({ exchanger, collected, onEdit, onDelete }: ExchangerCardProps) {
  const collectedSet = new Set(collected);
  const collectedCounts = countBy(collected);
  const first = exchanger.has.filter((n) => !collectedSet.has(n)).length;
  const second = exchanger.needs.filter(
    (n) => (collectedCounts.get(n) ?? 0) > 1
  ).length;
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-card-foreground transition-colors hover:bg-muted/50">
      <div className="flex items-center justify-between gap-2">
        <h2 className="min-w-0 font-medium text-foreground">{exchanger.name}</h2>
        <div className="flex shrink-0 items-center gap-0.5">
          {onEdit && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(exchanger)}
              aria-label={`Edit ${exchanger.name}`}
            >
              <Pencil className="size-4" aria-hidden />
            </Button>
          )}
          <Link
            href={exchanger.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${exchanger.name} link in new tab`}
            className={cn(
              "rounded-lg p-1.5 text-muted-foreground transition-colors",
              "hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <ExternalLink className="size-4" aria-hidden />
          </Link>
          {onDelete && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onDelete(exchanger)}
              aria-label={`Delete ${exchanger.name}`}
            >
              <Trash2 className="size-4" aria-hidden />
            </Button>
          )}
        </div>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {formatDate(exchanger.createdAt)}
      </p>
      <p className="mt-2 text-sm">
        <span className="text-green-600 dark:text-green-400">{first}</span>
        <span className="text-foreground/70"> / </span>
        <span className="text-orange-600 dark:text-orange-400">{second}</span>
      </p>
    </div>
  );
}
