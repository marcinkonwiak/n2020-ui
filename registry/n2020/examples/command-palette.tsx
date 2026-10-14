"use client";

import { FilePlusIcon, SearchIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/registry/n2020/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/n2020/ui/command";

export default function CommandPalette() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open command menu
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search projects and actions" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => setOpen(false)}>
              <FilePlusIcon />
              Create project
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <SearchIcon />
              Search invoices
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
