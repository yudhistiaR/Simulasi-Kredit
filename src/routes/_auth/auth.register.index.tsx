import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "#/lib/auth-client";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/_auth/auth/register/")({
  component: RouteComponent,
});

function RouteComponent() {
  const mutation = useMutation({
    mutationFn: async () => {
      const { data: user, error } = await authClient.signUp.email({
        name: "admin",
        email: "admin@gmail.com",
        password: "rahasia110",
        username: "admin",
      });

      console.log("ERROR: ", error);

      return user;
    },
  });

  return (
    <section>
      {mutation.isSuccess ? "Berhasil Regis" : "Gagal Regis"}
      <Button
        onClick={() => {
          mutation.mutate();
        }}
      >
        {mutation.isPending ? "Loading..." : "Register"}
      </Button>
    </section>
  );
}
