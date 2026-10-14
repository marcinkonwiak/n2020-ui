import { SearchIcon } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/n2020/ui/empty";

export default function EmptyOutline() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchIcon />
        </EmptyMedia>
        <EmptyTitle>No results</EmptyTitle>
        <EmptyDescription>
          No deploy matches this filter. <a href="/docs">Read the docs</a> for
          the filter syntax.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
