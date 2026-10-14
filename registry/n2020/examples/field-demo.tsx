import { Button } from "@/registry/n2020/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/registry/n2020/ui/field";
import { Input } from "@/registry/n2020/ui/input";
import { Textarea } from "@/registry/n2020/ui/textarea";

export default function FieldDemo() {
  return (
    <form className="w-full max-w-sm">
      <FieldSet>
        <FieldLegend>Shipping address</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="field-demo-name">Full name</FieldLabel>
            <Input id="field-demo-name" placeholder="Ada Lovelace" />
          </Field>
          <Field>
            <FieldLabel htmlFor="field-demo-notes">Delivery notes</FieldLabel>
            <Textarea id="field-demo-notes" placeholder="Leave at the door." />
            <FieldDescription>The courier sees these notes.</FieldDescription>
          </Field>
          <Field orientation="horizontal">
            <Button type="submit">Save address</Button>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
