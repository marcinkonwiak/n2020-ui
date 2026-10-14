import { useNavigate } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { GithubLink, ThemeToggle } from "@/components/site-actions";
import { usePathname } from "@/components/site-sidebar";
import type { NavGroup } from "@/lib/nav";
import { Button } from "@/registry/n2020/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/n2020/ui/command";
import { Kbd, KbdGroup } from "@/registry/n2020/ui/kbd";
import { Separator } from "@/registry/n2020/ui/separator";
import { SidebarTrigger } from "@/registry/n2020/ui/sidebar";

export function SiteHeader({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  const navigate = useNavigate();
  const [commandOpen, setCommandOpen] = useState(false);
  const group = groups.find((group) =>
    group.items.some((item) => item.url === pathname),
  );
  const page = group?.items.find((item) => item.url === pathname);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-20 flex h-(--header-height) shrink-0 items-center border-b bg-background">
        <div className="flex w-full items-center gap-3 px-4">
          <SidebarTrigger className="-ml-1" size="icon-sm" />
          <Separator
            orientation="vertical"
            className="h-4 data-vertical:self-auto"
          />
          <p className="hidden font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase lg:block">
            n2020
            {group?.label && (
              <>
                <span className="px-1 text-primary">/</span>
                {group.label}
              </>
            )}
            <span className="px-1 text-primary">/</span>
            <span className="text-foreground">{page?.title}</span>
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-8 justify-start font-mono text-xs tracking-[0.08em] uppercase sm:w-60 lg:ml-3"
            aria-label="Go to..."
            aria-keyshortcuts="Meta+K Control+K"
            onClick={() => setCommandOpen(true)}
          >
            <SearchIcon data-icon="inline-start" />
            <span className="hidden opacity-60 sm:inline">Go to...</span>
            <KbdGroup className="ml-auto hidden sm:inline-flex">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </Button>
          <div className="ml-auto flex items-center gap-1">
            <GithubLink />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <CommandDialog
        open={commandOpen}
        onOpenChange={setCommandOpen}
        title="Go to..."
        description="Choose a page to open."
      >
        <CommandInput placeholder="Go to..." autoFocus />
        <CommandList>
          <CommandEmpty>No pages found.</CommandEmpty>
          {groups.map((group) => (
            <CommandGroup
              key={group.label ?? "start"}
              heading={group.label ?? "Start"}
            >
              {group.items.map((item) => (
                <CommandItem
                  key={item.url}
                  value={item.title}
                  onSelect={() => {
                    setCommandOpen(false);
                    void navigate({ href: item.url });
                  }}
                >
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
