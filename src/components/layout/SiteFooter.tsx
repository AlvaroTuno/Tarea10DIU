import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const SECTIONS: { title: string; links: [string, string][] }[] = [
  {
    title: "Universidad",
    links: [
      ["Sitio oficial USM", "https://usm.cl/"],
      ["Campus y sedes", "https://usm.cl/universidad/campus-y-sedes/"],
    ],
  },
  {
    title: "Admisión",
    links: [
      ["Admisión USM", "https://usm.cl/admision/"],
      ["Admisión centralizada PAES", "https://usm.cl/admision/admision-centralizada-paes/"],
      ["DEMRE", "https://demre.cl/"],
    ],
  },
  {
    title: "Contacto",
    links: [
      ["Casa Central: +56 32 265 4121", "tel:+56322654121"],
      ["San Joaquín: +56 2 2303 7000", "tel:+56223037000"],
      ["Correo DGC: dgc@usm.cl", "mailto:dgc@usm.cl"],
    ],
  },
  {
    title: "Enlaces institucionales",
    links: [
      ["Tour virtual 360°", "https://tour360.usm.cl/"],
      ["Beneficios estudiantiles Mineduc", "https://portal.beneficiosestudiantiles.cl/"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-10 bg-primary-deep px-4 py-6 text-primary-foreground">
      <div className="mx-auto max-w-5xl">
        <Accordion type="multiple">
          {SECTIONS.map((s) => (
            <AccordionItem key={s.title} value={s.title} className="border-sidebar-border">
              <AccordionTrigger className="min-h-12 font-display text-base hover:no-underline">{s.title}</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1">
                  {s.links.map(([label, href]) => (
                    <li key={href}>
                      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="inline-flex min-h-10 items-center opacity-90 hover:text-gold">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p className="mt-5 text-xs opacity-70">MVP académico no oficial. Información referencial basada en usm.cl y demre.cl.</p>
      </div>
    </footer>
  );
}
