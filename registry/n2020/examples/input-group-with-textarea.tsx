import { ArrowUpIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/registry/n2020/ui/input-group";

export default function InputGroupWithTextarea() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupTextarea placeholder="Write a comment" aria-label="Comment" />
      <InputGroupAddon align="block-end">
        <InputGroupText>Markdown is supported</InputGroupText>
        <InputGroupButton
          variant="default"
          size="icon-xs"
          className="ml-auto"
          aria-label="Send comment"
        >
          <ArrowUpIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
