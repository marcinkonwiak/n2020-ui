import { Skeleton } from "@/registry/n2020/ui/skeleton";

export default function SkeletonDemo() {
  return (
    <div
      className="flex items-center gap-4"
      role="status"
      aria-label="Loading profile"
    >
      <Skeleton className="size-12" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );
}
