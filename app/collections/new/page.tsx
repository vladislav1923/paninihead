"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createCollection } from "@/lib/actions/collections";
import { createCollectionSchema } from "@/lib/schemas/collection";
import type { CreateCollectionFormInput } from "@/lib/schemas/collection";
import { CollectionForm } from "@/lib/components/forms/CollectionForm";
import { Button } from "@/lib/components/ui/button";

const defaultValues: CreateCollectionFormInput = {
  name: "",
  imageUrl: "",
  total: "",
};

export default function NewCollectionPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CreateCollectionFormInput>({
    resolver: yupResolver(createCollectionSchema) as Resolver<CreateCollectionFormInput>,
    defaultValues,
  });

  const onSubmit = async (data: CreateCollectionFormInput) => {
    const result = await createCollection(data);
    if (result && !result.ok) {
      for (const [field, message] of Object.entries(result.errors)) {
        setError(field as keyof CreateCollectionFormInput, { message });
      }
    }
  };

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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
          noValidate
        >
          <CollectionForm
            register={register}
            errors={errors}
            defaultValues={defaultValues}
          />
          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating…" : "Create collection"}
            </Button>
            <Button type="reset" variant="outline">
              Reset
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
