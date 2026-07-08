import * as React from "react";
import {
	BookSearchIcon,
	Building2Icon,
	PencilRulerIcon,
	Settings2,
	UsersIcon,
	WalletCardsIcon,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { authClient } from "#/lib/auth-client";

const data = {
	navMain: [
		{
			title: "Data Anggota",
			url: "#",
			icon: UsersIcon,
			isActive: true,
			items: [
				{
					title: "Perorangan",
					url: "/dashboard/debitur",
				},
				{
					title: "Perusahaan/Korporasi",
					url: "#",
				},
			],
		},
		{
			title: "Kredit Perorangan",
			url: "#",
			icon: WalletCardsIcon,
			items: [
				{
					title: "Genesis",
					url: "#",
				},
				{
					title: "Explorer",
					url: "#",
				},
				{
					title: "Quantum",
					url: "#",
				},
			],
		},
		{
			title: "Kredit Perusahaan",
			url: "#",
			icon: Building2Icon,
			items: [
				{
					title: "Introduction",
					url: "#",
				},
				{
					title: "Get Started",
					url: "#",
				},
				{
					title: "Tutorials",
					url: "#",
				},
				{
					title: "Changelog",
					url: "#",
				},
			],
		},
		{
			title: "Laporan",
			url: "#",
			icon: BookSearchIcon,
			items: [
				{
					title: "General",
					url: "#",
				},
				{
					title: "Team",
					url: "#",
				},
				{
					title: "Billing",
					url: "#",
				},
				{
					title: "Limits",
					url: "#",
				},
			],
		},
		{
			title: "Settings",
			url: "#",
			icon: Settings2,
			items: [
				{
					title: "User Management",
					url: "/dashboard/user-management",
				},
				{
					title: "Team",
					url: "#",
				},
				{
					title: "Billing",
					url: "#",
				},
				{
					title: "Limits",
					url: "#",
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { data: session } = authClient.useSession();

	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link to="/dashboard">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<PencilRulerIcon className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-bold">AZAZ BANK</span>
									<span className="truncate text-xs">
										Tools Simulasi Kredit
									</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser
					user={{
						name: session?.user.name ?? "Nur",
						email: session?.user.email ?? "nur@exmaple.com",
						avatar: session?.user.image ?? "",
						role: session?.user.role ?? "IRT",
					}}
				/>
			</SidebarFooter>
		</Sidebar>
	);
}
