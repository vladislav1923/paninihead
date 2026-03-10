import { forwardRef } from "react";
import { cn } from "@/lib/components/utils";

const inputClassName =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30";

const Input = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(inputClassName, className)}
        {...props}
      />
    );
  }
);

export { Input };
