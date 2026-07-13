import { authClient } from "#/lib/auth-client";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	SmartphoneIcon,
	MonitorIcon,
	MapPinIcon,
	KeyIcon,
	CalendarIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { formatDate } from "#/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface SessionData {
	id: string;
	userId: string;
	token: string;
	ipAddress?: string | undefined | null;
	userAgent?: string | undefined | null;
	createdAt: Date;
	updatedAt: Date;
	expiresAt: Date;
	impersonatedBy?: string | undefined | null;
}

export const UserActiveSessionCard = ({
	sessions,
	currentSessionId,
}: {
	sessions: SessionData[] | undefined;
	currentSessionId: string | undefined;
}) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ token }: { token: string }) => {
			toast.promise(
				async () => {
					const { data, error } = await authClient.admin.revokeUserSession({
						sessionToken: token,
					});
					if (error) throw new Error(error.message);
					return data;
				},
				{
					success: () => {
						return {
							message: "Berhasil",
							description: "Berhasil menghapus sessions",
						};
					},
					error: (e) => {
						return {
							message: "Gagal",
							description: e.message || "Gagal menghapus sessions",
						};
					},
					finally: () =>
						queryClient.invalidateQueries({ queryKey: ["user-sessions"] }),
				},
			);
		},
	});

	return (
		<div className="grid grid-cols-1 gap-4 p-4">
			{sessions?.map((session) => {
				const isMobile = /Mobi|Android|iPhone/i.test(session?.userAgent || "");
				const isCurrentDevice = session?.id === currentSessionId;

				return (
					<Card
						key={session?.id}
						className={`w-full border shadow-sm flex flex-col justify-between ${isCurrentDevice ? "border-green-500 ring-1 ring-green-500/30" : ""
							}`}
					>
						<CardHeader className="flex flex-row items-center space-x-4 pb-4">
							<div
								className={`p-2 rounded-lg ${isMobile ? "bg-orange-200 text-orange-600" : "bg-blue-200 text-blue-600"}`}
							>
								{isMobile ? (
									<SmartphoneIcon className="h-5 w-5" />
								) : (
									<MonitorIcon className="h-5 w-5" />
								)}
							</div>

							<div className="flex-1 min-w-0">
								<CardTitle className="text-sm font-semibold flex items-center gap-2 flex-wrap">
									<span>{isMobile ? "Mobile" : "Desktop"}</span>
									{isCurrentDevice ? (
										<span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-green-500 text-white animate-pulse">
											Sesi Ini (Aktif)
										</span>
									) : (
										<span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">
											Perangkat Lain
										</span>
									)}
								</CardTitle>
								<CardDescription className="text-xs truncate font-mono">
									ID: {session?.id}
								</CardDescription>
							</div>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="flex items-center gap-2.5">
								<MapPinIcon className="h-4 w-4 text-foreground/70" />
								<span className="text-foreground font-medium">
									{session?.ipAddress}
								</span>
							</div>
							<div className="flex items-center gap-2.5">
								<KeyIcon className="h-4 w-4 text-foreground/70" />
								<span
									className="font-mono text-xs truncate"
									title={session?.token}
								>
									Token: {session?.token.substring(0, 10)}...
								</span>
							</div>
							<div className="pt-3 border-t border-border space-y-1.5 text-xs text-muted-foreground">
								<div className="flex justify-between">
									<span className="flex items-center gap-1">
										<CalendarIcon className="h-3 w-3" /> Login
									</span>
									<span className="font-medium text-foreground">
										{formatDate(session?.createdAt)}
									</span>
								</div>
								<div className="flex justify-between">
									<span>Expired</span>
									<span className="font-medium text-destructive">
										{formatDate(session?.expiresAt)}
									</span>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button
								variant={isCurrentDevice ? "outline" : "destructive"}
								size="sm"
								className="w-full"
								onClick={() => mutation.mutate({ token: session?.token })}
								disabled={mutation.isPending}
							>
								{mutation.isPending
									? "Loading..."
									: isCurrentDevice
										? "Log Out dari Akun"
										: "Putuskan Sesi / Log Out"}
							</Button>
						</CardFooter>
					</Card>
				);
			})}
		</div>
	);
};
