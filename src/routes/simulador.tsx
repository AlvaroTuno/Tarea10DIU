import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TrendingUp, TrendingDown, HelpCircle, AlertTriangle } from "lucide-react";
import { PageHeader, Notice } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { CAREERS, campusName, getCareer, type CampusId } from "@/data/careers";
import { SCORE_LABELS, calcWeighted, emptyScores, validateScores, weightsSum, type ScoreKey, type Scores } from "@/lib/paes";

export const Route = createFileRoute("/simulador")({
  validateSearch: (s: Record<string, unknown>): { carrera?: string } => (typeof s["carrera"] === "string" ? { carrera: s["carrera"] } : {}),
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Simulador PAES — Admisión USM" },
      { name: "description", content: "Calcula tu puntaje ponderado PAES y compáralo con cortes de referencia USM." },
      { property: "og:title", content: "Simulador PAES — Admisión USM" },
      { property: "og:description", content: "Calcula tu ponderado PAES para carreras USM." },
    ],
  }),
  component: Simulador,
});

const KEYS: ScoreKey[] = ["nem", "ranking", "lectora", "m1", "m2", "ciencias", "historia"];
const STEPS = ["Puntajes", "Carrera", "Resultado"];

function Simulador() {
  const { carrera } = Route.useSearch();
  const preset = carrera ? getCareer(carrera) : undefined;
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Scores>(emptyScores());
  const [errors, setErrors] = useState<Partial<Record<ScoreKey, string>>>({});
  const [slug, setSlug] = useState(preset?.slug ?? "");
  const [campus, setCampus] = useState<CampusId | "">(preset?.campuses[0] ?? "");
  const [careerError, setCareerError] = useState("");

  const career = getCareer(slug);

  const next1 = () => {
    const e = validateScores(scores, null);
    setErrors(e);
    if (Object.keys(e).length === 0) setStep(1);
  };

  const calc = () => {
    if (!career || !campus) return setCareerError("Selecciona una carrera y un campus.");
    if (!career.weights) return setCareerError("Esta carrera no tiene ponderaciones verificadas; no es posible calcular.");
    if (weightsSum(career.weights) !== 1) return setCareerError("Las ponderaciones de esta carrera no suman 100%.");
    const e = validateScores(scores, career.weights);
    if (Object.keys(e).length) {
      setErrors(e);
      setCareerError("");
      setStep(0);
      return;
    }
    setCareerError("");
    setStep(2);
  };

  const reset = () => {
    setScores(emptyScores());
    setErrors({});
    setSlug("");
    setCampus("");
    setStep(0);
  };

  return (
    <div>
      <PageHeader title="Simulador PAES" subtitle="Resultado referencial, no oficial" back={{ to: "/", label: "Inicio" }} />
      <div className="mx-auto max-w-2xl px-4 py-5">
        <ol className="mb-5 grid grid-cols-3 gap-2" aria-label="Progreso">
          {STEPS.map((s, i) => (
            <li key={s} className="text-center text-xs font-semibold">
              <span className={`mb-1 block h-1.5 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />
              <span className={i === step ? "text-primary" : "text-muted-foreground"}>{i + 1}. {s}</span>
            </li>
          ))}
        </ol>

        {step === 0 && (
          <form onSubmit={(e) => { e.preventDefault(); next1(); }} noValidate className="space-y-3">
            {errors.m2 && career?.weights?.m2 && <Notice tone="warn">{career.name} exige M2. Ingresa tu puntaje M2.</Notice>}
            {KEYS.map((k) => (
              <div key={k}>
                <label htmlFor={k} className="text-sm font-semibold">
                  {SCORE_LABELS[k]} {k === "m2" && <span className="font-normal text-muted-foreground">(según carrera)</span>}
                  {(k === "ciencias" || k === "historia") && <span className="font-normal text-muted-foreground"> (electiva)</span>}
                </label>
                <input
                  id={k}
                  inputMode="decimal"
                  type="number"
                  min={100}
                  max={1000}
                  value={scores[k]}
                  onChange={(e) => setScores({ ...scores, [k]: e.target.value })}
                  aria-invalid={!!errors[k]}
                  aria-describedby={errors[k] ? `${k}-err` : undefined}
                  placeholder="100 – 1000"
                  className={`mt-1 h-12 w-full rounded-xl border bg-card px-3 text-base ${errors[k] ? "border-destructive ring-1 ring-destructive" : "border-input"}`}
                />
                {errors[k] && <p id={`${k}-err`} className="mt-1 text-sm text-destructive">{errors[k]}</p>}
              </div>
            ))}
            <p className="text-xs text-muted-foreground">Se usará automáticamente la mejor prueba electiva entre Ciencias e Historia.</p>
            <Button type="submit" variant="gold" size="lg" className="w-full">Continuar</Button>
          </form>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <label className="block text-sm font-semibold">Carrera
              <select value={slug} onChange={(e) => { setSlug(e.target.value); setCampus(getCareer(e.target.value)?.campuses[0] ?? ""); setCareerError(""); }} className="mt-1 h-12 w-full rounded-xl border border-input bg-card px-3 text-base">
                <option value="">Selecciona una carrera</option>
                {CAREERS.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </label>
            {career && (
              <label className="block text-sm font-semibold">Campus/Sede
                <select value={campus} onChange={(e) => setCampus(e.target.value as CampusId)} className="mt-1 h-12 w-full rounded-xl border border-input bg-card px-3 text-base">
                  {career.campuses.map((id) => <option key={id} value={id}>{campusName(id)}</option>)}
                </select>
              </label>
            )}
            {career && (
              <div className="rounded-2xl border bg-card p-4 text-sm shadow-card">
                <h3 className="font-bold">Ponderaciones aplicadas</h3>
                {career.weights ? (
                  <ul className="mt-2 grid grid-cols-2 gap-1">
                    <li>NEM {career.weights.nem * 100}%</li><li>Ranking {career.weights.ranking * 100}%</li>
                    <li>Lectora {career.weights.lectora * 100}%</li><li>M1 {career.weights.m1 * 100}%</li>
                    <li>M2 {career.weights.m2 ? career.weights.m2 * 100 + "%" : "No exige"}</li><li>Electiva {career.weights.electiva * 100}%</li>
                  </ul>
                ) : null}
                <p className="mt-2 text-xs text-muted-foreground">{career.weightsNote}</p>
              </div>
            )}
            {careerError && <p className="text-sm text-destructive" role="alert">{careerError}</p>}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => setStep(0)}>Modificar puntajes</Button>
              <Button variant="gold" onClick={calc}>Calcular</Button>
            </div>
          </div>
        )}

        {step === 2 && career?.weights && campus && <Result scores={scores} slug={slug} campus={campus} onEdit={() => setStep(0)} onCareer={() => setStep(1)} onReset={reset} />}
      </div>
    </div>
  );
}

function Result({ scores, slug, campus, onEdit, onCareer, onReset }: { scores: Scores; slug: string; campus: CampusId; onEdit: () => void; onCareer: () => void; onReset: () => void }) {
  const career = getCareer(slug);
  if (!career?.weights) return null;
  const r = calcWeighted(scores, career.weights);
  const cut = career.cutoffs[campus];
  const diff = cut ? Math.round((r.total - cut.score) * 10) / 10 : null;
  const pct = (n: number) => `${((n - 100) / 900) * 100}%`;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-card">
        <p className="text-sm opacity-85">Tu puntaje ponderado</p>
        <p className="font-display text-5xl font-bold">{r.total.toLocaleString("es-CL")}</p>
        <p className="mt-1 text-sm opacity-90">{career.name} · {campusName(campus)}</p>
        <p className="text-xs opacity-75">Electiva usada: {SCORE_LABELS[r.electivaUsed]}</p>
      </div>

      {!r.meetsMinimum && (
        <Notice tone="warn"><AlertTriangle className="mr-1 inline h-4 w-4" />Tu promedio Lectora + M1 ({r.promedioLM1.toFixed(1)}) es menor a 485, requisito mínimo de postulación USM (Admisión 2026).</Notice>
      )}

      {cut && diff !== null ? (
        <div className="rounded-2xl border bg-card p-4 shadow-card">
          <div className={`flex items-center gap-2 font-bold ${diff >= 0 ? "text-success" : "text-destructive"}`}>
            {diff >= 0 ? <TrendingUp /> : <TrendingDown />}
            {diff >= 0 ? "Tu puntaje supera el corte de referencia" : "Tu puntaje está bajo el corte de referencia"}
          </div>
          <p className="mt-1 text-sm">Diferencia: <b>{diff > 0 ? "+" : ""}{diff.toLocaleString("es-CL")} puntos</b></p>
          <div className="relative mt-6 h-3 rounded-full bg-muted" aria-hidden="true">
            <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: pct(r.total) }} />
            <div className="absolute -top-2 h-7 w-1 rounded bg-gold" style={{ left: pct(cut.score) }} />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>100</span><span>Corte {cut.score.toLocaleString("es-CL")} ({cut.year})</span><span>1000</span></div>
          <p className="mt-3 text-xs text-muted-foreground">Corte: {cut.source}, Admisión {cut.year}. Referencia histórica; no garantiza selección.</p>
        </div>
      ) : (
        <div className="flex items-start gap-2 rounded-2xl border bg-card p-4 shadow-card">
          <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <p className="text-sm font-semibold">No hay información histórica verificada para esta carrera</p>
        </div>
      )}

      <Notice>Simulación referencial. No representa un resultado oficial de admisión ni asegura un cupo.</Notice>
      <div className="grid gap-2 sm:grid-cols-3">
        <Button variant="outline" onClick={onEdit}>Modificar puntajes</Button>
        <Button variant="outline" onClick={onCareer}>Cambiar carrera</Button>
        <Button variant="gold" onClick={onReset}>Nueva simulación</Button>
      </div>
    </div>
  );
}
