import { getRouteApi } from "@tanstack/react-router";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { Fragment } from "react";
import { componentsUrl } from "@/lib/nav";

const root = getRouteApi("__root__");

const { a: A, h2: H2, table: Table } = defaultMdxComponents;

/** Lists the component pages in the groups and order of the sidebar. */
export function ComponentIndex() {
  const { nav } = root.useLoaderData();
  const groups = nav
    .map((group) => ({
      label: group.label,
      items: group.items.filter((item) =>
        item.url.startsWith(`${componentsUrl}/`),
      ),
    }))
    .filter((group) => group.items.length > 0);
  return groups.map((group) => (
    <Fragment key={group.label}>
      {group.label && <H2 id={group.label.toLowerCase()}>{group.label}</H2>}
      <Table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {group.items.map((item) => (
            <tr key={item.url}>
              <td>
                <A href={item.url}>{item.title}</A>
              </td>
              <td>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Fragment>
  ));
}
