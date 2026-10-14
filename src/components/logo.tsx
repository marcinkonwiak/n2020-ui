import { cn } from "@/registry/n2020/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-display text-2xl leading-none", className)}>
      n2020
    </span>
  );
}
