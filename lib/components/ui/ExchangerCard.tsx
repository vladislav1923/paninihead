import type { Exchangers } from "@/generated/prisma/client";
import { formatDate } from "@/lib/utils/date";

type ExchangerCardProps = {
  exchanger: Exchangers;
};

export function ExchangerCard({ exchanger }: ExchangerCardProps) {
  const first = exchanger.has.length;
  const second = exchanger.needs.length;
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-card-foreground transition-colors hover:bg-muted/50">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-medium text-foreground">{exchanger.name}</h2>
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
