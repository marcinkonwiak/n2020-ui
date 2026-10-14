import { useLocation } from "@tanstack/react-router";
import Link from "fumadocs-core/link";
import { Logo } from "@/components/logo";
import type { NavGroup } from "@/lib/nav";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/registry/n2020/ui/sidebar";

export function usePathname() {
  return useLocation({
    select: (location) => location.pathname.replace(/(.)\/$/, "$1"),
  });
}

export function SiteSidebar({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  let index = 0;
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="h-(--header-height) flex-row items-center justify-between border-b border-sidebar-border px-4 py-0">
        <Link
          href="/"
          aria-label="n2020 home"
          className="outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
          <Logo />
        </Link>
        <span className="font-mono text-[10px] tracking-[0.18em] text-sidebar-foreground/50 uppercase">
          Registry
        </span>
      </SidebarHeader>
      <SidebarContent className="gap-0 pt-2 pb-6">
        {groups.map((group) => (
          <SidebarGroup key={group.label ?? "start"}>
            {group.label && (
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            )}
            <SidebarMenu>
              {group.items.map((item) => {
                index += 1;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      isActive={pathname === item.url}
                      render={
                        <Link
                          href={item.url}
                          onClick={() => setOpenMobile(false)}
                        />
                      }
                    >
                      <span className="flex-1 truncate">{item.title}</span>
                      <span className="text-[10px] opacity-50">
                        {String(index).padStart(2, "0")}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
