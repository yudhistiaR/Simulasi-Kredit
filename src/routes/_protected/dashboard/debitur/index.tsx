import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/dashboard/debitur/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1>Data Calon Anggota</h1>
      <Link to="/dashboard/debitur/new">Buat Registrasi Baru</Link>
    </div>
  );
}
