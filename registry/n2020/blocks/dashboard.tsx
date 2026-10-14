"use client";

import { createColumnHelper } from "@tanstack/react-table";
import {
  eachDayOfInterval,
  eachHourOfInterval,
  endOfDay,
  format,
  isSameDay,
  subDays,
  subHours,
} from "date-fns";
import {
  LayoutDashboardIcon,
  PackageIcon,
  ShoppingCartIcon,
  UserCogIcon,
  UsersIcon,
} from "lucide-react";
import { useId, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/registry/n2020/components/chart-card";
import {
  DataTable,
  type dataTableFeatures,
} from "@/registry/n2020/components/data-table";
import {
  DateRangePicker,
  type DateRangeValue,
} from "@/registry/n2020/components/date-range-picker";
import {
  DitherGradientPattern,
  DitherPattern,
} from "@/registry/n2020/components/dither";
import { PageHeader } from "@/registry/n2020/components/page-header";
import { Stat, StatGroup } from "@/registry/n2020/components/stat";
import { cn } from "@/registry/n2020/lib/utils";
import { Avatar, AvatarFallback } from "@/registry/n2020/ui/avatar";
import { Badge } from "@/registry/n2020/ui/badge";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/n2020/ui/chart";
import { Separator } from "@/registry/n2020/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/n2020/ui/sidebar";

const navigation = [
  {
    label: null,
    items: [{ title: "Overview", icon: LayoutDashboardIcon }],
  },
  {
    label: "Sales",
    items: [
      { title: "Orders", icon: ShoppingCartIcon },
      { title: "Customers", icon: UsersIcon },
      { title: "Products", icon: PackageIcon },
    ],
  },
  {
    label: "Management",
    items: [{ title: "Team", icon: UserCogIcon }],
  },
];

// Sample data. Replace `hourlyPoints`, `dailyPoints`, and `recentOrders` with data from your server.
const END = new Date(2026, 5, 30, 18);

type Point = {
  label: string;
  paid: number;
  refunded: number;
  pending: number;
  revenue: number;
};

/** A repeatable number from 0 to 1, so that the server and the browser render the same chart. */
function sample(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

/** Sums the sample orders of the hours. An hour's orders depend only on its local date and hour, so a day shows the same numbers in every range. */
function point(label: string, hours: Date[]): Point {
  const total = { label, paid: 0, refunded: 0, pending: 0, revenue: 0 };
  for (const hour of hours) {
    const day = Date.UTC(hour.getFullYear(), hour.getMonth(), hour.getDate());
    const seed = (day / 3_600_000 + hour.getHours()) * 4;
    const paid = Math.round(6 + sample(seed) * 9);
    total.paid += paid;
    total.refunded += Math.round(paid * sample(seed + 1) * 0.09);
    total.pending += Math.round(paid * sample(seed + 2) * 0.16);
    total.revenue += Math.round(paid * (48 + sample(seed + 3) * 24));
  }
  return total;
}

function hourlyPoints(from: Date, to: Date) {
  return eachHourOfInterval({ start: from, end: to }).map((hour) =>
    point(format(hour, "HH:mm"), [hour]),
  );
}

/** One point per day, or one per week for a range longer than 90 days. */
function dailyPoints(from: Date, to: Date) {
  const days = eachDayOfInterval({ start: from, end: to });
  const size = days.length > 90 ? 7 : 1;
  return Array.from({ length: Math.ceil(days.length / size) }, (_, index) => {
    const group = days.slice(index * size, (index + 1) * size);
    const hours = eachHourOfInterval({
      start: group[0],
      end: endOfDay(group[group.length - 1]),
    });
    return point(format(group[0], "MMM d"), hours);
  });
}

/** The presets end at `END`. A custom range of one calendar day shows hours. */
function periodFor(range: DateRangeValue) {
  if (range.type === "custom") {
    const { from, to } = range;
    return { from, to, hourly: isSameDay(from, to) };
  }
  if (range.preset === "24h") {
    return { from: subHours(END, 23), to: END, hourly: true };
  }
  const days = range.preset === "7d" ? 7 : 30;
  return { from: subDays(END, days - 1), to: END, hourly: false };
}

type Order = {
  id: string;
  customer: string;
  status: "paid" | "refunded" | "pending";
  items: number;
  total: string;
  placed: string;
};

const recentOrders: Order[] = [
  {
    id: "#10482",
    customer: "Ines Carvalho",
    status: "paid",
    items: 3,
    total: "$184.00",
    placed: "18:04",
  },
  {
    id: "#10481",
    customer: "Hugo Lambert",
    status: "pending",
    items: 1,
    total: "$42.50",
    placed: "18:03",
  },
  {
    id: "#10480",
    customer: "Grace Mbeki",
    status: "paid",
    items: 2,
    total: "$96.20",
    placed: "17:58",
  },
  {
    id: "#10479",
    customer: "Farid Haddad",
    status: "refunded",
    items: 4,
    total: "$231.75",
    placed: "17:51",
  },
  {
    id: "#10478",
    customer: "Elena Rossi",
    status: "paid",
    items: 1,
    total: "$58.00",
    placed: "17:46",
  },
  {
    id: "#10477",
    customer: "Dmitri Volkov",
    status: "paid",
    items: 2,
    total: "$112.40",
    placed: "17:39",
  },
];

const statusVariant = {
  paid: "secondary",
  refunded: "destructive",
  pending: "default",
} as const;

const columnHelper = createColumnHelper<typeof dataTableFeatures, Order>();

const columns = columnHelper.columns([
  columnHelper.accessor("id", {
    header: "Order",
    enableHiding: false,
    cell: ({ getValue }) => (
      <span className="font-mono text-xs">{getValue()}</span>
    ),
  }),
  columnHelper.accessor("customer", { header: "Customer" }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => (
      <Badge variant={statusVariant[getValue()]}>{getValue()}</Badge>
    ),
  }),
  columnHelper.accessor("items", { header: "Items" }),
  columnHelper.accessor("total", { header: "Total" }),
  columnHelper.accessor("placed", { header: "Placed" }),
]);

const orderConfig = {
  paid: { label: "Paid", color: "var(--chart-1)" },
  refunded: { label: "Refunded", color: "var(--destructive)" },
  pending: { label: "Pending", color: "var(--chart-3)" },
} satisfies ChartConfig;

const revenueConfig = {
  revenue: { label: "Revenue", color: "var(--chart-2)" },
} satisfies ChartConfig;

const integer = new Intl.NumberFormat("en-US");
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const percentage = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

function DashboardSidebar() {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="h-(--header-height) flex-row items-center justify-between border-b border-sidebar-border px-4 py-0">
        <span className="font-display text-2xl leading-none">Acme</span>
        <span className="font-mono text-[10px] tracking-[0.18em] text-sidebar-foreground/50 uppercase">
          Console
        </span>
      </SidebarHeader>
      <SidebarContent className="gap-0 pt-2">
        {navigation.map((group) => (
          <SidebarGroup key={group.label ?? "main"}>
            {group.label && (
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            )}
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={item.title === "Overview"}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="flex-row items-center gap-3 border-t border-sidebar-border px-4 py-3">
        <Avatar className="after:hidden">
          <AvatarFallback className="bg-sidebar-foreground font-mono text-xs font-medium text-sidebar">
            AO
          </AvatarFallback>
        </Avatar>
        <div className="grid leading-tight">
          <span className="truncate text-sm font-medium">Ada Okafor</span>
          <span className="truncate font-mono text-[10px] text-sidebar-foreground/60">
            ada@example.com
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function DashboardHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-(--header-height) shrink-0 items-center gap-3 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" size="icon-sm" />
      <Separator
        orientation="vertical"
        className="h-4 data-vertical:self-auto"
      />
      <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
        Acme <span className="px-1 text-primary">/</span>
        <span className="text-foreground">Overview</span>
      </p>
    </header>
  );
}

export default function Dashboard({ className }: { className?: string }) {
  const id = useId();
  const [range, setRange] = useState<DateRangeValue>({
    type: "preset",
    preset: "30d",
  });
  const { from, to, hourly } = periodFor(range);
  const data = hourly ? hourlyPoints(from, to) : dailyPoints(from, to);
  const dateFormat = hourly
    ? "MMM d, HH:mm"
    : from.getFullYear() === to.getFullYear()
      ? "MMM d"
      : "MMM d, yyyy";

  const settled = data.reduce(
    (sum, point) => sum + point.paid + point.refunded,
    0,
  );
  const refunded = data.reduce((sum, point) => sum + point.refunded, 0);
  const orders = data.reduce((sum, point) => sum + point.pending, settled);
  const revenue = data.reduce((sum, point) => sum + point.revenue, 0);
  const returningShare = 0.615;

  const xAxis = (
    <XAxis
      dataKey="label"
      interval={Math.max(0, Math.ceil(data.length / 5) - 1)}
      tickLine={false}
      axisLine={false}
      tickMargin={8}
    />
  );

  return (
    <SidebarProvider
      className={cn(className)}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 56)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <DashboardSidebar />
      <SidebarInset className="min-w-0">
        <DashboardHeader />
        <div className="flex min-w-0 flex-1 flex-col">
          <PageHeader
            title="Overview"
            eyebrow={`${format(from, dateFormat)} – ${format(to, dateFormat)}`}
            actions={<DateRangePicker value={range} onChange={setRange} />}
          />
          <StatGroup className="xl:grid-cols-4">
            <Stat
              label="Orders"
              value={integer.format(orders)}
              caption="All order statuses in the selected range"
            />
            <Stat
              label="Revenue"
              value={money.format(revenue)}
              caption={`From ${integer.format(settled - refunded)} paid orders`}
            />
            <Stat
              label="Refund rate"
              value={percentage.format(refunded / settled)}
              caption={`${integer.format(refunded)} refunded of ${integer.format(settled)} settled orders`}
              meter={refunded / settled}
            />
            <Stat
              label="Returning customers"
              value={percentage.format(returningShare)}
              caption="Orders from customers with an earlier order"
              meter={returningShare}
            />
          </StatGroup>
          <div className="grid gap-4 p-4 lg:gap-6 lg:p-8 xl:grid-cols-2">
            <ChartCard
              title="Orders over time"
              description="Paid, refunded, and pending orders"
            >
              <ChartContainer config={orderConfig} className="h-64 w-full">
                <BarChart data={data} accessibilityLayer>
                  <defs>
                    <DitherPattern
                      id={`${id}pending`}
                      color="var(--color-pending)"
                      density={0.5}
                    />
                  </defs>
                  <CartesianGrid vertical={false} />
                  {xAxis}
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    width={32}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="paid"
                    stackId="orders"
                    isAnimationActive={false}
                    fill="var(--color-paid)"
                  />
                  <Bar
                    dataKey="refunded"
                    stackId="orders"
                    isAnimationActive={false}
                    fill="var(--color-refunded)"
                  />
                  <Bar
                    dataKey="pending"
                    stackId="orders"
                    isAnimationActive={false}
                    fill={`url(#${id}pending)`}
                  />
                </BarChart>
              </ChartContainer>
            </ChartCard>
            <ChartCard
              title="Revenue over time"
              description="Revenue from paid orders"
            >
              <ChartContainer config={revenueConfig} className="h-64 w-full">
                <AreaChart data={data} accessibilityLayer>
                  <defs>
                    <DitherGradientPattern
                      id={`${id}revenue`}
                      color="var(--color-revenue)"
                      height={232}
                      topDensity={0.85}
                      bottomDensity={0}
                    />
                  </defs>
                  <CartesianGrid vertical={false} />
                  {xAxis}
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={40}
                    tickFormatter={(value: number) =>
                      value >= 1000 ? `${value / 1000}k` : String(value)
                    }
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    dataKey="revenue"
                    type="monotone"
                    fill={`url(#${id}revenue)`}
                    fillOpacity={1}
                    stroke="var(--color-revenue)"
                    strokeWidth={1.5}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ChartContainer>
            </ChartCard>
          </div>
          <section className="flex flex-col gap-4 px-4 pb-8 lg:px-8">
            <h2 className="text-sm font-medium">Recent orders</h2>
            <DataTable columns={columns} data={recentOrders} />
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
