import { ChevronsUpDownIcon } from "lucide-react";
import { Button } from "@/registry/n2020/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/n2020/ui/collapsible";

export default function CollapsibleDemo() {
  return (
    <Collapsible className="flex w-full max-w-xs flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <h4 className="text-sm font-medium">3 environment variables</h4>
        <CollapsibleTrigger
          render={
            <Button variant="ghost" size="icon" aria-label="Toggle variables" />
          }
        >
          <ChevronsUpDownIcon />
        </CollapsibleTrigger>
      </div>
      <div className="border px-4 py-2 font-mono text-sm">DATABASE_URL</div>
      <CollapsibleContent className="flex flex-col gap-2">
        <div className="border px-4 py-2 font-mono text-sm">REDIS_URL</div>
        <div className="border px-4 py-2 font-mono text-sm">SESSION_SECRET</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
