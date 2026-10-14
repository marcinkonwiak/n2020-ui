import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/n2020/ui/chart";

const data = [
  { day: "Mon", requests: 1840 },
  { day: "Tue", requests: 2310 },
  { day: "Wed", requests: 2105 },
  { day: "Thu", requests: 2890 },
  { day: "Fri", requests: 3240 },
  { day: "Sat", requests: 1420 },
  { day: "Sun", requests: 1175 },
];

const config = {
  requests: { label: "Requests", color: "var(--chart-2)" },
} satisfies ChartConfig;

export default function ChartArea() {
  return (
    <ChartContainer config={config} className="w-full max-w-md">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ left: 20, right: 20 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Area
          dataKey="requests"
          type="linear"
          stroke="var(--color-requests)"
          fill="var(--color-requests)"
          fillOpacity={0.2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
