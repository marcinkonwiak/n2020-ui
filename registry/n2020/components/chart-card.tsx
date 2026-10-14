import type * as React from "react";
import { cn } from "@/registry/n2020/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/n2020/ui/card";

export function ChartCard({
  title,
  description,
  children,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Card>, "title"> & {
  title: string;
  description: string;
}) {
  return (
    <Card
      data-slot="chart-card"
      className={cn("min-w-0", className)}
      {...props}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
