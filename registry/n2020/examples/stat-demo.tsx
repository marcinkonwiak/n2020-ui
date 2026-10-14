import { Stat, StatGroup } from "@/registry/n2020/components/stat";

export default function StatDemo() {
  return (
    <div className="w-full border-x border-t">
      <StatGroup>
        <Stat label="Runs" value="12.4K" caption="All statuses, last 7 days" />
        <Stat
          label="Recorded cost"
          value="$318.20"
          caption="Cost available for 11,902 runs"
        />
        <Stat
          label="Failure rate"
          value="4.2%"
          caption="498 failed of 11,860 finished runs"
          meter={0.042}
        />
        <Stat
          label="Cached input share"
          value="61.5%"
          caption="Cache read and write over input tokens"
          meter={0.615}
        />
      </StatGroup>
    </div>
  );
}
