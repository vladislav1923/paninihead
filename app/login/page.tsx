"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { login } from "@/lib/actions/auth";
import { LoginForm } from "@/lib/components/forms/LoginForm";
import { Header } from "@/lib/components/ui/Header";
import { type AuthFormValues, authSchema } from "@/lib/schemas/auth";

const defaultValues: AuthFormValues = {
  username: "",
  password: "",
};

export default function LoginPage() {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<AuthFormValues>({
    resolver: yupResolver(authSchema) as Resolver<AuthFormValues>,
    defaultValues,
  });

  const onSubmit = async (data: AuthFormValues) => {
    try {
      setFormError("");
      const result = await login(data);
      if (result.ok) {
        toast.success("Logged in successfully.");
        router.push("/collections");
        return;
      }

      for (const [field, message] of Object.entries(result.errors)) {
        if (field === "_") {
          setFormError(message);
          continue;
        }
        setError(field as keyof AuthFormValues, { message });
      }
      toast.error("Request failed. Please fix the errors and try again.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        left={
          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex h-7 items-center justify-center rounded-lg px-2.5 text-[0.8rem] font-medium text-foreground transition-colors hover:bg-muted"
            >
              ← Back home
            </Link>
          </nav>
        }
      />

      <main className="mx-auto max-w-md px-6 py-8">
        <h1 className="mb-6 text-xl font-semibold text-foreground">Log in</h1>
        <LoginForm
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
          formError={formError}
          onSubmit={handleSubmit(onSubmit)}
        />

        <p className="mt-6 text-sm text-muted-foreground">
          Do not have an account?{" "}
          <Link href="/signup" className="text-foreground underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </main>
    </div>
  );
}
