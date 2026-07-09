import { auth } from "#/lib/auth";
import { bannedUserValidation, createUser } from "#/validator/user";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { z } from "zod";

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

export const deleteUserFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      userId: z.string("User id diperlukan"),
    }),
  )
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();

    try {
      await auth.api.removeUser({
        body: {
          userId: data.userId,
        },
        headers,
      });

      return {
        success: true,
        message: "Pengguna berhasil dihapus",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Gagal membuat penggunak baru",
      };
    }
  });

export const bannedUserFn = createServerFn({ method: "POST" })
  .validator(bannedUserValidation)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();

    try {
      await auth.api.banUser({
        body: {
          userId: data.userId,
          banReason: data.banReason,
          banExpiresIn: Number(data.banExpiresIn),
        },
        headers,
      });

      return {
        success: true,
        message: "Banned pengguna berhasil",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Banned pengguna gagal",
      };
    }
  });
