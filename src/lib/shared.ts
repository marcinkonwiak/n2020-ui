export const appName = "n2020";
export const appDescription =
  "A shadcn registry of square-cornered, dithered components built on Base UI.";
export const docsRoute = "/docs";

export const gitConfig = {
  user: "marcinkonwiak",
  repo: "n2020-ui",
};

/** @returns page slugs */
export function decodeMarkdownUrl(segments: string[]) {
  if (segments.length === 0) return [];

  const out = [...segments];
  out[out.length - 1] = out[out.length - 1].replace(/\.md$/, "");
  if (out.length === 1 && out[0] === "index") out.pop();
  return out;
}
