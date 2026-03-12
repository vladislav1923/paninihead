import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionStatus } from "@/generated/prisma/enums";
import { db } from "@/lib/db";
import { CollectedForm } from "@/lib/components/forms/CollectedForm";
import { Badge } from "@/lib/components/ui/badge";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const collection = await db.collections.findUnique({ where: { id } });

  if (!collection) notFound();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <nav className="flex items-center gap-4">
          <Link
            href="/collections"
            className="inline-flex h-7 items-center justify-center rounded-lg px-2.5 text-[0.8rem] font-medium text-foreground transition-colors hover:bg-muted"
          >
            ← Back to collections
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-8">
        <div className="mb-8">
          <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg bg-muted">
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
                <span className="text-sm">No image</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold text-foreground">
              {collection.name}
            </h1>
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
        </div>

        <CollectedForm
          collectionId={collection.id}
          total={collection.total}
          initialCollected={collection.collected}
        />
      </main>
    </div>
  );
}
