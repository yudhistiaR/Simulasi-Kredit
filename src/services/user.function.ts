import { auth } from "#/lib/auth";
import { createUser } from "#/validator/user";
import { createServerFn } from "@tanstack/react-start";

export const createUserFn = createServerFn({ method: "POST" })
  .validator(createUser)
  .handler(async ({ data }) => {
    try {
      await auth.api.createUser({
        body: {
          email: data.email,
          name: data.name,
          role: data.role,
          password: data.password,
          data: {
            username: data.username,
          },
        },
      });

      return {
        success: true,
        message: "berhasil membuat penggunak baru",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Gagal membuat penggunak baru",
      };
    }
  });
