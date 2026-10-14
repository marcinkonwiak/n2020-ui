import { Button } from "@/registry/n2020/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/n2020/ui/card";

export default function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Production deploy</CardTitle>
        <CardDescription>main at 4f2c9a1, built in 48 seconds.</CardDescription>
        <CardAction>
          <Button variant="link" size="sm">
            View logs
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>
          The build passed all 212 checks. Promote it to send traffic to the new
          version.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button>Promote</Button>
        <Button variant="outline">Roll back</Button>
      </CardFooter>
    </Card>
  );
}
