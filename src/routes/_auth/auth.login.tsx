import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "#/components/form/login-form";

export const Route = createFileRoute("/_auth/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
