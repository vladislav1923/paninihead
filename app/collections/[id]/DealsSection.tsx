"use client";

import { Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { DealStatus } from "@/generated/prisma/enums";
import { RevertDealDialog } from "@/lib/components/dialogs/RevertDealDialog";
import { Button } from "@/lib/components/ui/button";
import { Card } from "@/lib/components/ui/Card";
import { formatDate } from "@/lib/utilities/date";
import styles from "./DealsSection.module.css";

export type DealWithExchanger = {
  id: string;
  exchangerId: string;
  inNumbers: number[];
  outNumbers: number[];
  status: DealStatus;
  createdAt: Date | string;
  revertedAt: Date | string | null;
  exchanger: { name: string };
};

type DealsSectionProps = {
  collectionId: string;
  deals: DealWithExchanger[];
};

export function DealsSection({ collectionId, deals }: DealsSectionProps) {
  const router = useRouter();
  const [dealToRevert, setDealToRevert] = useState<DealWithExchanger | null>(null);

  const handleRevertDialogOpenChange = useCallback((open: boolean) => {
    if (!open) setDealToRevert(null);
  }, []);

  if (deals.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="mb-3 text-sm font-medium text-foreground">Deals</h3>
      <RevertDealDialog
        collectionId={collectionId}
        dealId={dealToRevert?.id ?? ""}
        exchangerName={dealToRevert?.exchanger.name ?? ""}
        open={!!dealToRevert}
        onOpenChange={handleRevertDialogOpenChange}
        onSuccess={() => router.refresh()}
      />
      <ul className="flex flex-col gap-2">
        {deals.map(deal => {
          const isReverted = deal.status === DealStatus.Reverted;
          return (
            <li key={deal.id} className={isReverted ? styles.revertedWrapper : undefined}>
              <Card
                name={deal.exchanger.name}
                date={
                  isReverted && deal.revertedAt
                    ? `Reverted ${formatDate(
                        deal.revertedAt instanceof Date
                          ? deal.revertedAt
                          : new Date(deal.revertedAt),
                      )}`
                    : `Created ${formatDate(
                        deal.createdAt instanceof Date ? deal.createdAt : new Date(deal.createdAt),
                      )}`
                }
                ins={deal.inNumbers}
                outs={deal.outNumbers}
                className={isReverted ? styles.revertedCard : undefined}
              >
                {!isReverted && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setDealToRevert(deal)}
                    aria-label={`Revert deal with ${deal.exchanger.name}`}
                  >
                    <Undo2 className="size-4" aria-hidden />
                  </Button>
                )}
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
