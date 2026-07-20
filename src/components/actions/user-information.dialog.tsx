import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { InfoIcon } from "lucide-react";
import { UserInformationContent } from "../tabs-content/user-information";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "#/lib/auth-client";
import { UserActiveSessionCard } from "../tabs-content/user-active-session.card";
import { ChangeUserPasswordTab } from "../tabs-content/change-password";

export const UserInformationDialog = ({ userId }: { userId: string }) => {
	const { data: session } = authClient.useSession();

	const { data: user, isLoading } = useQuery({
		queryKey: ["user", userId],
		queryFn: async () => {
			const { data, error } = await authClient.admin.getUser({
				query: {
					id: userId,
				},
			});

			if (error) throw new Error(error.message);
			return data;
		},
		retry: 5,
		enabled: !!userId,
	});

	const { data: sessions } = useQuery({
		queryKey: ["user-sessions", userId],
		queryFn: async () => {
			const { data, error } = await authClient.admin.listUserSessions({
				userId,
			});

			if (error) throw new Error(error.message);

			return data.sessions;
		},
		retry: 5,
		enabled: !!userId,
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="icon-xs">
					<InfoIcon />
				</Button>
			</DialogTrigger>
			<DialogContent
				showCloseButton={false}
				className="min-w-sm md:min-w-3xl max-w-4xl"
			>
				<Tabs defaultValue="info" orientation="vertical" className="min-h-96">
					<TabsList variant="line">
						<TabsTrigger value="info">Informasi Akun</TabsTrigger>
						<TabsTrigger value="session">Active Sessions</TabsTrigger>
						<TabsTrigger value="akun">Pengaturan Akun</TabsTrigger>
					</TabsList>
					<TabsContent value="info">
						<h1 className="text-xl font-semibold">Data Pengguna</h1>
						<p className="text-sm text-foreground mb-4">
							Lihat dan ubah detail profil, informasi kontak, serta status
							pengguna.
						</p>
						{!isLoading && user && <UserInformationContent userData={user} />}
					</TabsContent>
					<TabsContent value="session">
						<h1 className="text-xl font-semibold">Sesi Aktif</h1>
						<p className="text-sm text-foreground mb-4">
							Pantau perangkat yang terhubung dan paksa keluar (force logout)
							sesi yang mencurigakan.
						</p>
						<UserActiveSessionCard
							sessions={sessions}
							currentSessionId={session?.session.id}
						/>
					</TabsContent>
					<TabsContent value="akun">
						<h1 className="text-xl font-semibold">Manajemen Akun</h1>
						<p className="text-sm text-foreground mb-4">
							Atur ulang kata sandi, ubah hak akses (role), atau nonaktifkan
							akun pengguna.
						</p>
						<ChangeUserPasswordTab userId={userId} />
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
};
