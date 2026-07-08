import { z } from "zod";
import type { UserRole } from "#/types/user";

const validRoles: UserRole[] = [
  "account_officer",
  "menrisk",
  "pe_bisnis",
  "direktur_kepatuhan",
  "direktur_umum",
] as const;

export const createUser = z.object({
  username: z
    .string()
    .min(5, "Username terlaku pendek")
    .max(20, "Username terlalu panjang"),
  email: z.email("Email tidak valid"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(33, "Password terlalu panjang"),
  name: z
    .string()
    .min(8, "Nama terlalu pendek")
    .max(20, "Nama terlalu panjang"),
  role: z.enum(validRoles),
});

export type CreateUserInput = z.infer<typeof createUser>;
