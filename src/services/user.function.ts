import { auth } from "#/lib/auth";
import { createUser } from "#/validator/user";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

export const createUserFn = createServerFn({ method: "POST" })
  .validator(createUser)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();

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
        headers,
      });

      return {
        success: true,
        message: "Berhasil membuat penggunak baru",
      };
    } catch (error: any) {
      console.log(error.message || "Internal server error");
    }
  });
