import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { EyeIcon, EyeOffIcon, LockIcon, User2Icon } from "lucide-react";

import { useMutation } from "@tanstack/react-query";
import { authClient } from "#/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form-start";
import { loginValidation, type LoginValidationInput } from "#/validator/auth";
import { useState } from "react";
import { toast } from "sonner";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [visibility, setVisibility] = useState<boolean>(false);

	const navigation = useNavigate();

	const form = useForm({
		defaultValues: {
			username: "",
			password: "",
		},
		validators: {
			onSubmit: loginValidation,
		},
		onSubmit: async ({ value, formApi }) => {
			toast.promise(mutation.mutateAsync(value), {
				loading: "Loading...",
				success: ({ data }) => {
					return {
						message: "Berhasil Login",
						description: `Selamat datang kembali ${data?.user.name ?? ""}`,
					};
				},
				error: (e) => {
					return {
						message: "Gagal Login",
						description: e.message || "Login gagal, Silahkan coba lagi",
					};
				},
				finally: () => formApi.resetField("password"),
			});
		},
	});

	const mutation = useMutation({
		mutationFn: async (data: LoginValidationInput) => {
			const response = await authClient.signIn.username({
				username: data.username,
				password: data.password,
			});

			if (response.error)
				throw new Error(
					response.error.message || "Login gagal, Silahkan coba lagi.",
				);

			return response;
		},
		onSuccess: () => navigation({ to: "/dashboard" }),
	});

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Selamat Datang Kembali</CardTitle>
				</CardHeader>
				<CardContent>
					<form
						id="login-form"
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
					>
						<FieldGroup>
							<form.Field
								name="username"
								children={(field) => {
									return (
										<Field>
											<FieldLabel htmlFor={field.name}>Username</FieldLabel>
											<InputGroup>
												<InputGroupInput
													id={field.name}
													name={field.name}
													type="text"
													value={field.state.value}
													placeholder="username"
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
												/>
												<InputGroupAddon>
													<User2Icon />
												</InputGroupAddon>
											</InputGroup>
										</Field>
									);
								}}
							/>

							<form.Field
								name="password"
								children={(field) => {
									return (
										<Field>
											<FieldLabel htmlFor={field.name}>Password</FieldLabel>
											<InputGroup>
												<InputGroupInput
													id={field.name}
													name={field.name}
													type={visibility ? "text" : "password"}
													placeholder="********"
													onChange={(e) => field.handleChange(e.target.value)}
												/>
												<InputGroupAddon>
													<LockIcon />
												</InputGroupAddon>
												<InputGroupAddon align="inline-end">
													<InputGroupButton
														onClick={() => setVisibility(!visibility)}
													>
														{visibility ? <EyeIcon /> : <EyeOffIcon />}
													</InputGroupButton>
												</InputGroupAddon>
											</InputGroup>
										</Field>
									);
								}}
							/>
						</FieldGroup>
					</form>
				</CardContent>
				<CardFooter>
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
						children={([canSubmit, isSubmitting]) => (
							<Field>
								<Button type="submit" form="login-form" disabled={!canSubmit}>
									{isSubmitting ? "Loading..." : "LOGIN"}
								</Button>
							</Field>
						)}
					/>
				</CardFooter>
			</Card>
		</div>
	);
}
