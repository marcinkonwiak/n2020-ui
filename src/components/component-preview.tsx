import { type ComponentType, lazy, type ReactNode, Suspense } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/n2020/ui/tabs";

const examplesDirectory = "../../registry/n2020/examples/";

const demos = Object.fromEntries(
  Object.entries(
    import.meta.glob<{ default: ComponentType }>(
      "../../registry/n2020/examples/*.tsx",
    ),
  ).map(([path, load]) => [
    path.slice(examplesDirectory.length, -".tsx".length),
    lazy(load),
  ]),
);

export function Demo({ name }: { name: string }) {
  const Example = demos[name];
  if (!Example) throw new Error(`unknown example: ${name}`);
  return (
    <Suspense>
      <Example />
    </Suspense>
  );
}

/** `children` is the highlighted source, which `remarkRegistry` adds. */
export function ComponentPreview({
  name,
  children,
}: {
  name: string;
  children?: ReactNode;
}) {
  return (
    <Tabs defaultValue="preview" className="not-prose my-6 gap-0 border">
      <div className="flex items-center justify-between border-b pr-4 pl-2">
        <TabsList variant="line">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <span className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
          {name}
        </span>
      </div>
      <TabsContent
        value="preview"
        className="preview-grid flex min-h-80 items-center justify-center p-6 lg:p-10"
      >
        <Demo name={name} />
      </TabsContent>
      <TabsContent value="code" className="preview-code">
        {children}
      </TabsContent>
    </Tabs>
  );
}
