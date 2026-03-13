"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { Exchangers } from "@/generated/prisma/client";
import { AddExchangerDialog } from "@/lib/components/dialogs/AddExchangerDialog";
import { DeleteExchangerDialog } from "@/lib/components/dialogs/DeleteExchangerDialog";
import { MakeDealDialog } from "@/lib/components/dialogs/MakeDealDialog";
import { Button } from "@/lib/components/ui/button";
import { ExchangerCard } from "@/lib/components/ui/ExchangerCard";
import { formatDate } from "@/lib/utilities/date";

type SerializedExchanger = Omit<Exchangers, "createdAt"> & {
  createdAt: Date | string;
};

type DealWithExchanger = {
  id: string;
  exchangerId: string;
  inNumbers: number[];
  outNumbers: number[];
  createdAt: Date | string;
  exchanger: { name: string };
};

type ExchangersSectionProps = {
  collectionId: string;
  exchangers: SerializedExchanger[];
  collected: number[];
  deals: DealWithExchanger[];
};

export function ExchangersSection({
  collectionId,
  exchangers,
  collected,
  deals,
}: ExchangersSectionProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExchanger, setEditingExchanger] = useState<Exchangers | null>(null);
  const [exchangerToDelete, setExchangerToDelete] = useState<Exchangers | null>(null);
  const [exchangerForDeal, setExchangerForDeal] = useState<Exchangers | null>(null);

  const handleDialogOpenChange = useCallback((open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditingExchanger(null);
  }, []);

  const handleDeleteDialogOpenChange = useCallback((open: boolean) => {
    if (!open) setExchangerToDelete(null);
  }, []);

  const handleEdit = useCallback((exchanger: Exchangers) => {
    setEditingExchanger(exchanger);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback((exchanger: Exchangers) => {
    setExchangerToDelete(exchanger);
  }, []);

  const handleMakeDeal = useCallback((exchanger: Exchangers) => {
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
        {exchangers.map(exchanger => (
          <li key={exchanger.id}>
            <ExchangerCard
              exchanger={{
                ...exchanger,
                createdAt:
                  exchanger.createdAt instanceof Date
                    ? exchanger.createdAt
                    : new Date(exchanger.createdAt),
              }}
              collected={collected}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMakeDeal={handleMakeDeal}
            />
          </li>
        ))}
      </ul>
      {exchangers.length === 0 && (
        <p className="text-sm text-muted-foreground">No exchangers yet.</p>
      )}

      {deals.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 text-sm font-medium text-foreground">Deals</h3>
          <ul className="flex flex-col gap-2">
            {deals.map(deal => (
              <li
                key={deal.id}
                className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground"
              >
                <span className="font-medium">{deal.exchanger.name}</span>
                <span className="text-muted-foreground">
                  {" "}
                  — In: {deal.inNumbers.join(", ")} → Out: {deal.outNumbers.join(", ")}
                </span>
                <span className="ml-2 text-muted-foreground">
                  {formatDate(
                    deal.createdAt instanceof Date ? deal.createdAt : new Date(deal.createdAt),
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
