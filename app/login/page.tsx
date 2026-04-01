"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { login } from "@/lib/actions/auth";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import {
  PASSWORD_MAX,
  PASSWORD_MIN,
  type AuthFormValues,
  USERNAME_MAX,
  USERNAME_MIN,
  authSchema,
} from "@/lib/schemas/auth";

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
      <header className="border-b border-border px-6 py-4">
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex h-7 items-center justify-center rounded-lg px-2.5 text-[0.8rem] font-medium text-foreground transition-colors hover:bg-muted"
          >
            ← Back home
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-md px-6 py-8">
        <h1 className="mb-6 text-xl font-semibold text-foreground">Log in</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
          {formError && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {formError}
            </p>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">
              Username <span className="text-destructive">*</span>
            </Label>
            <Input
              id="username"
              type="text"
              autoComplete="username"
              {...register("username")}
              minLength={USERNAME_MIN}
              maxLength={USERNAME_MAX}
              placeholder="Your username"
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? "username-error" : undefined}
            />
            {errors.username && (
              <p id="username-error" className="text-sm text-destructive" role="alert">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">
              Password <span className="text-destructive">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
              minLength={PASSWORD_MIN}
              maxLength={PASSWORD_MAX}
              placeholder="Your password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p id="password-error" className="text-sm text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>
        </form>

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
