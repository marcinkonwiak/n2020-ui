import {
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(
  readFileSync(join(root, "registry.config.json"), "utf8"),
);
const registryUrl = process.env.REGISTRY_URL ?? config.url;
const style = `registry/${config.name}`;

const itemTypes = {
  ui: "registry:ui",
  components: "registry:component",
  blocks: "registry:block",
  hooks: "registry:hook",
  lib: "registry:lib",
};

// A block installs as a component file.
const fileTypes = { ...itemTypes, blocks: "registry:component" };

const providedByConsumer = new Set(["react", "react-dom"]);

// Registry files that a shadcn project already has, mapped to the shadcn item
// that provides them. Publishing our copies makes the CLI ask to overwrite the
// stock files. Every project has `cn` at its utils alias.
const providedByShadcn = new Map([
  ["lib/utils", undefined],
  ["hooks/use-mobile", "use-mobile"],
]);

const { dependencies: installedRanges } = JSON.parse(
  readFileSync(join(root, "package.json"), "utf8"),
);

// Utilities that only the theme item defines. A stock shadcn project has
// the other tokens.
const themeOnlyUtility = /\b(font-display|scrollbar-thin)\b/;

// A file that calls a hook or passes an event handler fails to build as a
// React Server Component. Base UI's `useRender` skips its hooks on the server.
const clientOnlyCode = /\buse(?!Render\b)[A-Z]\w*\s*[<(]|\son[A-Z]\w*=\{/;
const clientDirectories = ["ui", "components", "blocks", "examples"];

function packageName(specifier) {
  const segments = specifier.split("/");
  return specifier.startsWith("@")
    ? segments.slice(0, 2).join("/")
    : segments[0];
}

function itemUrl(name) {
  return `${registryUrl}/r/${name}.json`;
}

function readDependencies(source) {
  const dependencies = new Set();
  const registryDependencies = new Set();
  for (const [, specifier] of source.matchAll(/(?:from|import)\s+"([^"]+)"/g)) {
    const local = specifier.match(/^@\/registry\/[^/]+\/([^/]+\/(.+))$/);
    if (local) {
      const [, path, name] = local;
      const dependency = providedByShadcn.has(path)
        ? providedByShadcn.get(path)
        : itemUrl(name);
      if (dependency) registryDependencies.add(dependency);
    } else if (!specifier.startsWith(".") && !specifier.startsWith("@/")) {
      const name = packageName(specifier);
      if (!providedByConsumer.has(name))
        dependencies.add(`${name}@${installedRanges[name]}`);
    }
  }
  if (themeOnlyUtility.test(source)) registryDependencies.add(itemUrl("theme"));
  return {
    dependencies: [...dependencies].sort(),
    registryDependencies: [...registryDependencies].sort(),
  };
}

function titleCase(name) {
  return name
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function docsDescription(name) {
  const page = [`components/${name}.mdx`, `${name}.mdx`]
    .map((path) => join(root, "content/docs", path))
    .find(existsSync);
  return (
    page && readFileSync(page, "utf8").match(/^description:\s*(.+)$/m)?.[1]
  );
}

function sourceItems() {
  return Object.entries(itemTypes).flatMap(([directory, type]) =>
    readdirSync(join(root, style, directory))
      .sort()
      .filter(
        (file) =>
          !providedByShadcn.has(
            `${directory}/${basename(file, extname(file))}`,
          ),
      )
      .map((file) => {
        const path = `${style}/${directory}/${file}`;
        const name = basename(file, extname(file));
        const { dependencies, registryDependencies } = readDependencies(
          readFileSync(join(root, path), "utf8"),
        );
        return {
          name,
          type,
          title: titleCase(name),
          description: docsDescription(name),
          dependencies,
          registryDependencies,
          files: [{ path, type: fileTypes[directory] }],
        };
      }),
  );
}

// Turns CSS into the nested object form of a registry item's `css` field:
// a rule or at-rule maps to an object, a declaration to a string, and a
// statement such as `@apply` or `@import` to an empty object.
function parseCss(css) {
  const tokens = css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split(/([{};])/)
    .map((token) => token.trim())
    .filter(Boolean);
  let position = 0;

  function block() {
    const node = {};
    while (position < tokens.length) {
      const head = tokens[position++];
      if (head === "}") break;
      if (head === ";") continue;
      const next = tokens[position++];
      if (next === "{") {
        node[head.replace(/\s+/g, " ")] = block();
      } else if (head.startsWith("@")) {
        node[head] = {};
      } else {
        const separator = head.indexOf(":");
        node[head.slice(0, separator).trim()] = head
          .slice(separator + 1)
          .trim();
      }
    }
    return node;
  }

  return block();
}

function stripCustomPropertyPrefix(declarations) {
  return Object.fromEntries(
    Object.entries(declarations).map(([name, value]) => [
      name.replace(/^--/, ""),
      value,
    ]),
  );
}

function themeItem() {
  const path = `${style}/theme.css`;
  const {
    "@theme inline": theme,
    ":root": light,
    ".dark": dark,
    "@custom-variant dark (&:is(.dark *))": _consumerDefinesDarkVariant,
    ...css
  } = parseCss(readFileSync(join(root, path), "utf8"));
  // An app can map the radius scale so that it stays rounded when `--radius`
  // is 0, such as `calc(var(--radius) + 4px)`. The colour mappings match the
  // stock ones.
  const mappings = Object.fromEntries(
    Object.entries(theme).filter(([name]) => /^--(font|radius)-/.test(name)),
  );
  const fontPackages = Object.keys(css)
    .map((statement) => statement.match(/^@import "(@fontsource[^"]+)"$/)?.[1])
    .filter(Boolean)
    .map(packageName);

  return {
    name: "theme",
    type: "registry:theme",
    title: "Theme",
    description:
      "Colour tokens, fonts, and scrollbar styles for n2020 components.",
    dependencies: fontPackages,
    cssVars: {
      theme: stripCustomPropertyPrefix(mappings),
      light: stripCustomPropertyPrefix(light),
      dark: stripCustomPropertyPrefix(dark),
    },
    css,
  };
}

const missingDirective = clientDirectories.flatMap((directory) =>
  readdirSync(join(root, style, directory))
    .map((file) => `${style}/${directory}/${file}`)
    .filter((path) => {
      const source = readFileSync(join(root, path), "utf8");
      return clientOnlyCode.test(source) && !source.startsWith('"use client";');
    }),
);
if (missingDirective.length > 0) {
  console.error(
    `These files call a React hook or pass an on* handler. Start each with "use client";\n${missingDirective.map((path) => `  ${path}`).join("\n")}`,
  );
  process.exit(1);
}

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: config.name,
  homepage: config.homepage,
  items: [themeItem(), ...sourceItems()],
};

// `shadcn build` does not delete the files of items that the registry no
// longer has.
rmSync(join(root, "public/r"), { recursive: true, force: true });
writeFileSync(
  join(root, "registry.json"),
  `${JSON.stringify(registry, null, 2)}\n`,
);
console.log(`registry.json: ${registry.items.length} items`);
