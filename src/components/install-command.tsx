import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/registry/n2020/lib/utils";
import registryConfig from "../../registry.config.json";

export function InstallCommand({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  const urls = items.map((item) => `${registryConfig.url}/r/${item}.json`);
  const command = `pnpm dlx shadcn@latest add ${urls.join(" ")}`;
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label="Copy the install command"
      className={cn(
        "group flex h-10 w-fit max-w-full items-center gap-3 border border-foreground/20 px-3 text-left font-mono text-xs transition-colors hover:border-foreground/50 focus-visible:outline-2 focus-visible:outline-ring",
        className,
      )}
      onClick={async () => {
        await navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      <span className="truncate">{command}</span>
      {copied ? (
        <CheckIcon className="size-3.5 shrink-0" />
      ) : (
        <CopyIcon className="size-3.5 shrink-0 opacity-50 group-hover:opacity-100" />
      )}
    </button>
  );
}
