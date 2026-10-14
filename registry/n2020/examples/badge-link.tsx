import { ArrowUpRightIcon } from "lucide-react";
import { Badge } from "@/registry/n2020/ui/badge";

export default function BadgeLink() {
  return (
    <Badge variant="outline" render={<a href="/docs/components/button" />}>
      Button docs
      <ArrowUpRightIcon data-icon="inline-end" />
    </Badge>
  );
}
