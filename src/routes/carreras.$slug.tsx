import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Download, ExternalLink, Calculator } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Notice } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { campusName, formatCLP, getCareer } from "@/data/careers";
import { downloadMallaPdf } from "@/lib/pdf";

export const Route = createFileRoute("/carreras/$slug")({
  loader: ({ params }) => {
    const career = getCareer(params.slug);
    if (!career) throw notFound();
    return { career };
  },
  head: ({ loaderData }) => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: loaderData ? `${loaderData.career.name} — Admisión USM` : "Carrera no encontrada — Admisión USM" },
      { name: "description", content: loaderData?.career.description ?? "Carrera USM" },
      { property: "og:title", content: loaderData?.career.name ?? "Carrera USM" },
      { property: "og:description", content: loaderData?.career.description ?? "Carrera USM" },
    ],
  }),
  notFoundComponent: () => (
    <div className="p-6 text-center"><p>No encontramos esa carrera.</p><Button asChild className="mt-4"><Link to="/carreras">Volver a carreras</Link></Button></div>
  ),
  component: CareerDetail,
});

const NA = "Dato no disponible";

function CareerDetail() {
  const { career: c } = Route.useLoaderData();
  const [open, setOpen] = useState<number | null>(1);
  const [busy, setBusy] = useState(false);

  const download = async () => {
    setBusy(true);
    try {
      await downloadMallaPdf(c);
      toast.success("Malla descargada en PDF");
    } catch {
      toast.error("No se pudo generar el PDF. Intenta nuevamente.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader title={c.name} subtitle={`${c.category} · ${c.campuses.map(campusName).join(" · ")}`} back={{ to: "/carreras", label: "Carreras" }} />
      <div className="mx-auto max-w-3xl px-4 py-5">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <Fact label="Duración" value={c.durationLabel} />
          <Fact label="Título" value={c.title ?? NA} />
          <Fact label="Arancel anual" value={c.fee ? `${formatCLP(c.fee.amount)} (${c.fee.year})` : NA} />
          <Fact label="Régimen" value="Diurno" />
        </div>

        <Tabs defaultValue="descripcion" className="mt-5">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-xl bg-secondary p-1 sm:grid-cols-4">
            {([["descripcion", "Descripción"], ["perfil", "Perfil de Egreso"], ["plan", "Plan de Estudios"], ["aranceles", "Aranceles"]] as const).map(([v, l]) => (
              <TabsTrigger key={v} value={v} className="min-h-10 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">{l}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="descripcion" className="mt-4 space-y-4">
            <p className="text-[15px] leading-relaxed">{c.description}</p>
            {c.degree && <p className="text-sm"><b>Grado académico:</b> {c.degree}</p>}
            <div className="rounded-2xl border bg-card p-4 shadow-card">
              <h3 className="font-bold">Requisitos PAES y ponderaciones</h3>
              {c.weights ? (
                <ul className="mt-2 grid grid-cols-2 gap-1 text-sm">
                  <li>NEM: {c.weights.nem * 100}%</li>
                  <li>Ranking: {c.weights.ranking * 100}%</li>
                  <li>M1: {c.weights.m1 * 100}%</li>
                  <li>M2: {c.weights.m2 ? `${c.weights.m2 * 100}%` : "No exige"}</li>
                  <li>Lectora: {c.weights.lectora * 100}%</li>
                  <li>Ciencias o Historia: {c.weights.electiva * 100}%</li>
                </ul>
              ) : <p className="mt-2 text-sm text-muted-foreground">{NA}</p>}
              <p className="mt-2 text-xs text-muted-foreground">{c.weightsNote} Requisito general: promedio Lectora y M1 ≥ 485 puntos (Admisión 2026).</p>
              {c.weights && <Button asChild variant="outline" className="mt-3 w-full"><Link to="/simulador" search={{ carrera: c.slug }}><Calculator />Simular mi puntaje</Link></Button>}
            </div>
          </TabsContent>

          <TabsContent value="perfil" className="mt-4">
            {c.profile ? <div className="space-y-3 whitespace-pre-line text-[15px] leading-relaxed">{c.profile}</div> : <Missing url={c.officialUrl} />}
          </TabsContent>

          <TabsContent value="plan" className="mt-4 space-y-3">
            {c.plan ? (
              <>
                <Notice>Información referencial publicada en usm.cl. El plan puede estar sujeto a modificaciones.</Notice>
                <ul className="space-y-2">
                  {c.plan.map((s) => {
                    const isOpen = open === s.n;
                    return (
                      <li key={s.n} className="overflow-hidden rounded-xl border bg-card shadow-card">
                        <button onClick={() => setOpen(isOpen ? null : s.n)} aria-expanded={isOpen} className="flex min-h-12 w-full items-center justify-between px-4 text-left font-semibold">
                          <span><span className="mr-2 inline-grid h-7 w-7 place-items-center rounded-full bg-primary text-xs text-primary-foreground">{s.n}</span>{s.n}º Semestre</span>
                          <span className="flex items-center gap-2 text-xs text-muted-foreground">{s.courses.length} asignaturas<ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} /></span>
                        </button>
                        {isOpen && (
                          <ul className="grid gap-1.5 border-t bg-secondary p-3 sm:grid-cols-2">
                            {s.courses.map((x) => <li key={x} className="rounded-lg bg-card px-3 py-2 text-sm">{x}</li>)}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <Button variant="gold" size="lg" className="w-full" onClick={download} disabled={busy}><Download />{busy ? "Generando…" : "Descargar malla curricular"}</Button>
              </>
            ) : <Missing url={c.officialUrl} />}
          </TabsContent>

          <TabsContent value="aranceles" className="mt-4 space-y-3">
            <div className="rounded-2xl border bg-card p-4 shadow-card">
              <p className="text-sm text-muted-foreground">Arancel anual</p>
              <p className="font-display text-3xl font-bold text-primary">{c.fee ? formatCLP(c.fee.amount) : NA}</p>
              {c.fee && <p className="text-sm">Año de referencia: {c.fee.year}</p>}
            </div>
            <Button asChild variant="outline" className="w-full"><a href="/becas">Ver becas y beneficios</a></Button>
          </TabsContent>
        </Tabs>
        <Button asChild variant="link" className="mt-4 w-full"><a href={c.officialUrl} target="_blank" rel="noopener noreferrer">Página oficial de la carrera <ExternalLink /></a></Button>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-secondary p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="font-semibold">{value}</p></div>;
}

function Missing({ url }: { url: string }) {
  return (
    <Notice tone="warn">
      Dato no disponible en este MVP: no se ha verificado esta información. <a href={url} target="_blank" rel="noopener noreferrer" className="font-semibold underline">Consultar sitio oficial</a>
    </Notice>
  );
}
