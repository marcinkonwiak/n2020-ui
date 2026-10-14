"use client";

import { useId } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { DitherPattern } from "@/registry/n2020/components/dither";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/registry/n2020/ui/chart";

const data = [
  { day: "Mon", read: 420, write: 180 },
  { day: "Tue", read: 510, write: 240 },
  { day: "Wed", read: 380, write: 150 },
  { day: "Thu", read: 640, write: 310 },
  { day: "Fri", read: 560, write: 220 },
];

const config = {
  read: { label: "Cache read", color: "var(--chart-1)" },
  write: { label: "Cache write", color: "var(--chart-3)" },
} satisfies ChartConfig;

export default function DitherDemo() {
  const id = useId();
  return (
    <ChartContainer config={config} className="h-64 w-full">
      <BarChart data={data} accessibilityLayer>
        <defs>
          <DitherPattern id={id} color="var(--color-write)" density={0.5} />
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="read" fill="var(--color-read)" />
        <Bar dataKey="write" fill={`url(#${id})`} />
      </BarChart>
    </ChartContainer>
  );
}
