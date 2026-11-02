import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Download, Pencil } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Notice } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { CAREERS, ENTRY_ROUTE_LABEL, campusName, getCareer, type CampusId, type EntryRoute } from "@/data/careers";
import { downloadReceiptPdf, type Receipt } from "@/lib/pdf";

export const Route = createFileRoute("/postulacion")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Asistente de pre-registro — Admisión USM" },
      { name: "description", content: "Asistente de demostración para preparar tu postulación a la USM paso a paso." },
      { property: "og:title", content: "Asistente de pre-registro — Admisión USM" },
      { property: "og:description", content: "Prepara tu postulación USM con un asistente de demostración." },
    ],
  }),
  component: Wizard,
});

interface Form { name: string; email: string; demoId: string; career: string; campus: CampusId | ""; route: EntryRoute | "" }
const EMPTY: Form = { name: "", email: "", demoId: "", career: "", campus: "", route: "" };
const KEY = "usm-mvp-preregistro";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const STEPS = ["Datos personales", "Preferencias", "Confirmación"];

function Wizard() {
  const [step, setStep] = useState(0);
  const [f, setF] = useState<Form>(EMPTY);
  const [err, setErr] = useState<Partial<Record<keyof Form, string>>>({});
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "null");
      if (saved?.form) { setF(saved.form); setStep(saved.step ?? 0); }
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    if (!receipt) localStorage.setItem(KEY, JSON.stringify({ form: f, step }));
  }, [f, step, receipt]);

  const career = getCareer(f.career);
  const set = (k: keyof Form, v: string) => { setF((p) => ({ ...p, [k]: v })); setErr((e) => ({ ...e, [k]: undefined })); };

  const next0 = () => {
    const e: typeof err = {};
    if (f.name.trim().length < 3) e.name = "Ingresa tu nombre completo.";
    if (!f.email.trim()) e.email = "El correo es obligatorio.";
    else if (!EMAIL_RE.test(f.email.trim())) e.email = "Formato de correo inválido.";
    setErr(e);
    if (!Object.keys(e).length) setStep(1);
  };
  const next1 = () => {
    const e: typeof err = {};
    if (!f.career) e.career = "Selecciona una carrera.";
    if (!f.campus) e.campus = "Selecciona un campus o sede.";
    if (!f.route) e.route = "Selecciona una vía de ingreso.";
    setErr(e);
    if (!Object.keys(e).length) setStep(2);
  };
  const confirm = () => {
    if (!career || !f.campus || !f.route) return;
    const id = "DEMO-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    setReceipt({
      id, name: f.name.trim(), email: f.email.trim(), demoId: f.demoId.trim(),
      career: career.name, campus: campusName(f.campus as CampusId), route: ENTRY_ROUTE_LABEL[f.route as EntryRoute],
      date: new Date().toLocaleString("es-CL"),
    });
    localStorage.removeItem(KEY);
    toast.success("Pre-registro simulado completado");
  };
  const restart = () => { setReceipt(null); setF(EMPTY); setStep(0); };

  const input = (k: keyof Form) => `mt-1 h-12 w-full rounded-xl border bg-card px-3 text-base ${err[k] ? "border-destructive ring-1 ring-destructive" : "border-input"}`;

  return (
    <div>
      <PageHeader title="Asistente de postulación" subtitle="Pre-registro simulado" back={{ to: "/", label: "Inicio" }} />
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-5">
        <Notice tone="warn"><b>Demostración académica.</b> Esto no es una postulación oficial al DEMRE ni un registro en la USM. Tus datos se guardan solo en este navegador.</Notice>

        {receipt ? (
          <div className="space-y-4">
            <div className="rounded-2xl border-2 border-dashed border-primary bg-card p-5 shadow-card">
              <div className="flex items-center gap-2 text-success"><CheckCircle2 /><span className="font-bold">Pre-registro simulado completado</span></div>
              <p className="mt-3 rounded-lg bg-warning px-3 py-2 text-center text-sm font-bold text-warning-foreground">SIMULACIÓN ACADÉMICA — SIN VALIDEZ OFICIAL</p>
              <dl className="mt-4 space-y-2 text-sm">
                {([["Identificador", receipt.id], ["Nombre", receipt.name], ["Correo", receipt.email], ["ID opcional", receipt.demoId || "—"], ["Carrera", receipt.career], ["Campus/Sede", receipt.campus], ["Vía de ingreso", receipt.route], ["Fecha", receipt.date]] as const).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 border-b pb-1.5"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-semibold break-all">{v}</dd></div>
                ))}
              </dl>
              <p className="mt-3 text-xs text-muted-foreground">Estos datos no fueron enviados a la USM. La postulación oficial se realiza en la plataforma de Acceso Mineduc / DEMRE.</p>
            </div>
            <Button variant="gold" size="lg" className="w-full" onClick={() => downloadReceiptPdf(receipt).then(() => toast.success("Comprobante descargado")).catch(() => toast.error("No se pudo descargar. Intenta nuevamente."))}><Download />Descargar comprobante</Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={restart}>Nuevo pre-registro</Button>
              <Button asChild><Link to="/">Volver a Inicio</Link></Button>
            </div>
          </div>
        ) : (
          <>
            <ol className="grid grid-cols-3 gap-2" aria-label="Progreso">
              {STEPS.map((s, i) => (
                <li key={s} className="text-center text-xs font-semibold">
                  <span className={`mb-1 block h-1.5 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />
                  <span className={i === step ? "text-primary" : "text-muted-foreground"}>{i + 1}. {s}</span>
                </li>
              ))}
            </ol>

            {step === 0 && (
              <form noValidate onSubmit={(e) => { e.preventDefault(); next0(); }} className="space-y-3">
                <Field id="name" label="Nombre completo *" error={err.name}><input id="name" autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} className={input("name")} aria-invalid={!!err.name} /></Field>
                <Field id="email" label="Correo electrónico *" error={err.email}><input id="email" type="email" autoComplete="email" inputMode="email" value={f.email} onChange={(e) => set("email", e.target.value)} className={input("email")} aria-invalid={!!err.email} /></Field>
                <Field id="demoId" label="Identificador de demostración (opcional)"><input id="demoId" value={f.demoId} onChange={(e) => set("demoId", e.target.value)} placeholder="Ej: ALUMNO-01" className={input("demoId")} /></Field>
                <p className="text-xs text-muted-foreground">No te pediremos contraseñas, RUT ni documentos.</p>
                <Button type="submit" variant="gold" size="lg" className="w-full">Continuar</Button>
              </form>
            )}

            {step === 1 && (
              <div className="space-y-3">
                <Field id="career" label="Carrera *" error={err.career}>
                  <select id="career" value={f.career} onChange={(e) => { const c = getCareer(e.target.value); setF((p) => ({ ...p, career: e.target.value, campus: c?.campuses.length === 1 ? c.campuses[0] ?? "" : "", route: "" })); setErr({}); }} className={input("career")}>
                    <option value="">Selecciona una carrera</option>
                    {CAREERS.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </Field>
                <Field id="campus" label="Campus/Sede *" error={err.campus}>
                  <select id="campus" disabled={!career} value={f.campus} onChange={(e) => set("campus", e.target.value)} className={input("campus")}>
                    <option value="">{career ? "Selecciona campus o sede" : "Primero elige una carrera"}</option>
                    {career?.campuses.map((id) => <option key={id} value={id}>{campusName(id)}</option>)}
                  </select>
                </Field>
                <fieldset>
                  <legend className="text-sm font-semibold">Vía de ingreso *</legend>
                  {!career && <p className="mt-1 text-sm text-muted-foreground">Primero elige una carrera.</p>}
                  <div className="mt-1 space-y-2">
                    {career?.entryRoutes.map((r) => (
                      <label key={r} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3 ${f.route === r ? "border-primary bg-accent" : "bg-card"}`}>
                        <input type="radio" name="route" checked={f.route === r} onChange={() => set("route", r)} className="h-4 w-4 accent-[var(--primary)]" />
                        <span className="text-sm">{ENTRY_ROUTE_LABEL[r]}</span>
                      </label>
                    ))}
                  </div>
                  {err.route && <p className="mt-1 text-sm text-destructive">{err.route}</p>}
                </fieldset>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => setStep(0)}>Atrás</Button>
                  <Button variant="gold" onClick={next1}>Continuar</Button>
                </div>
              </div>
            )}

            {step === 2 && career && (
              <div className="space-y-3">
                <Summary title="Datos personales" onEdit={() => setStep(0)} rows={[["Nombre", f.name], ["Correo", f.email], ["ID opcional", f.demoId || "—"]]} />
                <Summary title="Preferencias" onEdit={() => setStep(1)} rows={[["Carrera", career.name], ["Campus/Sede", campusName(f.campus as CampusId)], ["Vía", ENTRY_ROUTE_LABEL[f.route as EntryRoute]]]} />
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => setStep(1)}>Atrás</Button>
                  <Button variant="gold" onClick={confirm}>Confirmar</Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string | undefined; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-destructive" role="alert">{error}</p>}
    </div>
  );
}

function Summary({ title, rows, onEdit }: { title: string; rows: [string, string][]; onEdit: () => void }) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-card">
      <div className="flex items-center justify-between"><h3 className="font-bold">{title}</h3><Button variant="ghost" size="sm" onClick={onEdit}><Pencil />Editar</Button></div>
      <dl className="mt-2 space-y-1 text-sm">{rows.map(([k, v]) => <div key={k} className="flex justify-between gap-3"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-semibold break-all">{v}</dd></div>)}</dl>
    </div>
  );
}
