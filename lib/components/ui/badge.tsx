import { cn } from "@/lib/components/utils";

type BadgeProps = {
  text: string;
  variant?: "green" | "orange";
  className?: string;
};

export function Badge({ text, variant = "orange", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "green" ? "bg-green-600 text-white" : "bg-orange-500 text-white",
        className,
      )}
    >
      {text}
    </span>
  );
}
