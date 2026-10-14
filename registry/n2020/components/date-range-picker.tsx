"use client";

import { format } from "date-fns";
import { CalendarDaysIcon } from "lucide-react";
import { useId, useState } from "react";
import type { DateRange } from "react-day-picker";
import { useIsMobile } from "@/registry/n2020/hooks/use-mobile";
import { cn } from "@/registry/n2020/lib/utils";
import { Button } from "@/registry/n2020/ui/button";
import { Calendar } from "@/registry/n2020/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/registry/n2020/ui/field";
import { Input } from "@/registry/n2020/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/n2020/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/registry/n2020/ui/toggle-group";

const DAY_MS = 86_400_000;
const MAX_RANGE_DAYS = 366;

const PRESET_MS = {
  "24h": DAY_MS,
  "7d": 7 * DAY_MS,
  "30d": 30 * DAY_MS,
};

export type DateRangePreset = keyof typeof PRESET_MS;

export type DateRangeValue =
  | { type: "preset"; preset: DateRangePreset }
  | { type: "custom"; from: Date; to: Date };

const PRESETS = Object.keys(PRESET_MS) as DateRangePreset[];

function dateAtTime(day: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    hours,
    minutes,
  );
}

function resolve(value: DateRangeValue) {
  if (value.type === "custom") return { from: value.from, to: value.to };
  const to = new Date();
  return { from: new Date(to.getTime() - PRESET_MS[value.preset]), to };
}

export function DateRangePicker({
  value,
  onChange,
  className,
}: {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  className?: string;
}) {
  const id = useId();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange>();
  const [fromTime, setFromTime] = useState("00:00");
  const [toTime, setToTime] = useState("23:59");
  const [error, setError] = useState("");

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) return;
    const { from, to } = resolve(value);
    setDraft({ from, to });
    setFromTime(format(from, "HH:mm"));
    setToTime(format(to, "HH:mm"));
    setError("");
  }

  function apply() {
    if (!draft?.from || !draft.to) {
      setError("Select a start and end date.");
      return;
    }
    const from = dateAtTime(draft.from, fromTime);
    const to = dateAtTime(draft.to, toTime);
    if (
      !(from < to) ||
      to > new Date() ||
      to.getTime() - from.getTime() > MAX_RANGE_DAYS * DAY_MS
    ) {
      setError(
        `Choose a past range up to ${MAX_RANGE_DAYS} days, with the start before the end.`,
      );
      return;
    }
    onChange({ type: "custom", from, to });
    setOpen(false);
  }

  return (
    <div
      data-slot="date-range-picker"
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      <ToggleGroup
        multiple={false}
        value={value.type === "preset" ? [value.preset] : []}
        onValueChange={([selected]) => {
          const preset = PRESETS.find((preset) => preset === selected);
          if (preset) onChange({ type: "preset", preset });
        }}
        variant="outline"
        size="sm"
        spacing={0}
        aria-label="Time range"
      >
        {PRESETS.map((preset) => (
          <ToggleGroupItem key={preset} value={preset}>
            {preset}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          render={
            <Button
              variant={value.type === "custom" ? "secondary" : "outline"}
              size="sm"
            />
          }
        >
          <CalendarDaysIcon data-icon="inline-start" />
          {value.type === "custom"
            ? `${format(value.from, "MMM d, HH:mm")} – ${format(value.to, "MMM d, HH:mm")}`
            : "Custom range"}
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="max-h-[80vh] w-auto max-w-[calc(100vw-2rem)] overflow-auto"
        >
          <PopoverTitle>Custom date and time range</PopoverTitle>
          <Calendar
            mode="range"
            selected={draft}
            onSelect={setDraft}
            defaultMonth={draft?.from}
            numberOfMonths={isMobile ? 1 : 2}
            disabled={{ after: new Date() }}
          />
          <FieldGroup className="grid grid-cols-2 gap-3">
            <Field className="gap-1.5">
              <FieldLabel htmlFor={`${id}from-time`}>Start time</FieldLabel>
              <Input
                id={`${id}from-time`}
                type="time"
                value={fromTime}
                onChange={(event) => setFromTime(event.target.value)}
              />
            </Field>
            <Field className="gap-1.5">
              <FieldLabel htmlFor={`${id}to-time`}>End time</FieldLabel>
              <Input
                id={`${id}to-time`}
                type="time"
                value={toTime}
                onChange={(event) => setToTime(event.target.value)}
              />
            </Field>
          </FieldGroup>
          <p className="text-xs text-muted-foreground">
            Times use your local time zone. Maximum range: {MAX_RANGE_DAYS}{" "}
            days.
          </p>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <Button size="sm" onClick={apply}>
            Apply range
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
