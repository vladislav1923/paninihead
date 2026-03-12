"use client";

import { useState } from "react";
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
};

export function ExchangersSection({
  collectionId,
  exchangers,
}: ExchangersSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <section className="min-w-0">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-sm font-medium text-foreground">Exchangers</h2>
        <Button
          type="button"
          size="sm"
          onClick={() => setDialogOpen(true)}
        >
          Add Exchanger
        </Button>
      </div>
      <AddExchangerDialog
        collectionId={collectionId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
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
