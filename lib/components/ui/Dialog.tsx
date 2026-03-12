"use client";

import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/components/utils";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function Dialog({
  open,
  onOpenChange,
  title,
  children,
  className,
}: DialogProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    },
    [onOpenChange]
  );

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  if (!open) return null;

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
    >
      <div
        className="fixed inset-0 bg-black/50"
        aria-hidden
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal
        aria-labelledby="dialog-title"
        className={cn(
          "relative z-50 w-full max-w-lg rounded-xl border border-border bg-background p-6 shadow-lg",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="dialog-title"
          className="mb-4 text-lg font-semibold text-foreground"
        >
          {title}
        </h2>
        {children}
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(content, document.body)
    : null;
}
