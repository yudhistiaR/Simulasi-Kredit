import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "#/lib/auth-client";
import { useForm } from "@tanstack/react-form-start";
import { setPasswordValidation } from "#/validator/auth";
import { useState } from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "../ui/input-group";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export const ChangeUserPasswordTab = ({ userId }: { userId: string }) => {
	const [visibility, setVisibility] = useState({
		password: false,
		confirmPassword: false,
	});

	const toggleVisibility = (field) => {
		setVisibility((prevState) => ({
			...prevState,
			[field]: !prevState[field],
		}));
	};

	const form = useForm({
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
		validators: {
			onChange: setPasswordValidation,
		},
		onSubmit: async ({ value, formApi }) => {
			toast.promise(
				mutation.mutateAsync({ id: userId, password: value.password }),
				{
					loading: "Loading...",
					success: () => {
						return {
							message: "Berhasil",
							description: "Berhasil menggubah password",
						};
					},
					error: (e) => {
						return {
							message: "Gagal",
							description: e.message || "Gagal menggubah password",
						};
					},
					finally: () => formApi.reset(),
				},
			);
		},
	});

	const mutation = useMutation({
		mutationFn: async ({ id, password }: { id: string; password: string }) => {
			const { data, error } = await authClient.admin.setUserPassword({
				userId: id,
				newPassword: password,
			});
			if (error) throw new Error(error.message);
			return data;
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<FieldSet>
				<FieldGroup>
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
											type={visibility.password ? "text" : "password"}
											placeholder="********"
										/>
										<InputGroupAddon align="inline-end">
											<InputGroupButton
												onClick={() => toggleVisibility("password")}
											>
												{visibility.password ? <EyeIcon /> : <EyeOffIcon />}
											</InputGroupButton>
										</InputGroupAddon>
									</InputGroup>
									{isInvalid ? (
										<FieldError errors={field.state.meta.errors} />
									) : (
										<FieldDescription>Masukan password baru</FieldDescription>
									)}
								</Field>
							);
						}}
					/>
					<form.Field
						name="confirmPassword"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;

							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name}>
										Konfirmasi Password
									</FieldLabel>
									<InputGroup>
										<InputGroupInput
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											type={visibility.confirmPassword ? "text" : "password"}
											placeholder="********"
										/>
										<InputGroupAddon align="inline-end">
											<InputGroupButton
												onClick={() => toggleVisibility("confirmPassword")}
											>
												{visibility.confirmPassword ? (
													<EyeIcon />
												) : (
													<EyeOffIcon />
												)}
											</InputGroupButton>
										</InputGroupAddon>
									</InputGroup>
									{isInvalid ? (
										<FieldError errors={field.state.meta.errors} />
									) : (
										<FieldDescription>
											Konfirmasi Passowrd Baru
										</FieldDescription>
									)}
								</Field>
							);
						}}
					/>
				</FieldGroup>
			</FieldSet>
			<div className="flex items-end justify-end">
				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
					children={([canSubmit, isSubmitting]) => (
						<Button type="submit" disabled={!canSubmit}>
							{isSubmitting ? "Loading..." : "Simpan"}
						</Button>
					)}
				/>
			</div>
		</form>
	);
};
