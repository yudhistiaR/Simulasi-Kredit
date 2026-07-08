import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const statement = {
  ...defaultStatements,
  analisa_kredit: ["create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  analisa_kredit: ["create", "update", "delete"],
  ...adminAc.statements,
});

export const account_officer = ac.newRole({
  analisa_kredit: ["create", "update", "delete"],
});

export const pe_bisnis = ac.newRole({
  analisa_kredit: ["create", "update", "delete"],
});

export const menrisk = ac.newRole({
  analisa_kredit: ["create", "update", "delete"],
});

export const direktur_kepatuhan = ac.newRole({
  analisa_kredit: ["create", "update", "delete"],
});

export const direktur_umum = ac.newRole({
  analisa_kredit: ["create", "update", "delete"],
});
