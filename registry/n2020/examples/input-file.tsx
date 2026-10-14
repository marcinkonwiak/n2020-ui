import { Input } from "@/registry/n2020/ui/input";
import { Label } from "@/registry/n2020/ui/label";

export default function InputFile() {
  return (
    <div className="grid w-full max-w-xs gap-2">
      <Label htmlFor="input-file-avatar">Profile picture</Label>
      <Input id="input-file-avatar" type="file" />
    </div>
  );
}
