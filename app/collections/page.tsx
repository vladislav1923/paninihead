import Link from "next/link";
import { CollectionStatus } from "@/app/generated/prisma/enums";
import { db } from "@/lib/db";
import { Badge } from "@/lib/components/ui/badge";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(date);
}

export default async function CollectionsPage() {
  const collections = await db.collections.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <h1 className="text-xl font-semibold text-foreground">Collections</h1>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <Link
            href="/collections/new"
            className="inline-flex h-8 items-center justify-center rounded-lg border border-transparent bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Create new collection
          </Link>
        </div>

        <ul className="flex flex-col gap-6">
          {collections.map((collection) => (
            <li key={collection.id}>
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
                    <h2 className="font-medium text-foreground">
                      {collection.name}
                    </h2>
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
            </li>
          ))}
        </ul>

        {collections.length === 0 && (
          <p className="text-muted-foreground">
            No collections yet. Create one to get started.
          </p>
        )}
      </main>
    </div>
  );
}
