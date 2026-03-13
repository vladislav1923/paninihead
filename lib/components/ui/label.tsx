import { cn } from "@/lib/components/utils";

type LabelProps = React.ComponentProps<"label">;

function Label({ className, ...props }: LabelProps) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: Association is provided by parent via htmlFor.
    <label className={cn("text-sm font-medium text-foreground", className)} {...props} />
  );
}

export { Label };
