import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

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

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <li key={collection.id}>
              <Link href={`/collections/${collection.id}`} className="block">
                <Card className="overflow-hidden transition-shadow hover:shadow-md">
                  <div className="aspect-[4/3] w-full bg-muted">
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
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {collection.name}
                    </CardTitle>
                  </CardHeader>
                </Card>
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
