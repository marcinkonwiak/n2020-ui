import { createShikiFactory } from "fumadocs-core/highlight/shiki";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock.core";
import { type ComponentType, lazy, use } from "react";
import { withConsumerImports } from "@/lib/consumer-imports";
import { cn } from "@/registry/n2020/lib/utils";
import registryConfig from "../../registry.config.json";

const blocksDirectory = "../../registry/n2020/blocks/";

const blocks = Object.fromEntries(
  Object.entries(
    import.meta.glob<{ default: ComponentType }>(
      "../../registry/n2020/blocks/*.tsx",
    ),
  ).map(([path, load]) => [
    path.slice(blocksDirectory.length, -".tsx".length),
    lazy(load),
  ]),
);

const sourceLoaders = import.meta.glob<string>(
  "../../registry/n2020/blocks/*.tsx",
  { query: "?raw", import: "default" },
);

const sources = new Map<string, Promise<string>>();

function blockSource(name: string) {
  let source = sources.get(name);
  if (!source) {
    const load = sourceLoaders[`${blocksDirectory}${name}.tsx`];
    if (!load) throw new Error(`unknown block: ${name}`);
    source = load().then((raw) =>
      withConsumerImports(raw, registryConfig.name),
    );
    sources.set(name, source);
  }
  return source;
}

// The block source is TSX. A highlighter with only that grammar keeps the
// other Shiki grammars out of the bundles.
const highlighter = createShikiFactory({
  async init() {
    const { createHighlighterCore } = await import("shiki/core");
    const { createJavaScriptRegexEngine } = await import(
      "shiki/engine/javascript"
    );
    return createHighlighterCore({
      langs: [import("shiki/langs/tsx.mjs")],
      themes: [
        import("shiki/themes/github-light.mjs"),
        import("shiki/themes/github-dark.mjs"),
      ],
      engine: createJavaScriptRegexEngine(),
    });
  },
});

export const blockNames = Object.keys(blocks).sort();

export function Block({ name }: { name: string }) {
  const Component = blocks[name];
  if (!Component) throw new Error(`unknown block: ${name}`);
  return <Component />;
}

/**
 * The shadcn CLI only writes the theme's CSS variables when the command
 * names the theme, so a block installs together with it.
 */
export function blockInstallItems(name: string) {
  return ["theme", name];
}

export function blockViewUrl(name: string) {
  return `/view/${name}`;
}

/**
 * A block runs in a frame so that its fixed sidebar and its breakpoints
 * follow the frame, not the page around it.
 */
export function BlockFrame({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <iframe
      src={blockViewUrl(name)}
      title={`${name} block`}
      className={cn("block w-full border bg-background", className)}
    />
  );
}

/** The source of a block, as the shadcn CLI installs it. */
export function BlockSource({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <DynamicCodeBlock
      lang="tsx"
      code={use(blockSource(name))}
      highlighter={() => highlighter.getOrInit()}
      options={{ themes: { light: "github-light", dark: "github-dark" } }}
      codeblock={{
        title: `components/${name}.tsx`,
        className: cn("flex flex-col", className),
        viewportProps: { className: "max-h-none min-h-0 flex-1" },
      }}
    />
  );
}
