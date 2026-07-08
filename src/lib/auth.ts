import { betterAuth } from "better-auth";
import { admin, username } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { prisma } from "#/db";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ["http://192.168.11.33:3000"],
  plugins: [
    tanstackStartCookies(),
    admin({
      adminUserIds: ["VbJiHdxNyiqGLyWxZvAW0nZ5cMuTvr24"], // TODO: nanti di hapus yaw
      adminRoles: "admin",
      defaultRole: "account_officer",
    }),
    username(),
  ],
});

export type Session = typeof auth.$Infer.Session;
