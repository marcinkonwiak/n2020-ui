import { PlusIcon } from "lucide-react";
import { PageHeader } from "@/registry/n2020/components/page-header";
import { Button } from "@/registry/n2020/ui/button";

export default function PageHeaderDemo() {
  return (
    <div className="w-full border">
      <PageHeader
        title="Projects"
        eyebrow="Acme Inc · 14 active"
        actions={
          <Button size="sm">
            <PlusIcon data-icon="inline-start" />
            New project
          </Button>
        }
      />
    </div>
  );
}
