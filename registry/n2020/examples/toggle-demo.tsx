import { BoldIcon } from "lucide-react";
import { Toggle } from "@/registry/n2020/ui/toggle";

export default function ToggleDemo() {
  return (
    <Toggle aria-label="Toggle bold">
      <BoldIcon />
      Bold
    </Toggle>
  );
}
