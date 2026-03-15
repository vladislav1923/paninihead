import { ArrowLeft, ArrowRight, ExternalLink, Handshake, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Exchangers } from "@/generated/prisma/client";
import { Button } from "@/lib/components/ui/button";
import { formatDate } from "@/lib/utilities/date";
import { cn } from "@/lib/utilities/styles";

type ExchangerCardProps = {
  exchanger: Exchangers;
  collected: number[];
  onEdit?: (exchanger: Exchangers) => void;
  onDelete?: (exchanger: Exchangers) => void;
  onMakeDeal?: (exchanger: Exchangers) => void;
};

function countBy(arr: number[]): Map<number, number> {
  const m = new Map<number, number>();
  for (const n of arr) m.set(n, (m.get(n) ?? 0) + 1);
  return m;
}

export function ExchangerCard({
  exchanger,
  collected,
  onEdit,
  onDelete,
  onMakeDeal,
}: ExchangerCardProps) {
  const collectedSet = new Set(collected);
  const collectedCounts = countBy(collected);
  const needCounts = countBy(exchanger.needs);
  const inNumbers = exchanger.has.filter(n => !collectedSet.has(n));
  const outNumbers: number[] = [];
  for (const [n, needCount] of needCounts) {
    const give = Math.min(collectedCounts.get(n) ?? 0, needCount);
    for (let i = 0; i < give; i++) outNumbers.push(n);
  }
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-card-foreground transition-colors hover:bg-muted/50">
      <div className="flex items-center justify-between gap-2">
        <h2 className="min-w-0 font-medium text-foreground">{exchanger.name}</h2>
        <div className="flex shrink-0 items-center gap-0.5">
          {onMakeDeal && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 text-green-600 dark:text-green-400 hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400"
              onClick={() => onMakeDeal(exchanger)}
              aria-label={`Make deal with ${exchanger.name}`}
            >
              <Handshake className="size-4" aria-hidden />
            </Button>
          )}
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
              "hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
        Created {formatDate(exchanger.createdAt)}
      </p>
      <p className="mt-2 text-sm">
        <span className="text-green-600 dark:text-green-400">{inNumbers.length ?? 0}</span>
        <span className="text-foreground/70"> / </span>
        <span className="text-orange-600 dark:text-orange-400">{outNumbers.length ?? 0}</span>
      </p>
      {inNumbers.length > 0 && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <ArrowLeft className="size-3.5 shrink-0 text-green-600 dark:text-green-400" aria-hidden />
          {inNumbers.join(", ")}
        </p>
      )}
      {outNumbers.length > 0 && (
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <ArrowRight
            className="size-3.5 shrink-0 text-orange-600 dark:text-orange-400"
            aria-hidden
          />
          {outNumbers.join(", ")}
        </p>
      )}
    </div>
  );
}
