import { authClient } from "#/lib/auth-client";
import type { UserRole } from "#/types/user";
import { updateUserScheme } from "#/validator/user";
import { toast } from "sonner";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useForm } from "@tanstack/react-form-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UserData {
	id: string;
	username: string;
	email: string;
	name: string;
	role: UserRole;
}

export const UserInformationContent = ({
	userData,
}: {
	userData: UserData;
}) => {
	const queryClient = useQueryClient();

	const form = useForm({
		defaultValues: {
			username: userData.username,
			name: userData.name,
			email: userData.email,
			role: userData.role,
		},
		validators: {
			onChange: updateUserScheme,
		},
		onSubmit: ({ value, formApi }) => {
			const partialData: Partial<typeof value> = {};

			(Object.keys(value) as Array<keyof typeof value>).forEach((key) => {
				if (formApi.getFieldMeta(key)?.isDirty) {
					partialData[key] = value[key];
				}
			});

			if (Object.keys(partialData).length === 0) return;

			toast.promise(
				mutation.mutateAsync({ userId: userData.id, data: partialData }),
				{
					loading: "Loading...",
					success: () => {
						return {
							message: "Berhasil",
							description: "Berhasil mengubah data pengguna",
						};
					},
					error: (e) => {
						return {
							message: "Gagal",
							description: e.message || "Gagal mengubah data pengguna",
						};
					},
					finally: () => {
						formApi.reset();
						queryClient.invalidateQueries({ queryKey: ["users"] });
						queryClient.invalidateQueries({ queryKey: ["user", userData.id] });
					},
				},
			);
		},
	});

	const mutation = useMutation({
		mutationFn: async ({
			userId,
			data,
		}: {
			userId: string;
			data: Record<string, any>;
		}) => {
			const { data: updateData, error } = await authClient.admin.updateUser({
				userId,
				data,
			});

			if (error) throw new Error(error.message);
			return updateData;
		},
	});

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			e.stopPropagation();
			form.handleSubmit();
		}
	};

	return (
		<FieldSet>
			<FieldGroup>
				<form.Field
					name="username"
					children={(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;

						return (
							<Field
								id={field.name}
								data-invalid={isInvalid}
								orientation="horizontal"
								className="grid grid-cols-[120px_1fr] items-center gap-4"
							>
								<FieldLabel htmlFor={field.name}>Username</FieldLabel>
								<FieldContent>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										placeholder="Nama pengguna"
										aria-invalid={isInvalid}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										onKeyDown={handleKeyDown}
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</FieldContent>
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
							<Field
								data-invalid={isInvalid}
								orientation="horizontal"
								className="grid grid-cols-[120px_1fr] items-center gap-4"
							>
								<FieldLabel htmlFor={field.name}>Nama</FieldLabel>
								<FieldContent>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										placeholder="Nama pengguna"
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										onKeyDown={handleKeyDown}
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</FieldContent>
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
							<Field
								id={field.name}
								data-invalid={isInvalid}
								orientation="horizontal"
								className="grid grid-cols-[120px_1fr] items-center gap-4"
							>
								<FieldLabel htmlFor={field.name}>Email</FieldLabel>
								<FieldContent>
									<Input
										id={field.name}
										aria-invalid={isInvalid}
										value={field.state.value}
										placeholder="Nama pengguna"
										type="email"
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										onKeyDown={handleKeyDown}
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</FieldContent>
							</Field>
						);
					}}
				/>

				<form.Field
					name="role"
					children={(field) => {
						return (
							<Field
								orientation="horizontal"
								className="grid grid-cols-[120px_1fr] items-center gap-4"
							>
								<FieldLabel htmlFor={field.name}>
									{"Role (Hak Akses)"}
								</FieldLabel>
								<Select
									name={field.name}
									value={field.state.value}
									onValueChange={(value) => {
										field.handleChange(value as UserRole);
										form.handleSubmit();
									}}
								>
									<SelectTrigger
										disabled={userData.role === "admin"}
										className="w-full"
									>
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
										<SelectItem value="direktur_umum">Direktur Umum</SelectItem>
										<SelectItem value="admin">Admin</SelectItem>
									</SelectContent>
								</Select>
							</Field>
						);
					}}
				/>
			</FieldGroup>
		</FieldSet>
	);
};
