import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/n2020/ui/tabs";

export default function TabsDemo() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="usage">Usage</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-muted-foreground">
        Three services run in this project. All of them are healthy.
      </TabsContent>
      <TabsContent value="usage" className="text-muted-foreground">
        The project used 62% of its monthly request quota.
      </TabsContent>
      <TabsContent value="billing" className="text-muted-foreground">
        The next invoice is due on April 1.
      </TabsContent>
    </Tabs>
  );
}
