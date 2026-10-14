import type { ReactNode } from "react";
import { Sky } from "@/registry/n2020/components/sky";
import { cn } from "@/registry/n2020/lib/utils";

export function PageHeader({
  title,
  eyebrow,
  actions,
  compact = false,
  className,
}: {
  title: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  compact?: boolean;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "relative isolate flex shrink-0 flex-wrap items-end justify-between gap-4 border-b px-4 pb-6 lg:px-8",
        compact ? "pt-6" : "pt-14",
        className,
      )}
    >
      <Sky className="absolute inset-0 -z-10 size-full" />
      <div className="flex min-w-0 flex-col gap-1">
        {eyebrow && (
          <div className="text-sm text-muted-foreground">{eyebrow}</div>
        )}
        <h1
          className={cn(
            "truncate font-display leading-none tracking-tight",
            compact ? "text-4xl" : "text-6xl lg:text-7xl",
          )}
        >
          {title}
        </h1>
      </div>
      {actions}
    </header>
  );
}
