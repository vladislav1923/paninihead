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
  type SignupFormValues,
} from "@/lib/schemas/auth";

type SignupFormProps = {
  register: UseFormRegister<SignupFormValues>;
  errors: FieldErrors<SignupFormValues>;
  isSubmitting: boolean;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
};

export function SignupForm({ register, errors, isSubmitting, onSubmit }: SignupFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
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
  );
}
