import { Input } from "@/registry/n2020/ui/input";

export default function InputDemo() {
  return (
    <Input
      type="email"
      placeholder="name@example.com"
      aria-label="Email"
      className="max-w-xs"
    />
  );
}
