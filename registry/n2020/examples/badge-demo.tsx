import { CircleCheckIcon } from "lucide-react";
import { Badge } from "@/registry/n2020/ui/badge";

export default function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge>New</Badge>
      <Badge variant="secondary">
        <CircleCheckIcon data-icon="inline-start" />
        Verified
      </Badge>
      <Badge variant="outline">v1.4.0</Badge>
    </div>
  );
}
