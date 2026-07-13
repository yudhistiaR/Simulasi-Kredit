import { betterAuth } from "better-auth";
import { admin, username } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { prisma } from "#/db";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  ac,
  admin as adminRole,
  account_officer,
  direktur_kepatuhan,
  direktur_umum,
  menrisk,
  pe_bisnis,
} from "./permissions";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ["http://192.168.11.48:3000"],
  plugins: [
    tanstackStartCookies(),
    admin({
      ac,
      roles: {
        admin: adminRole,
        account_officer,
        menrisk,
        pe_bisnis,
        direktur_kepatuhan,
        direktur_umum,
      },
      adminRoles: "admin",
      defaultRole: "account_officer",
    }),
    username(),
  ],
});

export type Session = typeof auth.$Infer.Session;
