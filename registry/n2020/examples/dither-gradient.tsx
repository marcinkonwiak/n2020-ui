"use client";

import { useId } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { DitherGradientPattern } from "@/registry/n2020/components/dither";
import { type ChartConfig, ChartContainer } from "@/registry/n2020/ui/chart";

const data = [
  { day: "Mon", cost: 12.4 },
  { day: "Tue", cost: 18.9 },
  { day: "Wed", cost: 15.2 },
  { day: "Thu", cost: 24.6 },
  { day: "Fri", cost: 21.3 },
  { day: "Sat", cost: 9.8 },
  { day: "Sun", cost: 14.1 },
];

const config = {
  cost: { label: "Cost", color: "var(--chart-2)" },
} satisfies ChartConfig;

export default function DitherGradient() {
  const id = useId();
  return (
    <ChartContainer config={config} className="h-64 w-full">
      <AreaChart data={data} accessibilityLayer>
        <defs>
          <DitherGradientPattern
            id={id}
            color="var(--color-cost)"
            height={232}
            topDensity={0.85}
            bottomDensity={0}
          />
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <Area
          dataKey="cost"
          type="monotone"
          fill={`url(#${id})`}
          fillOpacity={1}
          stroke="var(--color-cost)"
          strokeWidth={1.5}
        />
      </AreaChart>
    </ChartContainer>
  );
}
