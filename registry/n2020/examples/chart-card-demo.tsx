import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartCard } from "@/registry/n2020/components/chart-card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/registry/n2020/ui/chart";

const data = [
  { day: "Mon", completed: 182, failed: 9 },
  { day: "Tue", completed: 214, failed: 14 },
  { day: "Wed", completed: 198, failed: 6 },
  { day: "Thu", completed: 251, failed: 21 },
  { day: "Fri", completed: 229, failed: 11 },
];

const config = {
  completed: { label: "Completed", color: "var(--chart-1)" },
  failed: { label: "Failed", color: "var(--destructive)" },
} satisfies ChartConfig;

export default function ChartCardDemo() {
  return (
    <div className="w-full">
      <ChartCard
        title="Runs over time"
        description="Completed and failed runs per day"
      >
        <ChartContainer config={config} className="h-56 w-full">
          <BarChart data={data} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="completed"
              stackId="runs"
              fill="var(--color-completed)"
            />
            <Bar dataKey="failed" stackId="runs" fill="var(--color-failed)" />
          </BarChart>
        </ChartContainer>
      </ChartCard>
    </div>
  );
}
