import { BookmarkIcon } from "lucide-react";
import { Toggle } from "@/registry/n2020/ui/toggle";

export default function ToggleOutline() {
  return (
    <Toggle variant="outline" defaultPressed>
      <BookmarkIcon />
      Bookmark
    </Toggle>
  );
}
