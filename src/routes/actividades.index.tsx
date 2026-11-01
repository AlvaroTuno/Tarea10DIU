import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { EVENTS, EVENT_TYPES, eventStatus, eventsOnDay, formatEventDate, toDate, type EventType } from "@/data/events";

export const Route = createFileRoute("/actividades/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Eventos y actividades — Admisión USM" },
      { name: "description", content: "Calendario de ensayos PAES y fechas de admisión de la USM." },
      { property: "og:title", content: "Eventos y actividades — Admisión USM" },
      { property: "og:description", content: "Calendario interactivo de ensayos PAES y fechas de admisión USM." },
    ],
  }),
  component: Actividades,
});

const WEEK = ["L", "M", "M", "J", "V", "S", "D"];

function Actividades() {
  const now = new Date();
  const [month, setMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [type, setType] = useState<EventType | "Todas">("Todas");
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const days = useMemo(() => {
    const first = (month.getDay() + 6) % 7;
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))];
  }, [month]);

  const list = EVENTS.filter((e) => type === "Todas" || e.type === type)
    .filter((e) => !selectedDay || eventsOnDay(selectedDay).includes(e))
    .sort((a, b) => toDate(a.start).getTime() - toDate(b.start).getTime());

  const shift = (n: number) => {
    setSelectedDay(null);
    setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));
  };

  return (
    <div>
      <PageHeader title="Eventos y actividades" subtitle="Ensayos PAES y fechas clave del ciclo 2026–2027" back={{ to: "/", label: "Inicio" }} />
      <div className="mx-auto max-w-5xl space-y-5 px-4 py-5 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
        <section aria-label="Calendario" className="rounded-2xl border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <button onClick={() => shift(-1)} aria-label="Mes anterior" className="grid h-11 w-11 place-items-center rounded-full hover:bg-accent"><ChevronLeft /></button>
            <h2 className="text-lg font-bold capitalize">{month.toLocaleDateString("es-CL", { month: "long", year: "numeric" })}</h2>
            <button onClick={() => shift(1)} aria-label="Mes siguiente" className="grid h-11 w-11 place-items-center rounded-full hover:bg-accent"><ChevronRight /></button>
          </div>
          <div className="mt-2 grid grid-cols-7 text-center text-xs font-semibold text-muted-foreground">
            {WEEK.map((d, i) => <span key={i} className="py-1">{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((d, i) => {
              if (!d) return <span key={i} />;
              const has = eventsOnDay(d).length > 0;
              const sel = selectedDay?.getTime() === d.getTime();
              const isToday = d.toDateString() === now.toDateString();
              return (
                <button
                  key={i}
                  disabled={!has}
                  onClick={() => setSelectedDay(sel ? null : d)}
                  aria-label={`${d.getDate()}${has ? ", con actividades" : ""}`}
                  aria-pressed={sel}
                  className={`relative grid aspect-square place-items-center rounded-lg text-sm ${sel ? "bg-primary text-primary-foreground" : has ? "bg-accent font-bold text-primary" : "text-foreground/70"} ${isToday ? "ring-2 ring-gold" : ""}`}
                >
                  {d.getDate()}
                  {has && <span className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${sel ? "bg-gold" : "bg-primary"}`} />}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" />Día con actividad</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded ring-2 ring-gold" />Hoy</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {EVENTS.map((e) => (
              <button key={e.id} onClick={() => { setSelectedDay(null); setMonth(new Date(toDate(e.start).getFullYear(), toDate(e.start).getMonth(), 1)); }} className="rounded-full border px-3 py-1.5 text-xs hover:bg-accent">
                Ir a {toDate(e.start).toLocaleDateString("es-CL", { month: "short", year: "numeric" })}
              </button>
            ))}
          </div>
        </section>

        <section aria-label="Listado de actividades">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
            {(["Todas", ...EVENT_TYPES] as const).map((t) => (
              <button key={t} onClick={() => setType(t)} aria-pressed={type === t} className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-medium ${type === t ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>
                {t}
              </button>
            ))}
          </div>
          {selectedDay && (
            <p className="mt-2 text-sm">Mostrando el {selectedDay.toLocaleDateString("es-CL")} · <button className="font-semibold text-primary underline" onClick={() => setSelectedDay(null)}>Ver todas</button></p>
          )}
          <ul className="mt-3 space-y-2">
            {list.map((e) => (
              <li key={e.id}>
                <Link to="/actividades/$id" params={{ id: e.id }} className="flex items-center justify-between gap-3 rounded-xl border bg-card p-3 shadow-card">
                  <span>
                    <span className="text-xs font-semibold uppercase text-primary">{e.type}</span>
                    <span className="block font-semibold">{e.name}</span>
                    <span className="text-sm text-muted-foreground">{formatEventDate(e)}</span>
                  </span>
                  <StatusBadge status={eventStatus(e)} />
                </Link>
              </li>
            ))}
          </ul>
          {list.length === 0 && (
            <div className="mt-3 rounded-xl border border-dashed p-5 text-center text-sm text-muted-foreground">
              No hay actividades verificadas de tipo “{type}” para mostrar. Revisa <a className="font-semibold text-primary underline" href="https://usm.cl/admision/" target="_blank" rel="noopener noreferrer">usm.cl/admision</a> para novedades.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
