export type CampusId = "valparaiso" | "san-joaquin" | "vitacura" | "vina" | "concepcion";

export const CAMPUSES: { id: CampusId; name: string }[] = [
  { id: "valparaiso", name: "Casa Central Valparaíso" },
  { id: "san-joaquin", name: "Campus San Joaquín" },
  { id: "vitacura", name: "Campus Vitacura" },
  { id: "vina", name: "Sede Viña del Mar" },
  { id: "concepcion", name: "Sede Concepción" },
];

export const campusName = (id: CampusId) => CAMPUSES.find((c) => c.id === id)?.name ?? id;

export type Area = "Ingeniería" | "Negocios" | "Arquitectura y Diseño";
export const AREAS: Area[] = ["Ingeniería", "Negocios", "Arquitectura y Diseño"];

/** Ponderaciones como decimales. m2 = null si la carrera no exige M2. */
export interface Weights {
  nem: number;
  ranking: number;
  lectora: number;
  m1: number;
  m2: number | null;
  electiva: number;
}

/** Referencia publicada por USM para Admisión 2026 (usm.cl/admision/admision-centralizada-paes). */
export const WEIGHTS_2026_CON_M2: Weights = { nem: 0.15, ranking: 0.2, lectora: 0.1, m1: 0.35, m2: 0.1, electiva: 0.1 };
export const WEIGHTS_2026_SIN_M2: Weights = { nem: 0.15, ranking: 0.25, lectora: 0.1, m1: 0.4, m2: null, electiva: 0.1 };

export type EntryRoute = "centralizada" | "especial" | "directo";
export const ENTRY_ROUTE_LABEL: Record<EntryRoute, string> = {
  centralizada: "Admisión centralizada (PAES)",
  especial: "Admisión especial",
  directo: "Ingreso directo a carrera técnica/profesional",
};

export interface Semester {
  n: number;
  courses: string[];
}

export interface Career {
  slug: string;
  name: string;
  area: Area;
  category: "Pregrado Diurno";
  durationYears: number;
  durationLabel: string;
  title: string | null;
  degree: string | null;
  campuses: CampusId[];
  description: string;
  profile: string | null;
  plan: Semester[] | null;
  fee: { amount: number; year: string } | null;
  weights: Weights | null;
  weightsNote: string;
  /** Puntaje del último seleccionado por campus (referencial). */
  cutoffs: Partial<Record<CampusId, { score: number; year: number; source: string }>>;
  entryRoutes: EntryRoute[];
  officialUrl: string;
}

const CUTOFF_SOURCE = "Último seleccionado lista regular (microdatos DEMRE, vía apren.ai)";

export const CAREERS: Career[] = [
  {
    slug: "ingenieria-civil-informatica",
    name: "Ingeniería Civil Informática",
    area: "Ingeniería",
    category: "Pregrado Diurno",
    durationYears: 5,
    durationLabel: "5 años (10 semestres académicos)",
    title: "Ingeniero/a Civil Informático/a",
    degree: "Licenciado/a en Ciencias de la Ingeniería Informática",
    campuses: ["valparaiso", "san-joaquin"],
    description:
      "Forma profesionales capaces de diseñar soluciones de software sostenibles y escalables, analizar sistemas computacionales en rendimiento, conectividad y seguridad, y apoyar estratégicamente a las organizaciones integrando personas y tecnologías de información. Esta carrera exige rendir la PAES M2.",
    profile:
      "El/La Ingeniero/a Civil Informático/a de la USM se forma para apoyar estratégicamente la mejora continua de las organizaciones, integrando eficientemente a las personas y tecnologías de información. Domina la evaluación y toma de decisiones basadas en técnicas cuantitativas en contextos de incertidumbre, diseñando soluciones de software sostenibles y escalables, con compromiso con la calidad y la innovación. Es capaz de analizar sistemas computacionales a nivel de rendimiento, conectividad y seguridad, y diseña soluciones computacionales robustas aplicando algoritmos y fundamentos teóricos.\n\nGestiona recursos y promueve mejoras continuas en lo personal y profesional. Lidera equipos colaborativos y se comunica efectivamente en español e inglés, actuando con responsabilidad social y ética, en coherencia con el legado de Don Federico Santa María.",
    plan: [
      { n: 1, courses: ["Programación", "Matemática I", "Introducción a la Física", "Humanístico I", "Educación Física I"] },
      { n: 2, courses: ["Introducción a la Ingeniería", "Matemática II", "Física General I", "Química y Sociedad", "Humanístico II", "Educación Física II"] },
      { n: 3, courses: ["Estructuras de Datos", "Matemática III", "Física General III", "Estructuras Discretas", "Teoría de Sistemas", "Libre 1 / Actividad co-curricular"] },
      { n: 4, courses: ["Lenguajes de Programación", "Matemática IV", "Física General II", "Informática Teórica", "Economía I-A", "Libre 2 / Actividad co-curricular"] },
      { n: 5, courses: ["Bases de Datos", "Estadística Computacional", "Arquitectura y Organización de Computadores", "Física General IV", "Organizaciones y Sistemas de Información", "Libre 3 / Actividad co-curricular"] },
      { n: 6, courses: ["Análisis y Diseño de Software", "Optimización", "Sistemas Operativos", "Algoritmos y Complejidad", "Ingeniería, Informática y Sociedad", "Libre 4 / Actividad co-curricular"] },
      { n: 7, courses: ["Ingeniería de Software", "Investigación de Operaciones", "Redes de Computadores", "Computación Científica", "Información y Matemática Financiera", "Libre 5 / Actividad co-curricular"] },
      { n: 8, courses: ["Diseño de Interfaces Usuarias", "Inteligencia Artificial", "Sistemas Distribuidos", "Electivo de Informática 1", "Sistemas de Gestión", "Libre 6 / Actividad co-curricular"] },
      { n: 9, courses: ["Electivo de Informática 2", "Electivo de Informática 3", "Electivo I", "Electivo II", "Gestión de Proyectos de Informática", "Libre 7 / Actividad co-curricular"] },
      { n: 10, courses: ["Electivo de Informática 4", "Electivo III", "Electivo IV", "Taller Desarrollo de Proyecto de Informática", "Trabajo de Título I"] },
      { n: 11, courses: ["Trabajo de Título II"] },
    ],
    fee: { amount: 7540000, year: "Admisión 2027" },
    weights: WEIGHTS_2026_CON_M2,
    weightsNote: "Ponderaciones referenciales Admisión 2026 (programas con M2). Las definitivas se publican en demre.cl.",
    cutoffs: {
      valparaiso: { score: 771.8, year: 2026, source: CUTOFF_SOURCE },
      "san-joaquin": { score: 820.1, year: 2026, source: CUTOFF_SOURCE },
    },
    entryRoutes: ["centralizada", "especial"],
    officialUrl: "https://usm.cl/admision/carreras/ingenieria-civil-informatica/",
  },
  {
    slug: "ingenieria-civil-industrial",
    name: "Ingeniería Civil Industrial",
    area: "Ingeniería",
    category: "Pregrado Diurno",
    durationYears: 5,
    durationLabel: "Información referencial: consultar sitio oficial",
    title: null,
    degree: null,
    campuses: ["valparaiso", "vitacura"],
    description:
      "Carrera de ingeniería orientada a la gestión, optimización y mejora de sistemas productivos y organizaciones. Exige rendir la PAES M2 (Admisión 2026).",
    profile: null,
    plan: null,
    fee: null,
    weights: WEIGHTS_2026_CON_M2,
    weightsNote: "Ponderaciones referenciales Admisión 2026 (programas con M2).",
    cutoffs: {},
    entryRoutes: ["centralizada", "especial"],
    officialUrl: "https://usm.cl/admision/carreras/",
  },
  {
    slug: "ingenieria-comercial",
    name: "Ingeniería Comercial",
    area: "Negocios",
    category: "Pregrado Diurno",
    durationYears: 5,
    durationLabel: "Información referencial: consultar sitio oficial",
    title: null,
    degree: null,
    campuses: ["valparaiso", "vitacura"],
    description:
      "Carrera del área de negocios y economía. Es la única ingeniería USM que no exige PAES M2 (Admisión 2026).",
    profile: null,
    plan: null,
    fee: null,
    weights: WEIGHTS_2026_SIN_M2,
    weightsNote: "Ponderaciones referenciales Admisión 2026 (programas sin M2).",
    cutoffs: {},
    entryRoutes: ["centralizada", "especial"],
    officialUrl: "https://usm.cl/admision/carreras/",
  },
  {
    slug: "arquitectura",
    name: "Arquitectura",
    area: "Arquitectura y Diseño",
    category: "Pregrado Diurno",
    durationYears: 5,
    durationLabel: "Información referencial: consultar sitio oficial",
    title: null,
    degree: null,
    campuses: ["valparaiso", "san-joaquin"],
    description: "Carrera de pregrado diurno en arquitectura. Ponderaciones y requisitos específicos: dato no disponible.",
    profile: null,
    plan: null,
    fee: null,
    weights: null,
    weightsNote: "Dato no disponible: ponderaciones específicas no verificadas.",
    cutoffs: {},
    entryRoutes: ["centralizada", "especial"],
    officialUrl: "https://usm.cl/admision/carreras/",
  },
  {
    slug: "ingenieria-en-informatica",
    name: "Ingeniería en Informática",
    area: "Ingeniería",
    category: "Pregrado Diurno",
    durationYears: 4,
    durationLabel: "Información referencial: consultar sitio oficial",
    title: null,
    degree: null,
    campuses: ["vina", "concepcion"],
    description: "Carrera impartida en las sedes Viña del Mar y Concepción. Requisitos de ingreso específicos: dato no disponible.",
    profile: null,
    plan: null,
    fee: null,
    weights: null,
    weightsNote: "Dato no disponible: ponderaciones específicas no verificadas.",
    cutoffs: {},
    entryRoutes: ["centralizada", "especial", "directo"],
    officialUrl: "https://usm.cl/admision/carreras/",
  },
];

export const getCareer = (slug: string) => CAREERS.find((c) => c.slug === slug);

export const formatCLP = (n: number) => "$" + n.toLocaleString("es-CL") + " CLP";
