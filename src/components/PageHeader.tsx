import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({ title, subtitle, back }: { title: string; subtitle?: ReactNode; back?: { to: string; label: string } }) {
  return (
    <div className="bg-primary px-4 pb-6 pt-4 text-primary-foreground">
      <div className="mx-auto max-w-5xl">
        {back && (
          <Link to={back.to} className="-ml-2 mb-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-sm opacity-90 hover:opacity-100">
            <ArrowLeft className="h-4 w-4" /> {back.label}
          </Link>
        )}
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm opacity-85">{subtitle}</p>}
      </div>
    </div>
  );
}

export function Notice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warn" }) {
  return (
    <div className={`rounded-xl border p-3 text-sm ${tone === "warn" ? "border-gold bg-warning text-warning-foreground" : "bg-accent text-accent-foreground"}`} role="note">
      {children}
    </div>
  );
}
