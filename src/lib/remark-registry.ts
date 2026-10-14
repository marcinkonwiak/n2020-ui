import { readFileSync } from "node:fs";
import { withConsumerImports } from "./consumer-imports";

const registryConfig: { name: string; url: string } = JSON.parse(
  readFileSync("registry.config.json", "utf8"),
);

type Node = {
  type: string;
  name?: string;
  attributes?: { name: string; value: unknown }[];
  children?: Node[];
  lang?: string;
  value?: string;
};

function nameAttribute(node: Node) {
  const value = node.attributes?.find(
    (attribute) => attribute.name === "name",
  )?.value;
  if (typeof value !== "string")
    throw new Error(`<${node.name}> needs a name attribute`);
  return value;
}

function exampleSource(name: string) {
  return withConsumerImports(
    readFileSync(
      `registry/${registryConfig.name}/examples/${name}.tsx`,
      "utf8",
    ),
    registryConfig.name,
  );
}

function expand(node: Node): Node {
  if (node.type !== "mdxJsxFlowElement") {
    return { ...node, children: node.children?.map(expand) };
  }
  if (node.name === "ComponentPreview") {
    const source = exampleSource(nameAttribute(node));
    return {
      ...node,
      children: [{ type: "code", lang: "tsx", value: source }],
    };
  }
  if (node.name === "Install") {
    const url = `${registryConfig.url}/r/${nameAttribute(node)}.json`;
    return {
      type: "code",
      lang: "bash",
      value: `pnpm dlx shadcn@latest add ${url}`,
    };
  }
  return { ...node, children: node.children?.map(expand) };
}

/**
 * Gives `<ComponentPreview>` the source of its example as a code block and
 * turns `<Install>` into the shadcn command, so that the MDX compiler
 * highlights both at build time.
 */
export function remarkRegistry() {
  return (tree: Node) => {
    tree.children = tree.children?.map(expand);
  };
}
