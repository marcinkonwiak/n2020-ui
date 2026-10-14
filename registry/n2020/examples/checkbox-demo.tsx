import { Checkbox } from "@/registry/n2020/ui/checkbox";
import { Label } from "@/registry/n2020/ui/label";

export default function CheckboxDemo() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="checkbox-demo-terms" defaultChecked />
      <Label htmlFor="checkbox-demo-terms">Accept terms and conditions</Label>
    </div>
  );
}
