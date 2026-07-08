import { z } from "zod";

export const loginValidation = z.object({
  username: z.string(),
  password: z.string(),
});

export type LoginValidationInput = z.infer<typeof loginValidation>;
