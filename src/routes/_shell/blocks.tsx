import { createFileRoute } from "@tanstack/react-router";
import Link from "fumadocs-core/link";
import { Suspense } from "react";
import {
  BlockFrame,
  BlockSource,
  blockInstallItems,
  blockNames,
  blockViewUrl,
} from "@/components/block-view";
import { InstallCommand } from "@/components/install-command";
import { pageHead } from "@/lib/head";
import { blocksUrl } from "@/lib/nav";
import { appName } from "@/lib/shared";
import { PageHeader } from "@/registry/n2020/components/page-header";
import { buttonVariants } from "@/registry/n2020/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/n2020/ui/tabs";

export const Route = createFileRoute("/_shell/blocks")({
  component: Blocks,
  head: () =>
    pageHead({
      title: `Blocks · ${appName}`,
      description: "Whole pages built from n2020 components.",
      path: blocksUrl,
    }),
});

function Blocks() {
  return (
    <>
      <PageHeader
        title="Blocks"
        eyebrow="Whole pages built from n2020 components."
      />
      <div className="flex flex-col gap-12 px-4 py-10 lg:px-8">
        {blockNames.map((name) => (
          <Tabs
            key={name}
            defaultValue="preview"
            render={<section />}
            className="gap-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-6">
                <h2 className="font-display text-4xl leading-none capitalize">
                  {name}
                </h2>
                <TabsList variant="line">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                </TabsList>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <InstallCommand items={blockInstallItems(name)} />
                <Link
                  href={blockViewUrl(name)}
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  Open full screen
                </Link>
              </div>
            </div>
            <TabsContent value="preview">
              <BlockFrame name={name} className="h-[720px]" />
            </TabsContent>
            <TabsContent
              value="code"
              className="preview-code h-[720px] flex-none border"
            >
              <Suspense>
                <BlockSource name={name} className="h-full" />
              </Suspense>
            </TabsContent>
          </Tabs>
        ))}
        <p className="text-sm text-muted-foreground">
          More blocks are on the way.
        </p>
      </div>
    </>
  );
}
