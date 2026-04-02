"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signup } from "@/lib/actions/auth";
import { SignupForm } from "@/lib/components/forms/SignupForm";
import { Header } from "@/lib/components/ui/Header";
import { type SignupFormValues, signupSchema } from "@/lib/schemas/auth";

const defaultValues: SignupFormValues = {
  username: "",
  password: "",
  passwordConfirmation: "",
};

export default function SignupPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<SignupFormValues>({
    resolver: yupResolver(signupSchema) as Resolver<SignupFormValues>,
    defaultValues,
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const result = await signup({
        username: data.username,
        password: data.password,
      });

      if (result.ok) {
        toast.success("Account created successfully.");
        reset(defaultValues);
        router.push("/collections");
        return;
      }

      for (const [field, message] of Object.entries(result.errors)) {
        setError(field as keyof SignupFormValues, { message });
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
        <h1 className="mb-6 text-xl font-semibold text-foreground">Sign up</h1>
        <SignupForm
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit(onSubmit)}
        />

        <p className="mt-6 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground underline underline-offset-4">
            Log in
          </Link>
        </p>
      </main>
    </div>
  );
}
