import { Checkbox } from "@/registry/n2020/ui/checkbox";
import { Label } from "@/registry/n2020/ui/label";

export default function CheckboxDisabled() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="checkbox-disabled-sso" disabled />
      <Label htmlFor="checkbox-disabled-sso">Require single sign-on</Label>
    </div>
  );
}
