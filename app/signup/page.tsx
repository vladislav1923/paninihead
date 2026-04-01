"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signup } from "@/lib/actions/auth";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import {
  PASSWORD_MAX,
  PASSWORD_MIN,
  type SignupFormValues,
  USERNAME_MAX,
  USERNAME_MIN,
  signupSchema,
} from "@/lib/schemas/auth";

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
        <h1 className="mb-6 text-xl font-semibold text-foreground">Sign up</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
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
              placeholder="Choose a username"
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
              autoComplete="new-password"
              {...register("password")}
              minLength={PASSWORD_MIN}
              maxLength={PASSWORD_MAX}
              placeholder="Create a password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p id="password-error" className="text-sm text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="passwordConfirmation">
              Confirm password <span className="text-destructive">*</span>
            </Label>
            <Input
              id="passwordConfirmation"
              type="password"
              autoComplete="new-password"
              {...register("passwordConfirmation")}
              minLength={PASSWORD_MIN}
              maxLength={PASSWORD_MAX}
              placeholder="Re-enter your password"
              aria-invalid={!!errors.passwordConfirmation}
              aria-describedby={errors.passwordConfirmation ? "passwordConfirmation-error" : undefined}
            />
            {errors.passwordConfirmation && (
              <p id="passwordConfirmation-error" className="text-sm text-destructive" role="alert">
                {errors.passwordConfirmation.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </main>
    </div>
  );
}
