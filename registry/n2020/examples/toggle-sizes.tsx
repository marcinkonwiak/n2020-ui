import { Toggle } from "@/registry/n2020/ui/toggle";

export default function ToggleSizes() {
  return (
    <div className="flex items-center gap-3">
      <Toggle variant="outline" size="sm">
        Small
      </Toggle>
      <Toggle variant="outline">Default</Toggle>
      <Toggle variant="outline" size="lg">
        Large
      </Toggle>
    </div>
  );
}
