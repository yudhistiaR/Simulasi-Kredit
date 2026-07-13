import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  inferAdditionalFields,
  usernameClient,
} from "better-auth/client/plugins";
import {
  ac,
  admin,
  account_officer,
  direktur_kepatuhan,
  direktur_umum,
  menrisk,
  pe_bisnis,
} from "./permissions";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [
    adminClient({
      ac,
      roles: {
        admin,
        account_officer,
        menrisk,
        pe_bisnis,
        direktur_kepatuhan,
        direktur_umum,
      },
    }),
    usernameClient(),
    inferAdditionalFields<typeof auth>(),
  ],
});

export type Session = typeof authClient.$Infer.Session;
