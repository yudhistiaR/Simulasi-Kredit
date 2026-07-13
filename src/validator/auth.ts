import { z } from "zod";

export const loginValidation = z.object({
  username: z.string(),
  password: z.string(),
});

export const setPasswordValidation = z
  .object({
    password: z.string().min(8, "Password harus 8+ karakter"),
    confirmPassword: z.string().min(8, "Konfirmasi password diperlukan"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwod tidak cocok",
    path: ["confirmPassword"],
  });

export type SetPasswordValidationInput = z.infer<typeof setPasswordValidation>;
export type LoginValidationInput = z.infer<typeof loginValidation>;
