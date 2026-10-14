import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/registry/n2020/ui/field";
import { Input } from "@/registry/n2020/ui/input";

export default function FieldInvalid() {
  return (
    <Field data-invalid className="max-w-sm">
      <FieldLabel htmlFor="field-invalid-email">Email</FieldLabel>
      <Input
        id="field-invalid-email"
        type="email"
        defaultValue="ada@example"
        aria-invalid
      />
      <FieldDescription>We send the receipt to this address.</FieldDescription>
      <FieldError>Enter a complete email address.</FieldError>
    </Field>
  );
}
