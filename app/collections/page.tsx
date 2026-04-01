import Link from "next/link";
import { redirect } from "next/navigation";
import { CollectionCard } from "@/lib/components/ui/CollectionCard";
import { getCurrentUserId } from "@/lib/utilities/auth";
import { db } from "@/lib/utilities/db";

export default async function CollectionsPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const collections = await db.collections.findMany({
    where: { userId },
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
          {collections.map(collection => (
            <li key={collection.id}>
              <CollectionCard collection={collection} />
            </li>
          ))}
        </ul>

        {collections.length === 0 && (
          <p className="text-muted-foreground">No collections yet. Create one to get started.</p>
        )}
      </main>
    </div>
  );
}
