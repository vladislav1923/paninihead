"use client";

import { ExternalLink, Handshake, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { Exchangers as ExchangersModel } from "@/generated/prisma/client";
import { AddExchangerDialog } from "@/lib/components/dialogs/AddExchangerDialog";
import { DeleteExchangerDialog } from "@/lib/components/dialogs/DeleteExchangerDialog";
import { MakeDealDialog } from "@/lib/components/dialogs/MakeDealDialog";
import { Button } from "@/lib/components/ui/Button";
import { Card } from "@/lib/components/ui/Card";
import { formatDate } from "@/lib/utilities/date";
import { getInNumbers, getOutNumbers } from "@/lib/utilities/exchanger";
import { cn } from "@/lib/utilities/styles";

type SerializedExchanger = Omit<ExchangersModel, "createdAt"> & {
  createdAt: Date | string;
};

function getInAndOutNumbers(
  exchanger: Pick<ExchangersModel, "has" | "needs">,
  collected: number[],
) {
  return {
    inNumbers: getInNumbers(exchanger.has, collected),
    outNumbers: getOutNumbers(exchanger.needs, collected),
  };
}

type ExchangersSectionProps = {
  collectionId: string;
  exchangers: SerializedExchanger[];
  collected: number[];
};

export function ExchangersSection({ collectionId, exchangers, collected }: ExchangersSectionProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExchanger, setEditingExchanger] = useState<ExchangersModel | null>(null);
  const [exchangerToDelete, setExchangerToDelete] = useState<ExchangersModel | null>(null);
  const [exchangerForDeal, setExchangerForDeal] = useState<ExchangersModel | null>(null);

  const handleDialogOpenChange = useCallback((open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditingExchanger(null);
  }, []);

  const handleDeleteDialogOpenChange = useCallback((open: boolean) => {
    if (!open) setExchangerToDelete(null);
  }, []);

  const handleEdit = useCallback((exchanger: ExchangersModel) => {
    setEditingExchanger(exchanger);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback((exchanger: ExchangersModel) => {
    setExchangerToDelete(exchanger);
  }, []);

  const handleMakeDeal = useCallback((exchanger: ExchangersModel) => {
    setExchangerForDeal(exchanger);
  }, []);

  const handleDealDialogOpenChange = useCallback((open: boolean) => {
    if (!open) setExchangerForDeal(null);
  }, []);

  return (
    <section className="min-w-0">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-sm font-medium text-foreground">Exchangers</h2>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            setEditingExchanger(null);
            setDialogOpen(true);
          }}
        >
          Add Exchanger
        </Button>
      </div>
      <AddExchangerDialog
        collectionId={collectionId}
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        exchanger={editingExchanger}
        onSuccess={() => router.refresh()}
      />
      <DeleteExchangerDialog
        collectionId={collectionId}
        exchangerId={exchangerToDelete?.id ?? ""}
        exchangerName={exchangerToDelete?.name ?? ""}
        open={!!exchangerToDelete}
        onOpenChange={handleDeleteDialogOpenChange}
        onSuccess={() => router.refresh()}
      />
      <MakeDealDialog
        collectionId={collectionId}
        exchanger={exchangerForDeal}
        collected={collected}
        open={!!exchangerForDeal}
        onOpenChange={handleDealDialogOpenChange}
        onSuccess={() => router.refresh()}
      />
      <ul className="flex flex-col gap-4">
        {exchangers.map(exchanger => {
          const exchangerWithDate = {
            ...exchanger,
            createdAt:
              exchanger.createdAt instanceof Date
                ? exchanger.createdAt
                : new Date(exchanger.createdAt),
          };
          const { inNumbers, outNumbers } = getInAndOutNumbers(exchangerWithDate, collected);
          return (
            <li key={exchanger.id}>
              <Card
                name={exchanger.name}
                date={`Created ${formatDate(exchangerWithDate.createdAt)}`}
                ins={inNumbers}
                outs={outNumbers}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-green-600 dark:text-green-400 hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400"
                  onClick={() => handleMakeDeal(exchangerWithDate)}
                  aria-label={`Make deal with ${exchanger.name}`}
                >
                  <Handshake className="size-4" aria-hidden />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-foreground"
                  onClick={() => handleEdit(exchangerWithDate)}
                  aria-label={`Edit ${exchanger.name}`}
                >
                  <Pencil className="size-4" aria-hidden />
                </Button>
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
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleDelete(exchangerWithDate)}
                  aria-label={`Delete ${exchanger.name}`}
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </Card>
            </li>
          );
        })}
      </ul>
      {exchangers.length === 0 && (
        <p className="text-sm text-muted-foreground">No exchangers yet.</p>
      )}
    </section>
  );
}
