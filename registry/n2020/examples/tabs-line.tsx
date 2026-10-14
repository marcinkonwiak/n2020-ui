import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/n2020/ui/tabs";

export default function TabsLine() {
  return (
    <Tabs defaultValue="preview" className="w-full max-w-sm">
      <TabsList variant="line">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="preview" className="pt-2 text-muted-foreground">
        The rendered page appears here.
      </TabsContent>
      <TabsContent value="code" className="pt-2 text-muted-foreground">
        The source of the page appears here.
      </TabsContent>
      <TabsContent value="history" className="pt-2 text-muted-foreground">
        Four revisions exist for this page.
      </TabsContent>
    </Tabs>
  );
}
