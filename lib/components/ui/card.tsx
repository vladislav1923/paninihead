"use client";

import { ArrowLeft, ArrowRight, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/lib/components/ui/button";
import { cn } from "@/lib/utilities/styles";

type CardProps = {
  name: string;
  date: string;
  ins: number[];
  outs: number[];
  children?: React.ReactNode | null;
  className?: string;
};

async function copyNumbers(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  } catch {
    toast.error("Could not copy");
  }
}

export function Card({ name, date, ins, outs, children = null, className }: CardProps) {
  const sortedIns = [...ins].sort((a, b) => a - b);
  const sortedOuts = [...outs].sort((a, b) => a - b);

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground ",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="min-w-0 font-medium text-foreground">{name}</span>
        {children != null ? (
          <div className="flex shrink-0 items-center gap-0.5">{children}</div>
        ) : null}
      </div>
      <span className="text-muted-foreground">{date}</span>
      <p className="text-sm">
        <span className="text-green-600 dark:text-green-400">{sortedIns.length}</span>
        <span className="text-foreground/70"> / </span>
        <span className="text-red-600 dark:text-red-400">{sortedOuts.length}</span>
      </p>
      {sortedIns.length > 0 && (
        <p className="flex items-start gap-x-1 text-s leading-[24px] text-muted-foreground">
          <ArrowRight
            size={16}
            className="shrink-0 text-green-600 dark:text-green-400 mt-[4px]"
            aria-hidden
          />
          <span className="min-w-0 flex-nowrap items-baseline gap-1">
            <span>{sortedIns.join(", ")}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Copy incoming numbers"
              onClick={() => void copyNumbers(sortedIns.join(", "))}
            >
              <Copy className="size-3" aria-hidden />
            </Button>
          </span>
        </p>
      )}
      {sortedOuts.length > 0 && (
        <p className="flex items-start gap-x-1 text-s leading-[24px] text-muted-foreground">
          <ArrowLeft
            size={16}
            className="shrink-0 text-red-600 dark:text-red-400 mt-[4px]"
            aria-hidden
          />
          <span className="min-w-0 flex-nowrap items-baseline gap-1">
            <span>{sortedOuts.join(", ")}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Copy outgoing numbers"
              onClick={() => void copyNumbers(sortedOuts.join(", "))}
            >
              <Copy className="size-3" aria-hidden />
            </Button>
          </span>
        </p>
      )}
    </div>
  );
}
