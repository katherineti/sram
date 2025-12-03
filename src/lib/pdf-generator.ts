import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { School, Athlete } from './mock-data';
import { format } from 'date-fns';

export const generateSchoolReport = (school: School, athletes: Athlete[]): Blob => {
  const doc = new jsPDF();
  const primaryColor = '#f54400';
  const titleX = 15;
  const startY = 15;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor);
  doc.text(school.label, titleX, startY);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(`Reporte de Atletas - ${format(new Date(), 'dd/MM/yyyy')}`, titleX, startY + 6);
  
  doc.setDrawColor(primaryColor);
  doc.setLineWidth(0.5);
  doc.line(titleX, startY + 10, 195, startY + 10);

  const sortedAthletes = [...athletes].sort((a, b) => b.ranking - a.ranking);

  autoTable(doc, {
    startY: startY + 18,
    head: [['Ranking', 'Nombre Completo', 'Edad', 'Cinturón', 'Puntos']],
    body: sortedAthletes.map((athlete, index) => [
      index + 1,
      `${athlete.nombres} ${athlete.apellidos}`,
      athlete.edad,
      athlete.cinturon,
      athlete.ranking,
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: [245, 68, 0], // Primary color
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      cellPadding: 3,
      fontSize: 10,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245], // Light gray
    },
    margin: { top: 40 },
  });

  const pageCount = (doc as any).internal.getNumberOfPages();
  doc.setFontSize(10);
  doc.setTextColor(150);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      287,
      { align: 'center' }
    );
  }

  return doc.output('blob');
};
