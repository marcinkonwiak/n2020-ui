import { Input } from "@/registry/n2020/ui/input";
import { Label } from "@/registry/n2020/ui/label";

export default function LabelDemo() {
  return (
    <div className="grid w-full max-w-xs gap-2">
      <Label htmlFor="label-demo-username">Username</Label>
      <Input id="label-demo-username" placeholder="ada.lovelace" />
    </div>
  );
}
