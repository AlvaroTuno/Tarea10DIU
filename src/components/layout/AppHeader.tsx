import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Home, GraduationCap, Calculator, CalendarDays, Wallet, ClipboardList, Share2, Compass } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";


const MENU = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/carreras", label: "Oferta académica", icon: GraduationCap },
  { to: "/simulador", label: "Simulador PAES", icon: Calculator },
  { to: "/actividades", label: "Eventos y actividades", icon: CalendarDays },
  { to: "/becas", label: "Aranceles y becas", icon: Wallet },
  { to: "/postulacion", label: "Asistente de postulación", icon: ClipboardList },
  { to: "/redes", label: "Redes sociales", icon: Share2 },
  { to: "/tour", label: "Tour virtual", icon: Compass },
] as const;

export function AppHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-primary-deep text-primary-foreground shadow-card">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center rounded-sm bg-card px-2 py-1" aria-label="Ir al inicio">
          <img src="/images/logo.svg" alt="Universidad Técnica Federico Santa María" width={554} height={114} className="h-auto w-48 max-w-full object-contain sm:w-56" />
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button aria-label="Abrir menú" className="grid h-11 w-11 place-items-center rounded-full hover:bg-sidebar-accent">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] max-w-sm border-sidebar-border bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden">
            <div className="flex items-center justify-between border-b border-sidebar-border p-4">
              <SheetTitle className="font-display text-lg text-sidebar-foreground">Menú</SheetTitle>
              <SheetClose aria-label="Cerrar menú" className="grid h-11 w-11 place-items-center rounded-full hover:bg-sidebar-accent">
                <X className="h-5 w-5" />
              </SheetClose>
            </div>
            <nav className="p-2">
              {MENU.map(({ to, label, icon: Icon }) => (
                <a
                  key={to}
                  href={to}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center gap-3 rounded-lg px-3 font-medium hover:bg-sidebar-accent data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-primary"
                >
                  <Icon className="h-5 w-5" /> {label}
                </a>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
