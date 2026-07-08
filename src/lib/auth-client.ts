import { createAuthClient } from "better-auth/react";
import { adminClient, usernameClient } from "better-auth/client/plugins";
import {
  ac,
  account_officer,
  direktur_kepatuhan,
  direktur_umum,
  menrisk,
  pe_bisnis,
} from "./permissions";

export const authClient = createAuthClient({
  plugins: [
    adminClient({
      ac,
      roles: {
        account_officer,
        menrisk,
        pe_bisnis,
        direktur_kepatuhan,
        direktur_umum,
      },
    }),
    usernameClient(),
  ],
});

export type Session = typeof authClient.$Infer.Session;
