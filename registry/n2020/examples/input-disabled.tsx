import { Input } from "@/registry/n2020/ui/input";

export default function InputDisabled() {
  return (
    <Input
      disabled
      defaultValue="billing@example.com"
      aria-label="Billing email"
      className="max-w-xs"
    />
  );
}
