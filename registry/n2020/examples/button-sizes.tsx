import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/registry/n2020/ui/button";

export default function ButtonSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Continue">
        <ArrowRightIcon />
      </Button>
    </div>
  );
}
