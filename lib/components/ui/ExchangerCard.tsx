import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Exchangers } from "@/generated/prisma/client";
import { formatDate } from "@/lib/utils/date";
import { cn } from "@/lib/components/utils";

type ExchangerCardProps = {
  exchanger: Exchangers;
};

export function ExchangerCard({ exchanger }: ExchangerCardProps) {
  const first = exchanger.has.length;
  const second = exchanger.needs.length;
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-card-foreground transition-colors hover:bg-muted/50">
      <div className="flex items-center justify-between gap-2">
        <h2 className="min-w-0 font-medium text-foreground">{exchanger.name}</h2>
        <Link
          href={exchanger.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${exchanger.name} link in new tab`}
          className={cn(
            "shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors",
            "hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          <ExternalLink className="size-4" aria-hidden />
        </Link>
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
