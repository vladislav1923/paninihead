import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionStatus } from "@/generated/prisma/enums";
import { db } from "@/lib/db";
import { CollectedPreview } from "@/lib/components/CollectedPreview";
import { CollectedForm } from "@/lib/components/forms/CollectedForm";
import { Badge } from "@/lib/components/ui/badge";
import { ExchangersSection } from "@/app/collections/[id]/ExchangersSection";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const collection = await db.collections.findUnique({
    where: { id },
    include: {
      exchangers: { orderBy: { createdAt: "desc" } },
    },
  });

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

      <main className="mx-auto max-w-[1240px] px-6 py-8">
        <div className="mb-6 flex flex-wrap items-center gap-2">
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

        <div className="grid grid-cols-1 gap-8 min-[900px]:grid-cols-2">
          <section className="flex min-h-[60vh] min-w-0 flex-col min-[900px]:min-h-[calc(100vh-8rem)]">
            <CollectedPreview
              collected={collection.collected}
              total={collection.total}
            />
            <CollectedForm
              collectionId={collection.id}
              total={collection.total}
              initialCollected={collection.collected}
            />
          </section>

          <ExchangersSection
            collectionId={collection.id}
            exchangers={collection.exchangers}
          />
        </div>
      </main>
    </div>
  );
}
