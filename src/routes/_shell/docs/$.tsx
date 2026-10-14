import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { AnchorProvider } from "fumadocs-core/toc";
import { Suspense, use } from "react";
import { useMDXComponents } from "@/components/mdx";
import { Toc } from "@/components/toc";
import { pageHead } from "@/lib/head";
import { appName } from "@/lib/shared";
import { docs, source } from "@/lib/source";
import { PageHeader } from "@/registry/n2020/components/page-header";

export const Route = createFileRoute("/_shell/docs/$")({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split("/").filter(Boolean) ?? [];
    const data = await serverLoader({ data: slugs });
    await docs.getPage(data.path)?.preload();
    return data;
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageHead({
          title: `${loaderData.title} · ${appName}`,
          description: loaderData.description,
          path: loaderData.url,
        })
      : {},
});

const serverLoader = createServerFn({
  method: "GET",
})
  .validator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs);
    if (!page) throw notFound();
    return {
      path: page.path,
      url: page.url,
      title: page.data.title,
      description: page.data.description,
    };
  });

function Content({ path }: { path: string }) {
  const page = docs.getPage(path);
  if (!page) throw new Error(`unknown page: ${path}`);

  const { toc } = use(page.load());
  const MDX = page.body;

  return (
    <AnchorProvider toc={toc}>
      <PageHeader title={page.title} eyebrow={page.description} />
      <div className="flex min-w-0 justify-between gap-12 px-4 py-10 lg:px-8">
        <article className="prose min-w-0 max-w-3xl flex-1">
          <MDX components={useMDXComponents()} />
        </article>
        <Toc toc={toc} />
      </div>
    </AnchorProvider>
  );
}

function Page() {
  const { path } = Route.useLoaderData();
  return (
    <Suspense>
      <Content path={path} />
    </Suspense>
  );
}
