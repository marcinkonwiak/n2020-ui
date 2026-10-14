import { createFileRoute, getRouteApi, Outlet } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteSidebar } from "@/components/site-sidebar";
import { SidebarInset, SidebarProvider } from "@/registry/n2020/ui/sidebar";
import { TooltipProvider } from "@/registry/n2020/ui/tooltip";

export const Route = createFileRoute("/_shell")({
  component: Shell,
});

const root = getRouteApi("__root__");

function Shell() {
  const { nav } = root.useLoaderData();
  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 60)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as CSSProperties
        }
      >
        <SiteSidebar groups={nav} />
        <SidebarInset className="min-w-0">
          <SiteHeader groups={nav} />
          <div className="flex min-w-0 flex-1 flex-col">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
