import { Separator } from "@/registry/n2020/ui/separator";

export default function SeparatorDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 text-sm">
      <div className="flex flex-col gap-1">
        <div className="font-medium">n2020</div>
        <div className="text-muted-foreground">
          A component registry with square corners.
        </div>
      </div>
      <Separator />
      <div className="flex h-5 items-center gap-4">
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Components</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  );
}
