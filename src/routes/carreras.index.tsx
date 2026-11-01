import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Clock, MapPin } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { AREAS, CAMPUSES, CAREERS, campusName, type Area, type CampusId } from "@/data/careers";

export const Route = createFileRoute("/carreras/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Carreras de Pregrado — Admisión USM" },
      { name: "description", content: "Busca y filtra carreras de pregrado diurno USM por campus y área." },
      { property: "og:title", content: "Carreras de Pregrado — Admisión USM" },
      { property: "og:description", content: "Catálogo de carreras USM con mallas, duración y campus." },
    ],
  }),
  component: Carreras,
});

const selectCls = "h-11 w-full rounded-xl border border-input bg-card px-3 text-sm";

function Carreras() {
  const [q, setQ] = useState("");
  const [campus, setCampus] = useState<CampusId | "">("");
  const [area, setArea] = useState<Area | "">("");
  const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const list = CAREERS.filter((c) => norm(c.name).includes(norm(q.trim())))
    .filter((c) => !campus || c.campuses.includes(campus))
    .filter((c) => !area || c.area === area);

  return (
    <div>
      <PageHeader title="Oferta académica" subtitle="Pregrado Diurno" back={{ to: "/", label: "Inicio" }} />
      <div className="mx-auto max-w-5xl px-4 py-5">
        <div className="space-y-3 rounded-2xl border bg-card p-4 shadow-card">
          <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Categoría: Pregrado Diurno</span>
          <label className="relative block">
            <span className="sr-only">Buscar carrera</span>
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre…" className="h-11 w-full rounded-xl border border-input bg-card pl-10 pr-3" />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-semibold">Campus/Sede
              <select value={campus} onChange={(e) => setCampus(e.target.value as CampusId | "")} className={selectCls + " mt-1"}>
                <option value="">Todos</option>
                {CAMPUSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <label className="text-xs font-semibold">Área
              <select value={area} onChange={(e) => setArea(e.target.value as Area | "")} className={selectCls + " mt-1"}>
                <option value="">Todas</option>
                {AREAS.map((a) => <option key={a}>{a}</option>)}
              </select>
            </label>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">{list.length} carrera(s)</p>
        <ul className="mt-2 grid gap-3 sm:grid-cols-2">
          {list.map((c) => (
            <li key={c.slug} className="rounded-2xl border bg-card p-4 shadow-card">
              <span className="text-xs font-semibold uppercase text-primary">{c.area}</span>
              <h2 className="text-lg font-bold">{c.name}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><Clock className="h-4 w-4" />{c.durationYears} años · Diurno</p>
              <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{c.campuses.map(campusName).join(" · ")}</p>
              <Button asChild variant="gold" className="mt-3 w-full"><Link to="/carreras/$slug" params={{ slug: c.slug }}>Ver carrera</Link></Button>
            </li>
          ))}
        </ul>
        {list.length === 0 && (
          <div className="mt-3 rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            No encontramos carreras con esos filtros.
            <Button variant="outline" className="mt-3 w-full" onClick={() => { setQ(""); setCampus(""); setArea(""); }}>Limpiar filtros</Button>
          </div>
        )}
      </div>
    </div>
  );
}
