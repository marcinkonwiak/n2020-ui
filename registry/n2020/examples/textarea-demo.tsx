import { Textarea } from "@/registry/n2020/ui/textarea";

export default function TextareaDemo() {
  return (
    <Textarea
      placeholder="Describe the issue you ran into."
      aria-label="Message"
      className="max-w-sm"
    />
  );
}
