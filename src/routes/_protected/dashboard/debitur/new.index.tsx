import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_protected/dashboard/debitur/new/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid grid-cols-8">
      <div className="col-span-5">
        <h1 className="text-2xl font-semibold mb-4">Data Calon Anggota</h1>
        <Tabs defaultValue="account" className="w-full">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </div>
      <aside className="shadow-sm w-full h-full p-4 col-span-3">
        <h2 className="text-xl font-semibold mb-2">Informasi Calon Debitur</h2>
        <ul>
          <li>Name Lengkap</li>
          <li>Junai</li>
        </ul>
      </aside>
    </div>
  );
}
