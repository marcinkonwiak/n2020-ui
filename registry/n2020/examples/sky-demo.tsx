import { Sky } from "@/registry/n2020/components/sky";

export default function SkyDemo() {
  return (
    <div className="relative isolate flex h-64 w-full items-end border p-6">
      <Sky className="absolute inset-0 -z-10 size-full" />
      <p className="font-display text-4xl leading-none">Good morning</p>
    </div>
  );
}
