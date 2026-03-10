"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createCollection, type CreateCollectionState } from "@/lib/actions/collections";
import { CollectionForm } from "@/lib/components/forms/CollectionForm";
import { Button } from "@/lib/components/ui/button";

const initialState: CreateCollectionState = {};

export default function NewCollectionPage() {
  const [state, formAction] = useActionState(createCollection, initialState);
  const errors = state?.errors ?? {};

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
        <h1 className="mb-6 text-xl font-semibold text-foreground">
          New collection
        </h1>
        <form action={formAction} className="flex flex-col gap-6">
          <CollectionForm errors={errors} />
          <div className="flex gap-3">
            <Button type="submit">Create collection</Button>
            <Button type="reset" variant="outline">
              Reset
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
