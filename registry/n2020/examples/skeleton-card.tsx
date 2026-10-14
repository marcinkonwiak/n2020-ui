import { Card, CardContent, CardHeader } from "@/registry/n2020/ui/card";
import { Skeleton } from "@/registry/n2020/ui/skeleton";

export default function SkeletonCard() {
  return (
    <Card className="w-full max-w-xs" role="status" aria-label="Loading card">
      <CardHeader>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full" />
      </CardContent>
    </Card>
  );
}
