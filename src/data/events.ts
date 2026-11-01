export type EventType = "Ensayos PAES" | "Puertas Abiertas" | "Admisión" | "Charlas";
export const EVENT_TYPES: EventType[] = ["Ensayos PAES", "Puertas Abiertas", "Admisión", "Charlas"];

export interface UsmEvent {
  id: string;
  name: string;
  type: EventType;
  start: string; // YYYY-MM-DD
  end?: string;
  time: string;
  location: string;
  description: string;
  registration: string | null; // null = sin inscripción oficial confirmada
  source: string;
}

export const EVENTS: UsmEvent[] = [
  {
    id: "ensayo-paes-usm-2026",
    name: "Ensayo PAES USM",
    type: "Ensayos PAES",
    start: "2026-05-16",
    time: "Dato no disponible",
    location: "Campus y sedes USM (información referencial)",
    description: "Ensayo de la Prueba de Acceso a la Educación Superior organizado por la USM para practicar en condiciones similares a la prueba oficial.",
    registration: null,
    source: "https://usm.cl/admision/",
  },
  {
    id: "ensayo-nacional-paes-2026",
    name: "Ensayo Nacional PAES",
    type: "Ensayos PAES",
    start: "2026-08-01",
    time: "Dato no disponible",
    location: "Información referencial",
    description: "Ensayo nacional de la PAES del ciclo de Admisión 2027.",
    registration: null,
    source: "https://usm.cl/admision/",
  },
  {
    id: "tercer-ensayo-paes-2026",
    name: "Tercer Ensayo PAES",
    type: "Ensayos PAES",
    start: "2026-10-17",
    time: "Dato no disponible",
    location: "Información referencial",
    description: "Tercer ensayo PAES del ciclo 2026, última instancia de práctica antes de la prueba oficial.",
    registration: null,
    source: "https://usm.cl/admision/",
  },
  {
    id: "postulacion-centralizada-2027",
    name: "Postulación centralizada Admisión 2027",
    type: "Admisión",
    start: "2027-01-04",
    end: "2027-01-07",
    time: "Según calendario DEMRE",
    location: "En línea, plataforma oficial de Acceso (acceso.mineduc.cl / demre.cl)",
    description: "Período en que los postulantes ordenan sus preferencias de carreras en el Sistema de Acceso. En la USM puedes incluir hasta 20 preferencias y no hay exclusión por orden.",
    registration: null,
    source: "https://usm.cl/admision/admision-centralizada-paes/",
  },
];

export const toDate = (s: string) => {
  const [y = 1970, m = 1, d = 1] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export function eventStatus(e: UsmEvent, today = new Date()): "Finalizado" | "En curso" | "Próximo" {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const s = toDate(e.start).getTime();
  const en = toDate(e.end ?? e.start).getTime();
  if (en < t) return "Finalizado";
  if (s <= t) return "En curso";
  return "Próximo";
}

export function formatEventDate(e: UsmEvent) {
  const f = (s: string) => toDate(s).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });
  return e.end ? `${f(e.start)} al ${f(e.end)}` : f(e.start);
}

export function eventsOnDay(d: Date) {
  return EVENTS.filter((e) => {
    const t = d.getTime();
    return toDate(e.start).getTime() <= t && t <= toDate(e.end ?? e.start).getTime();
  });
}
