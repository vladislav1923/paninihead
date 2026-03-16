import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utilities/styles";

type CardProps = {
  name: string;
  date: string;
  ins: number[];
  outs: number[];
  children?: React.ReactNode | null;
  className?: string;
};

export function Card({ name, date, ins, outs, children = null, className }: CardProps) {
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
        <span className="text-green-600 dark:text-green-400">{ins.length}</span>
        <span className="text-foreground/70"> / </span>
        <span className="text-red-600 dark:text-red-400">{outs.length}</span>
      </p>
      {ins.length > 0 && (
        <p className="inline-flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <ArrowRight
            size={12}
            className="shrink-0 text-green-600 dark:text-green-400"
            aria-hidden
          />
          {ins.join(", ")}
        </p>
      )}
      {outs.length > 0 && (
        <p className="inline-flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <ArrowLeft size={12} className="shrink-0 text-red-600 dark:text-red-400" aria-hidden />
          {outs.join(", ")}
        </p>
      )}
    </div>
  );
}
