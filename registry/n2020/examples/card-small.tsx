import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/n2020/ui/card";

export default function CardSmall() {
  return (
    <Card size="sm" className="w-full max-w-xs">
      <CardHeader>
        <CardDescription>Requests today</CardDescription>
        <CardTitle className="font-mono text-2xl">18,204</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Up 12% from yesterday.</p>
      </CardContent>
    </Card>
  );
}
