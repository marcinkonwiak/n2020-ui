"use client";

import { useState } from "react";
import {
  DateRangePicker,
  type DateRangeValue,
} from "@/registry/n2020/components/date-range-picker";

export default function DateRangePickerDemo() {
  const [value, setValue] = useState<DateRangeValue>({
    type: "preset",
    preset: "7d",
  });

  return <DateRangePicker value={value} onChange={setValue} />;
}
