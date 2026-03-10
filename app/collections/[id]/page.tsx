import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

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
        <Card>
          <div className="aspect-video w-full bg-muted">
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
                No image
              </div>
            )}
          </div>
          <CardHeader>
            <CardTitle className="text-xl">{collection.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {collection.collected.length} / {collection.total} collected
            </p>
          </CardHeader>
        </Card>
      </main>
    </div>
  );
}
