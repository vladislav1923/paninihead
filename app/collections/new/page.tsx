"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createCollection } from "@/lib/actions/collections";
import { CollectionForm } from "@/lib/components/forms/CollectionForm";
import { Button } from "@/lib/components/ui/button";
import type { CreateCollectionFormInput } from "@/lib/schemas/collection";
import { createCollectionSchema } from "@/lib/schemas/collection";

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
    try {
      const result = await createCollection(data);
      if (result && !result.ok) {
        for (const [field, message] of Object.entries(result.errors)) {
          setError(field as keyof CreateCollectionFormInput, { message });
        }
        toast.error("Request failed. Please fix the errors and try again.");
      }
    } catch (err) {
      const digest =
        err && typeof err === "object" && "digest" in err
          ? String((err as { digest?: string }).digest)
          : "";
      if (digest.startsWith("NEXT_REDIRECT")) throw err;
      toast.error("Something went wrong. Please try again.");
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
        <h1 className="mb-6 text-xl font-semibold text-foreground">New collection</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
          <CollectionForm register={register} errors={errors} defaultValues={defaultValues} />
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
