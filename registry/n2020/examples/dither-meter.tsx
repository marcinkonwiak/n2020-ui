import { DitherMeter } from "@/registry/n2020/components/dither";

const quotas = [
  { name: "Storage", used: 0.82, label: "82 of 100 GB" },
  { name: "Seats", used: 0.4, label: "8 of 20" },
  { name: "API calls", used: 0.12, label: "12k of 100k" },
];

export default function DitherMeterExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      {quotas.map((quota) => (
        <div key={quota.name} className="flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span>{quota.name}</span>
            <span className="text-muted-foreground">{quota.label}</span>
          </div>
          <DitherMeter value={quota.used} className="text-primary" />
        </div>
      ))}
    </div>
  );
}
