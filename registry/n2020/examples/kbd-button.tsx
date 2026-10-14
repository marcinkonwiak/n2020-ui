import { Button } from "@/registry/n2020/ui/button";
import { Kbd } from "@/registry/n2020/ui/kbd";

export default function KbdButton() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="outline">
        Save <Kbd>⌘S</Kbd>
      </Button>
      <Button variant="outline">
        Cancel <Kbd>Esc</Kbd>
      </Button>
    </div>
  );
}
