import { Button } from "@/registry/n2020/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/n2020/ui/tooltip";

const sides = ["top", "right", "bottom", "left"] as const;

export default function TooltipSide() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap justify-center gap-3">
        {sides.map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger render={<Button variant="outline" />}>
              {side}
            </TooltipTrigger>
            <TooltipContent side={side}>Opens on the {side}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
