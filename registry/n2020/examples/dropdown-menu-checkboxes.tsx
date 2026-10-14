"use client";

import * as React from "react";
import { Button } from "@/registry/n2020/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/registry/n2020/ui/dropdown-menu";

export default function DropdownMenuCheckboxes() {
  const [showOwner, setShowOwner] = React.useState(true);
  const [showStatus, setShowStatus] = React.useState(true);
  const [showUpdated, setShowUpdated] = React.useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Columns
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Visible columns</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={showOwner}
            onCheckedChange={setShowOwner}
          >
            Owner
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showStatus}
            onCheckedChange={setShowStatus}
          >
            Status
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showUpdated}
            onCheckedChange={setShowUpdated}
          >
            Last updated
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
