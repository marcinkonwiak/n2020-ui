import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/n2020/ui/tabs";

export default function TabsVertical() {
  return (
    <Tabs
      defaultValue="profile"
      orientation="vertical"
      className="w-full max-w-sm"
    >
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="tokens">Tokens</TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="text-muted-foreground">
        Change your name and email address.
      </TabsContent>
      <TabsContent value="security" className="text-muted-foreground">
        Change your password and second factor.
      </TabsContent>
      <TabsContent value="tokens" className="text-muted-foreground">
        Create and revoke API tokens.
      </TabsContent>
    </Tabs>
  );
}
