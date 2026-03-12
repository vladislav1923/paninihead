import Link from "next/link";
import { CollectionStatus } from "@/generated/prisma/enums";
import { formatDate } from "@/lib/utils/date";
import { Badge } from "@/lib/components/ui/badge";

type CollectionCardProps = {
  collection: {
    id: string;
    name: string;
    imageUrl: string | null;
    status: (typeof CollectionStatus)[keyof typeof CollectionStatus];
    createdAt: Date;
  };
};

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link
      href={`/collections/${collection.id}`}
      className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted/50"
    >
      <div className="size-16 shrink-0 overflow-hidden rounded-md bg-muted">
        {collection.imageUrl ? (
          <img
            src={collection.imageUrl}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <div
            className="flex size-full items-center justify-center text-muted-foreground"
            aria-hidden
          >
            <span className="text-xs">No image</span>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-medium text-foreground">{collection.name}</h2>
          <Badge
            text={
              collection.status === CollectionStatus.Completed
                ? "COMPLETED"
                : "IN PROGRESS"
            }
            variant={
              collection.status === CollectionStatus.Completed
                ? "green"
                : "orange"
            }
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {formatDate(collection.createdAt)}
        </p>
      </div>
    </Link>
  );
}
