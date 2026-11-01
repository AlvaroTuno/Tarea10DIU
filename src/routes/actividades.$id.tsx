import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarDays, Clock, MapPin, Info, ExternalLink } from "lucide-react";
import { PageHeader, Notice } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { EVENTS, eventStatus, formatEventDate } from "@/data/events";

export const Route = createFileRoute("/actividades/$id")({
  loader: ({ params }) => {
    const event = EVENTS.find((e) => e.id === params.id);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: loaderData ? `${loaderData.event.name} — Admisión USM` : "Actividad no encontrada — Admisión USM" },
      { name: "description", content: loaderData?.event.description ?? "Actividad de admisión USM." },
      { property: "og:title", content: loaderData?.event.name ?? "Actividad USM" },
      { property: "og:description", content: loaderData?.event.description ?? "Actividad de admisión USM." },
    ],
  }),
  notFoundComponent: () => (
    <div className="p-6 text-center">
      <p>No encontramos esa actividad.</p>
      <Button asChild className="mt-4"><Link to="/actividades">Volver al calendario</Link></Button>
    </div>
  ),
  component: Detail,
});

function Detail() {
  const { event: e } = Route.useLoaderData();
  const status = eventStatus(e);
  return (
    <div>
      <PageHeader title={e.name} subtitle={e.type} back={{ to: "/actividades", label: "Calendario" }} />
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-5">
        <div className="rounded-2xl border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between"><span className="text-sm font-semibold text-muted-foreground">Estado</span><StatusBadge status={status} /></div>
          <p className="mt-3 text-[15px]">{e.description}</p>
          <dl className="mt-4 space-y-3 text-sm">
            <Row icon={CalendarDays} label="Fecha" value={formatEventDate(e)} />
            <Row icon={Clock} label="Horario" value={e.time} />
            <Row icon={MapPin} label="Ubicación" value={e.location} />
          </dl>
        </div>
        <section className="rounded-2xl border bg-card p-4 shadow-card">
          <h2 className="flex items-center gap-2 text-lg font-bold"><Info className="h-5 w-5 text-primary" />Inscripción</h2>
          {status === "Finalizado" ? (
            <p className="mt-2 text-sm text-muted-foreground">Esta actividad ya finalizó. No hay inscripciones disponibles.</p>
          ) : e.registration ? (
            <p className="mt-2 text-sm">{e.registration}</p>
          ) : (
            <div className="mt-2"><Notice tone="warn">No hay una inscripción oficial confirmada en este MVP. Consulta la fuente oficial para conocer el procedimiento vigente.</Notice></div>
          )}
          <Button asChild variant="outline" className="mt-3 w-full">
            <a href={e.source} target="_blank" rel="noopener noreferrer">Ver fuente oficial <ExternalLink /></a>
          </Button>
        </section>
        <Button asChild variant="gold" size="lg" className="w-full"><Link to="/actividades">Volver al calendario</Link></Button>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
      <div><dt className="font-semibold">{label}</dt><dd className="text-muted-foreground">{value}</dd></div>
    </div>
  );
}
