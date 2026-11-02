import type { Weights } from "@/data/careers";

export type ScoreKey = "nem" | "ranking" | "lectora" | "m1" | "m2" | "ciencias" | "historia";
export type Scores = Record<ScoreKey, string>;

export const SCORE_LABELS: Record<ScoreKey, string> = {
  nem: "NEM",
  ranking: "Ranking",
  lectora: "Competencia Lectora",
  m1: "Competencia Matemática 1 (M1)",
  m2: "Competencia Matemática 2 (M2)",
  ciencias: "Ciencias",
  historia: "Historia y Ciencias Sociales",
};

export const emptyScores = (): Scores => ({ nem: "", ranking: "", lectora: "", m1: "", m2: "", ciencias: "", historia: "" });

export const MIN = 100;
export const MAX = 1000;
export const MIN_PROMEDIO_L_M1 = 485;

export function weightsSum(w: Weights) {
  return Math.round((w.nem + w.ranking + w.lectora + w.m1 + (w.m2 ?? 0) + w.electiva) * 1000) / 1000;
}

const parse = (v: string) => (v.trim() === "" ? null : Number(v.replace(",", ".")));

/** Valida puntajes según las reglas de la carrera. Devuelve errores por campo. */
export function validateScores(s: Scores, w: Weights | null): Partial<Record<ScoreKey, string>> {
  const errors: Partial<Record<ScoreKey, string>> = {};
  (Object.keys(s) as ScoreKey[]).forEach((k) => {
    const n = parse(s[k]);
    if (n !== null && (Number.isNaN(n) || n < MIN || n > MAX)) errors[k] = `Debe estar entre ${MIN} y ${MAX}.`;
  });
  const required: ScoreKey[] = ["nem", "ranking", "lectora", "m1"];
  if (w?.m2) required.push("m2");
  required.forEach((k) => {
    if (!errors[k] && parse(s[k]) === null) errors[k] = "Campo obligatorio.";
  });
  if (parse(s.ciencias) === null && parse(s.historia) === null && !errors.ciencias && !errors.historia) {
    errors.ciencias = "Ingresa al menos una prueba electiva (Ciencias o Historia).";
  }
  return errors;
}

export function calcWeighted(s: Scores, w: Weights) {
  const v = (k: ScoreKey) => parse(s[k]) ?? 0;
  const c = parse(s.ciencias);
  const h = parse(s.historia);
  const electiva = Math.max(c ?? 0, h ?? 0);
  const electivaUsed: ScoreKey = (c ?? 0) >= (h ?? 0) ? "ciencias" : "historia";
  const total =
    v("nem") * w.nem + v("ranking") * w.ranking + v("lectora") * w.lectora + v("m1") * w.m1 + (w.m2 ? v("m2") * w.m2 : 0) + electiva * w.electiva;
  const promedioLM1 = (v("lectora") + v("m1")) / 2;
  return { total: Math.round(total * 10) / 10, electivaUsed, promedioLM1, meetsMinimum: promedioLM1 >= MIN_PROMEDIO_L_M1 };
}
