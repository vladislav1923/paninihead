"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { Exchangers } from "@/generated/prisma/client";
import { AddExchangerDialog } from "@/lib/components/dialogs/AddExchangerDialog";
import { ExchangerCard } from "@/lib/components/ui/ExchangerCard";
import { Button } from "@/lib/components/ui/button";

type SerializedExchanger = Omit<Exchangers, "createdAt"> & {
  createdAt: Date | string;
};

type ExchangersSectionProps = {
  collectionId: string;
  exchangers: SerializedExchanger[];
  collected: number[];
};

export function ExchangersSection({
  collectionId,
  exchangers,
  collected,
}: ExchangersSectionProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExchanger, setEditingExchanger] = useState<Exchangers | null>(
    null
  );

  const handleDialogOpenChange = useCallback((open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditingExchanger(null);
  }, []);

  const handleEdit = useCallback((exchanger: Exchangers) => {
    setEditingExchanger(exchanger);
    setDialogOpen(true);
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
      <ul className="flex flex-col gap-4">
        {exchangers.map((exchanger) => (
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
            />
          </li>
        ))}
      </ul>
      {exchangers.length === 0 && (
        <p className="text-sm text-muted-foreground">No exchangers yet.</p>
      )}
    </section>
  );
}
