'use client';

import { useState } from 'react';
import { Combobox } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { schools, School, Athlete, athletes } from '@/lib/mock-data';
import { Download, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function SchoolSearch() {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { toast } = useToast();

  const handleDownload = () => {
    if (!selectedSchool) return;

    setIsGeneratingPdf(true);
    const worker = new Worker(new URL('@/workers/pdf-worker', import.meta.url));

    worker.onmessage = (event: MessageEvent<Blob>) => {
      const blob = event.data;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_${selectedSchool.value}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      worker.terminate();
      setIsGeneratingPdf(false);
    };

    worker.onerror = (error) => {
      console.error('PDF Worker Error:', error);
      toast({
        variant: "destructive",
        title: "Error al generar PDF",
        description: "Hubo un problema al crear el reporte. Por favor, intenta de nuevo.",
      });
      worker.terminate();
      setIsGeneratingPdf(false);
    };

    const schoolAthletes = athletes.filter(a => a.escuela === selectedSchool.label);
    
    worker.postMessage({
      school: selectedSchool,
      athletes: schoolAthletes,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4 items-end">
        <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="school-search" className="text-primary-foreground">Busca por escuela</Label>
            <Combobox
                items={schools}
                searchPlaceholder="Buscar escuela..."
                selectPlaceholder="Selecciona una escuela"
                onSelect={(value) => {
                    const school = schools.find((s) => s.value === value);
                    setSelectedSchool(school || null);
                }}
            />
        </div>
        <Button 
            disabled={!selectedSchool || isGeneratingPdf}
            onClick={handleDownload}
            className="w-full sm:w-auto"
            variant="secondary"
        >
          {isGeneratingPdf ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
              <Download className="mr-2 h-4 w-4" />
          )}
          {isGeneratingPdf ? 'Generando...' : 'Descargar PDF'}
        </Button>
      </div>
      {selectedSchool && (
          <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm animate-in fade-in-50">
              <h3 className="font-headline text-2xl font-semibold text-primary">{selectedSchool.label}</h3>
              <p className="text-muted-foreground mt-2">
                Mostrando información para la escuela seleccionada. La funcionalidad de descarga generará un informe detallado en formato PDF con todos los atletas, su ranking y estadísticas.
              </p>
          </div>
      )}
    </div>
  );
}
