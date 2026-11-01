import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator, GraduationCap, CalendarDays, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EVENTS, eventStatus, formatEventDate } from "@/data/events";
import { StatusBadge } from "@/components/StatusBadge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Admisión USM — Construye tu futuro" },
      { name: "description", content: "Descubre carreras, simula tu puntaje PAES y prepara tu postulación a la USM desde tu celular." },
      { property: "og:title", content: "Admisión USM — Construye tu futuro" },
      { property: "og:description", content: "Carreras, simulador PAES y asistente de postulación USM." },
    ],
  }),
  component: Index,
});

const CARDS = [
  { icon: GraduationCap, title: "Explora nuestras carreras y mallas", text: "Mallas, perfil de egreso, campus y aranceles.", cta: "Conocer carreras", to: "/carreras" },
  { icon: Calculator, title: "Simulador de puntaje PAES", text: "Calcula tu ponderado y compáralo con cortes de referencia.", cta: "Comenzar simulación", to: "/simulador" },
] as const;

function Index() {
  const upcoming = [...EVENTS].sort((a, b) => (eventStatus(a) === "Finalizado" ? 1 : 0) - (eventStatus(b) === "Finalizado" ? 1 : 0)).slice(0, 3);
  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <img src="/images/banner.jpeg" alt="Casa Central de la USM frente al mar en Valparaíso" width={1648} height={768} className="absolute inset-0 -z-10 h-full w-full object-cover object-right" />
        <div className="absolute inset-0 -z-10 bg-hero-overlay" />
        <div className="mx-auto max-w-5xl px-4 pb-6 pt-12 text-primary-foreground sm:pt-20">
          <h1 className="text-4xl font-bold leading-[1.05] sm:text-5xl">Construye tu futuro en la USM</h1>
          <p className="mt-3 max-w-xl text-[15px] opacity-90">
            Descubre nuestras carreras, conoce las actividades de admisión y prepárate para tu ingreso a la Universidad Técnica Federico Santa María.
          </p>
          <Button asChild variant="gold" size="lg" className="mt-5">
            <Link to="/carreras">Explorar carreras <ArrowRight /></Link>
          </Button>
        </div>
      </section>

      <section aria-labelledby="home-events-title" className="mx-auto max-w-5xl px-4 pt-5">
        <Link to="/actividades" aria-label="Eventos USM: ver calendario completo" className="block overflow-hidden rounded-2xl border border-primary bg-primary text-primary-foreground shadow-card transition-colors hover:bg-primary-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2">
          <div className="flex items-start gap-3 p-4 sm:p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold text-gold-foreground"><CalendarDays className="h-6 w-6" /></span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase text-gold">Eventos USM</p>
              <h2 id="home-events-title" className="mt-1 text-2xl font-bold leading-tight sm:text-3xl">Próximas actividades y fechas importantes</h2>
            </div>
          </div>
          <ul className="divide-y divide-sidebar-border px-4 sm:px-5">
            {upcoming.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 py-3">
                <span className="min-w-0">
                  <span className="block font-semibold">{e.name}</span>
                  <span className="mt-0.5 block text-sm text-primary-foreground/80">{formatEventDate(e)}</span>
                </span>
                <StatusBadge status={eventStatus(e)} />
              </li>
            ))}
          </ul>
          <div className="mt-2 flex min-h-12 items-center justify-between gap-3 bg-gold px-4 font-semibold text-gold-foreground sm:px-5">
            Ver calendario completo <ArrowRight className="h-5 w-5 shrink-0" />
          </div>
        </Link>
      </section>

      <section aria-label="Carreras y simulador PAES" className="mx-auto grid max-w-5xl gap-4 px-4 pt-5 sm:grid-cols-2">
        {CARDS.map(({ icon: Icon, title, text, cta, to }) => (
          <article key={to} className="flex flex-col rounded-2xl border bg-card p-4 shadow-card">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary"><Icon className="h-6 w-6" /></span>
            <h2 className="mt-3 text-lg font-bold">{title}</h2>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{text}</p>
            <Button asChild variant="gold" className="mt-4 w-full"><Link to={to}>{cta}</Link></Button>
          </article>
        ))}
      </section>

    </div>
  );
}
