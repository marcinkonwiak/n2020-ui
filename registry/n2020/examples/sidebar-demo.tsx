"use client";

import { BoxIcon, KeyRoundIcon, RocketIcon, SettingsIcon } from "lucide-react";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/registry/n2020/ui/sidebar";

const items = [
  { title: "Services", icon: BoxIcon },
  { title: "Deploys", icon: RocketIcon },
  { title: "Secrets", icon: KeyRoundIcon },
  { title: "Settings", icon: SettingsIcon },
];

export default function SidebarDemo() {
  const [active, setActive] = useState("Services");

  return (
    <div className="h-80 w-full overflow-hidden border">
      {/* collapsible="none" keeps the sidebar in the flow instead of fixed to the viewport. */}
      <SidebarProvider className="h-full min-h-0">
        <Sidebar collapsible="none" className="border-r">
          <SidebarHeader className="px-4 py-3 text-sm font-medium">
            Acme Cloud
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Project</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={item.title === active}
                        onClick={() => setActive(item.title)}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="px-4 py-3 text-xs text-muted-foreground">
            ada@example.com
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="p-6">
          <h3 className="text-sm font-medium">{active}</h3>
          <p className="text-sm text-muted-foreground">
            Select an item in the sidebar to change this panel.
          </p>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
