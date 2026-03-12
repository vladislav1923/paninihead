import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionStatus } from "@/generated/prisma/enums";
import { db } from "@/lib/db";
import { CollectedForm } from "@/lib/components/forms/CollectedForm";
import { Badge } from "@/lib/components/ui/badge";
import { ExchangerCard } from "@/lib/components/ui/ExchangerCard";

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
            <CollectedForm
              collectionId={collection.id}
              total={collection.total}
              initialCollected={collection.collected}
            />
          </section>

          <section className="min-w-0">
            <h2 className="mb-4 text-sm font-medium text-foreground">
              Exchangers
            </h2>
            <ul className="flex flex-col gap-4">
              {collection.exchangers.map((exchanger) => (
                <li key={exchanger.id}>
                  <ExchangerCard exchanger={exchanger} />
                </li>
              ))}
            </ul>
            {collection.exchangers.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No exchangers yet.
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
