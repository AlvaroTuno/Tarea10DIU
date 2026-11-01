import { Link } from "@tanstack/react-router";
import { Home, GraduationCap, Calculator, ClipboardList } from "lucide-react";

const ITEMS = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/carreras", label: "Carreras", icon: GraduationCap },
  { to: "/simulador", label: "Simulador", icon: Calculator },
  { to: "/postulacion", label: "Postulación", icon: ClipboardList },
] as const;

export function BottomNav() {
  return (
    <nav aria-label="Navegación principal" className="fixed inset-x-0 bottom-0 z-40 border-t bg-card safe-bottom shadow-card">
      <ul className="mx-auto grid h-16 max-w-5xl grid-cols-4">
        {ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="group flex h-full flex-col items-center justify-center gap-0.5 text-xs font-medium text-muted-foreground data-[status=active]:text-primary"
            >
              <span className="grid h-7 w-12 place-items-center rounded-full group-data-[status=active]:bg-accent">
                <Icon className="h-5 w-5" />
              </span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
