import { createServerFn } from "@tanstack/react-start";
import type { Item, Node } from "fumadocs-core/page-tree";
import { source } from "@/lib/source";

export type NavItem = { title: string; url: string; description?: string };
export type NavGroup = { label: string | null; items: NavItem[] };

export const blocksUrl = "/blocks";
export const componentsUrl = "/docs/components";

function navItem(page: Item): NavItem {
  return {
    title: String(page.name),
    url: page.url,
    description: page.description ? String(page.description) : undefined,
  };
}

// A separator or a folder in the page tree starts a group. The index page of
// a folder goes in the group before it.
function docsGroups(nodes: Node[], label: string | null): NavGroup[] {
  const groups: NavGroup[] = [];
  let current: NavGroup = { label, items: [] };
  for (const node of nodes) {
    if (node.type === "page") {
      current.items.push(navItem(node));
      continue;
    }
    if (node.type === "folder" && node.index) {
      current.items.push(navItem(node.index));
    }
    groups.push(current);
    if (node.type === "separator") {
      current = { label: String(node.name), items: [] };
    } else {
      groups.push(...docsGroups(node.children, String(node.name)));
      current = { label: null, items: [] };
    }
  }
  groups.push(current);
  return groups.filter((group) => group.items.length > 0);
}

export const getNav = createServerFn({ method: "GET" }).handler(
  async (): Promise<NavGroup[]> => {
    const [start, ...components] = docsGroups(
      source.getPageTree().children,
      null,
    );
    return [
      {
        label: null,
        items: [...start.items, { title: "Blocks", url: blocksUrl }],
      },
      ...components,
    ];
  },
);
