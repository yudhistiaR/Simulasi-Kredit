import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "@tanstack/react-form-start";
import {
	createUser as createUserValidation,
	type CreateUserInput,
} from "#/validator/user";
import { useState } from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "../ui/input-group";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { createUserFn } from "#/services/user.function";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { UserRole } from "#/types/user";

export const CreateUserSheet = () => {
	const [visibility, setVisibility] = useState<boolean>(false);

	const createUser = useServerFn(createUserFn);
	const queryClient = useQueryClient();

	const form = useForm({
		defaultValues: {
			username: "",
			name: "",
			email: "",
			password: "",
			role: "account_officer",
		} as CreateUserInput,
		validators: {
			onChange: createUserValidation,
		},
		onSubmit: async ({ value, formApi }) => {
			toast.promise(
				async () => {
					const response = await createUser({
						data: {
							name: value.name,
							username: value.username,
							email: value.email,
							password: value.password,
							role: value.role,
						},
					});

					if (!response.success) throw new Error(response.message);

					return response;
				},
				{
					loading: "Loading...",
					success: (data) => {
						formApi.reset();

						return {
							message: "Registrasi Berhasil",
							description: data?.message || "User berhasil terregistrasi",
						};
					},
					error: (e) => {
						return {
							message: "Registrasi Gagal",
							description: e.message || "User gagal terregistrasi",
						};
					},
					finally: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
				},
			);
		},
	});

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button>Pengguna Baru</Button>
			</SheetTrigger>
			<SheetContent showCloseButton={false}>
				<SheetHeader>
					<SheetTitle>TAMBAH PENGGUNA BARU</SheetTitle>
					<SheetDescription>
						Daftarkan pengguna baru dan atur hak akses mereka ke dalam sistem.
					</SheetDescription>
				</SheetHeader>
				<form
					id="create-user-form"
					onSubmit={(e) => {
						e.stopPropagation();
						e.preventDefault();
						form.handleSubmit();
					}}
					className="px-4 overflow-y-auto scrollbar-thin"
				>
					<FieldSet>
						<FieldGroup>
							<form.Field
								name="username"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Username</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="Masukkan username"
												autoComplete="off"
											/>
											{isInvalid ? (
												<FieldError errors={field.state.meta.errors} />
											) : (
												<FieldDescription>
													Akan di gunakna untuk login.
												</FieldDescription>
											)}
										</Field>
									);
								}}
							/>

							<form.Field
								name="name"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>
												Nama Pengguna
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="Masukkan nama pengguna"
												autoComplete="off"
											/>
											{isInvalid ? (
												<FieldError errors={field.state.meta.errors} />
											) : (
												<FieldDescription>
													Akan ditampilkan pada profil, email, dan dokumen
													resmi.
												</FieldDescription>
											)}
										</Field>
									);
								}}
							/>

							<form.Field
								name="email"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Email</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="Alamat Email"
												autoComplete="off"
												type="email"
											/>
											{isInvalid ? (
												<FieldError errors={field.state.meta.errors} />
											) : (
												<FieldDescription>
													Digunakan untuk login, notifikasi sistem, dan
													pemulihan akun.
												</FieldDescription>
											)}
										</Field>
									);
								}}
							/>

							<form.Field
								name="password"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Password</FieldLabel>
											<InputGroup>
												<InputGroupInput
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													aria-invalid={isInvalid}
													placeholder="********"
													autoComplete="off"
													type={visibility ? "text" : "password"}
												/>
												<InputGroupAddon align="inline-end">
													<InputGroupButton
														onClick={() => setVisibility(!visibility)}
													>
														{visibility ? <EyeIcon /> : <EyeOffIcon />}
													</InputGroupButton>
												</InputGroupAddon>
											</InputGroup>
											{isInvalid ? (
												<FieldError errors={field.state.meta.errors} />
											) : (
												<FieldDescription>
													Minimal password 8 karakter
												</FieldDescription>
											)}
										</Field>
									);
								}}
							/>

							<form.Field
								name="role"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Hak Akses</FieldLabel>
											<Select
												name={field.name}
												value={field.state.value}
												onValueChange={(value) =>
													field.handleChange(value as UserRole)
												}
												defaultValue="account_officer"
											>
												<SelectTrigger id={field.name} aria-invalid={isInvalid}>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="account_officer">
														Account Officer
													</SelectItem>
													<SelectItem value="pe_bisnis">PE Bisnis</SelectItem>
													<SelectItem value="menrisk">Menrisk</SelectItem>
													<SelectItem value="direktur_kepatuhan">
														Direktur Kepatuhan
													</SelectItem>
													<SelectItem value="direktur_umum">
														Direktur Umum
													</SelectItem>
													<SelectItem value="admin">Admin</SelectItem>
												</SelectContent>
											</Select>
										</Field>
									);
								}}
							/>
						</FieldGroup>
					</FieldSet>
				</form>
				<SheetFooter>
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
						children={([canSubmit, isSubmitting]) => (
							<Field>
								<Button
									type="submit"
									form="create-user-form"
									disabled={!canSubmit}
								>
									{isSubmitting ? "Loading..." : "Simpan"}
								</Button>
							</Field>
						)}
					/>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
};
