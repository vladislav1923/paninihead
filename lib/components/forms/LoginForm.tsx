"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import {
  PASSWORD_MAX,
  PASSWORD_MIN,
  USERNAME_MAX,
  USERNAME_MIN,
  type AuthFormValues,
} from "@/lib/schemas/auth";

type LoginFormProps = {
  register: UseFormRegister<AuthFormValues>;
  errors: FieldErrors<AuthFormValues>;
  isSubmitting: boolean;
  formError?: string;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
};

export function LoginForm({ register, errors, isSubmitting, formError, onSubmit }: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
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
  );
}
