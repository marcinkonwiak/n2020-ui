import { PageHeader } from "@/registry/n2020/components/page-header";
import { Button } from "@/registry/n2020/ui/button";

export default function PageHeaderCompact() {
  return (
    <div className="w-full border">
      <PageHeader
        compact
        title="Billing"
        eyebrow="Settings"
        actions={
          <Button variant="outline" size="sm">
            Download invoices
          </Button>
        }
      />
    </div>
  );
}
