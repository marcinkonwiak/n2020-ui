import { Button } from "@/registry/n2020/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/n2020/ui/tooltip";

export default function TooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          Archive
        </TooltipTrigger>
        <TooltipContent>Move this project to the archive</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
