"use client";

import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/components/utils";
import { Button } from "@/lib/components/ui/button";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  fullScreen?: boolean;
};

export function Dialog({
  open,
  onOpenChange,
  title,
  children,
  className,
  fullScreen = false,
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
      className={cn(
        "fixed inset-0 z-50",
        !fullScreen && "flex items-center justify-center p-4"
      )}
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
          "z-50 flex flex-col bg-background",
          fullScreen
            ? "fixed inset-4 overflow-hidden rounded-xl border border-border shadow-lg"
            : "relative w-full max-w-lg rounded-xl border border-border p-6 shadow-lg",
          !fullScreen && "p-6",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            "flex shrink-0 items-center justify-between border-b border-border",
            fullScreen ? "px-6 py-4" : "mb-4"
          )}
        >
          <h2
            id="dialog-title"
            className="font-semibold text-foreground text-lg"
          >
            {title}
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <X className="size-4" aria-hidden />
          </Button>
        </div>
        <div className={cn(fullScreen && "flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-6")}>
          {children}
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(content, document.body)
    : null;
}
