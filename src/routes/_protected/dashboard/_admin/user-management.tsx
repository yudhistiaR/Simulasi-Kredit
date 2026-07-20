import { createFileRoute, redirect } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserTable } from "#/components/table/users";
import { getSession } from "#/services/auth.function";

export const Route = createFileRoute(
	"/_protected/dashboard/_admin/user-management",
)({
	beforeLoad: async () => {
		const session = await getSession();

		if (session?.user.role !== "admin") {
			throw redirect({ to: "/dashboard" });
		}

		return { user: session.user };
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Tabs defaultValue="account">
			<TabsList className="w-full">
				<TabsTrigger value="account">All Users</TabsTrigger>
				<TabsTrigger value="ac">Access Control</TabsTrigger>
				<TabsTrigger value="as">Active Sessions</TabsTrigger>
				<TabsTrigger value="sl">Security Logs</TabsTrigger>
			</TabsList>
			<TabsContent value="account">
				<UserTable />
			</TabsContent>
			<TabsContent value="ac">Change your password here.</TabsContent>
			<TabsContent value="as">Change your password here.</TabsContent>
			<TabsContent value="sl">Change your password here.</TabsContent>
		</Tabs>
	);
}
