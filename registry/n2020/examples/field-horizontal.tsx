import { Checkbox } from "@/registry/n2020/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/registry/n2020/ui/field";

export default function FieldHorizontal() {
  return (
    <Field orientation="horizontal" className="max-w-sm">
      <Checkbox id="field-horizontal-digest" defaultChecked />
      <FieldContent>
        <FieldLabel htmlFor="field-horizontal-digest">Weekly digest</FieldLabel>
        <FieldDescription>
          A summary of activity in your workspace, sent every Monday.
        </FieldDescription>
      </FieldContent>
    </Field>
  );
}
