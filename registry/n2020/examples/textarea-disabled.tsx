import { Textarea } from "@/registry/n2020/ui/textarea";

export default function TextareaDisabled() {
  return (
    <Textarea
      disabled
      defaultValue="This ticket is closed. Open a new one to reply."
      aria-label="Reply"
      className="max-w-sm"
    />
  );
}
