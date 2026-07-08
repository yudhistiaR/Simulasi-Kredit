import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSession } from "#/services/auth.function";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    const session = await getSession();

    if (session) throw redirect({ to: "/dashboard" });

    return null;
  },
  component: () => <Outlet />,
});
