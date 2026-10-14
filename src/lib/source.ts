import { llms, loader } from "fumadocs-core/source";
import { applyMdxPreset } from "fumadocs-mdx/config";
import { defineDocs } from "fumadocs-mdx/macro";
import { remarkRegistry } from "./remark-registry";
import { docsRoute } from "./shared";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    async: true,
    mdxOptions: applyMdxPreset({ remarkPlugins: [remarkRegistry] }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
});

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: docsRoute,
});

// <ComponentIndex /> renders the pages of its folder at runtime, so the
// Markdown of the page gets the same list from the page tree.
async function pageMarkdown(
  page: (typeof source)["$inferPage"],
): Promise<string> {
  const text = await page.data.getText("processed");
  const folder = source
    .getPageTree()
    .children.find(
      (node) => node.type === "folder" && node.index?.url === page.url,
    );
  if (!folder || !text.includes("<ComponentIndex />")) return text;
  return text.replace("<ComponentIndex />", await docsLlms.indexNode(folder));
}

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await pageMarkdown(page)}`,
});
