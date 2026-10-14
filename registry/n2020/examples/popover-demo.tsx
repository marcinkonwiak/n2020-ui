import { Button } from "@/registry/n2020/ui/button";
import { Input } from "@/registry/n2020/ui/input";
import { Label } from "@/registry/n2020/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/n2020/ui/popover";

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        Set budget
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Monthly budget</PopoverTitle>
          <PopoverDescription>
            We email you when spending passes this amount.
          </PopoverDescription>
        </PopoverHeader>
        <div className="grid gap-2">
          <Label htmlFor="popover-demo-budget">Amount in USD</Label>
          <Input id="popover-demo-budget" type="number" defaultValue={250} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
