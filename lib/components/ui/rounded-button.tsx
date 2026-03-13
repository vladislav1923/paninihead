"use client";

import { cn } from "@/lib/components/utils";

type RoundedButtonProps = {
  pressed?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
};

export function RoundedButton({
  pressed = false,
  onClick,
  children,
  className,
  "aria-label": ariaLabel,
}: RoundedButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      aria-label={ariaLabel}
      className={cn(
        "flex size-7 cursor-pointer items-center justify-center rounded-full text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        pressed
          ? "bg-green-600 text-white hover:bg-green-700"
          : "bg-muted text-muted-foreground hover:bg-muted hover:brightness-95",
        className,
      )}
    >
      {children}
    </button>
  );
}
