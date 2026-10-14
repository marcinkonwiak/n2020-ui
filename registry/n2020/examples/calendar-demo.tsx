"use client";

import * as React from "react";
import { Calendar } from "@/registry/n2020/ui/calendar";

export default function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2026, 5, 12),
  );

  return (
    <Calendar
      mode="single"
      defaultMonth={date}
      selected={date}
      onSelect={setDate}
      className="border"
    />
  );
}
