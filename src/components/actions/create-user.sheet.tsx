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
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "@tanstack/react-form-start";
import { createUser } from "#/validator/user";

const items = [
	{ label: "Light", value: "light" },
	{ label: "Dark", value: "dark" },
	{ label: "System", value: "system" },
];

export const CreateUserSheet = () => {
	const form = useForm({
		defaultValues: {
			username: "",
			name: "",
			email: "",
			password: "",
			role: "user",
		},
		validators: {
			onChange: createUser,
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
												placeholder="kazumi@ex.com"
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
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="********"
												autoComplete="off"
												type="password"
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
												onValueChange={field.handleChange}
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
					<Button>Simpan</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
};
