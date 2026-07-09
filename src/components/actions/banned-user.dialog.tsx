import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { BanIcon } from "lucide-react";
import { Field, FieldError, FieldGroup } from "../ui/field";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useForm } from "@tanstack/react-form-start";
import { bannedUserValidation } from "#/validator/user";
import { bannedUserFn } from "#/services/user.function";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const BannedUserDialog = ({ userId }: { userId: string }) => {
	const bannedUser = useServerFn(bannedUserFn);

	const queryClient = useQueryClient();

	const form = useForm({
		defaultValues: {
			userId: userId,
			banReason: "",
			banExpiresIn: "86400",
		},
		validators: {
			onChange: bannedUserValidation,
		},
		onSubmit: ({ value }) => {
			toast.promise(
				async () => {
					const res = await bannedUser({
						data: {
							userId: userId,
							banReason: value.banReason,
							banExpiresIn: value.banExpiresIn,
						},
					});

					if (!res.success) throw new Error(res.message);

					return res;
				},
				{
					loading: "Loading...",
					success: ({ message }) => {
						return {
							message: "Berhasil",
							description: message,
						};
					},
					error: (e) => {
						return {
							message: "Gagal",
							description: e.message || "Terjadi Kesalahan",
						};
					},
					finally: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
				},
			);
		},
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button title="Blokir Pengguna" size="icon-xs" variant="destructive">
					<BanIcon />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Blokir Pengguna</DialogTitle>
					<DialogDescription>
						Tindakan ini akan membatasi akses pengguna ke sistem. Pilih durasi
						pemblokiran yang sesuai di bawah ini.
					</DialogDescription>
				</DialogHeader>
				<form
					id="ban-user-form"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<FieldGroup>
						<form.Field
							name="banExpiresIn"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<Label htmlFor={field.name}>Di Blokir Sampai</Label>
										<Select
											name={field.name}
											value={field.state.value}
											onValueChange={field.handleChange}
											defaultValue="86400"
										>
											<SelectTrigger id={field.name} aria-invalid={isInvalid}>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectItem value="86400">24 Jam</SelectItem>
													<SelectItem value="604800">1 Minggu</SelectItem>
													<SelectItem value="2592000">1 Bulan</SelectItem>
													<SelectItem value="9999999999">Permanen</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
									</Field>
								);
							}}
						/>

						<form.Field
							name="banReason"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<Label htmlFor={field.name}>Alasan Pembelokirian</Label>
										<Textarea
											placeholder="Masukan alasan kenapa dibelokir"
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											autoComplete="off"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
					</FieldGroup>
				</form>

				<DialogFooter showCloseButton>
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
						children={([canSubmit, isSubmitting]) => (
							<Button type="submit" form="ban-user-form" disabled={!canSubmit}>
								{isSubmitting ? "Loading..." : "Simpan"}
							</Button>
						)}
					/>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
