import type * as React from "react";
import { DitherMeter } from "@/registry/n2020/components/dither";
import { cn } from "@/registry/n2020/lib/utils";

export function StatGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-group"
      className={cn("grid grid-cols-2 gap-px border-b bg-border", className)}
      {...props}
    />
  );
}

export function Stat({
  label,
  value,
  caption,
  meter,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  label: string;
  value: string;
  caption: string;
  meter?: number;
}) {
  return (
    <div
      data-slot="stat"
      className={cn(
        "flex flex-col gap-2 bg-background px-4 py-5 lg:px-6",
        className,
      )}
      {...props}
    >
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-display text-5xl leading-none tabular-nums">{value}</p>
      {meter !== undefined && (
        <DitherMeter value={meter} className="text-primary" />
      )}
      <p className="mt-auto pt-1 text-xs text-muted-foreground">{caption}</p>
    </div>
  );
}
