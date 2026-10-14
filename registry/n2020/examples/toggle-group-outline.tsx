import { ToggleGroup, ToggleGroupItem } from "@/registry/n2020/ui/toggle-group";

export default function ToggleGroupOutline() {
  return (
    <ToggleGroup
      variant="outline"
      spacing={0}
      defaultValue={["week"]}
      aria-label="Date range"
    >
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
    </ToggleGroup>
  );
}
