export function StatusBadge({ status }: { status: "Finalizado" | "En curso" | "Próximo" }) {
  const cls =
    status === "Finalizado" ? "bg-muted text-muted-foreground" : status === "En curso" ? "bg-success text-success-foreground" : "bg-gold text-gold-foreground";
  return <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>{status}</span>;
}
