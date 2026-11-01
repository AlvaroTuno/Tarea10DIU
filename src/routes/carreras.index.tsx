// Pantalla temporal de la primera entrega. Se reemplaza al aplicar las partes 02 y 03.
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/carreras/")({
  component: VistaPendiente,
});

function VistaPendiente() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold">Oferta académica</h1>
      <p className="mt-3 text-muted-foreground">La funcionalidad se incorporará en uno de los siguientes aportes del equipo.</p>
      <Link to="/" className="mt-5 inline-block rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground">Volver</Link>
    </main>
  );
}
