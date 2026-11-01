import type { Career } from "@/data/careers";

async function getDoc() {
  const { jsPDF } = await import("jspdf");
  return new jsPDF({ unit: "mm", format: "a4" });
}

export async function downloadMallaPdf(c: Career) {
  if (!c.plan) return;
  const doc = await getDoc();
  doc.setFontSize(16);
  doc.text(`Malla curricular — ${c.name}`, 15, 18);
  doc.setFontSize(9);
  doc.text("Universidad Técnica Federico Santa María · Información referencial, sujeta a modificaciones.", 15, 25);
  doc.text(`Fuente: ${c.officialUrl}`, 15, 30);
  let y = 40;
  for (const s of c.plan) {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`${s.n}º Semestre`, 15, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    y += 5;
    for (const course of s.courses) {
      doc.text(`• ${course}`, 20, y);
      y += 4.5;
    }
    y += 3;
  }
  doc.save(`malla-${c.slug}.pdf`);
}

export interface Receipt {
  id: string;
  name: string;
  email: string;
  demoId: string;
  career: string;
  campus: string;
  route: string;
  date: string;
}

export async function downloadReceiptPdf(r: Receipt) {
  const doc = await getDoc();
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("SIMULACIÓN ACADÉMICA — SIN VALIDEZ OFICIAL", 15, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Comprobante de pre-registro simulado · MVP Portal Admisión USM", 15, 28);
  const rows: [string, string][] = [
    ["Identificador de demostración", r.id],
    ["Nombre", r.name],
    ["Correo", r.email],
    ["ID opcional", r.demoId || "—"],
    ["Carrera", r.career],
    ["Campus/Sede", r.campus],
    ["Vía de ingreso", r.route],
    ["Fecha", r.date],
  ];
  let y = 42;
  rows.forEach(([k, v]) => {
    doc.setFont("helvetica", "bold");
    doc.text(k + ":", 15, y);
    doc.setFont("helvetica", "normal");
    doc.text(v, 75, y);
    y += 8;
  });
  doc.setFontSize(9);
  doc.text("Estos datos NO fueron enviados a la USM ni al DEMRE. Se generaron solo en tu navegador.", 15, y + 8);
  doc.text("La postulación oficial se realiza en la plataforma de Acceso Mineduc / DEMRE.", 15, y + 13);
  doc.save(`comprobante-${r.id}.pdf`);
}
