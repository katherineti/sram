'use client';
import CalendarView from '@/components/dashboard/CalendarView';

export default function CalendarPage() {
  return (
    <div className="flex flex-col h-full gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendario de Eventos</h1>
        <p className="text-muted-foreground">
          Visualiza los eventos programados en el mes o en todo el año.
        </p>
      </div>
      <div className="flex-grow flex flex-col">
        <CalendarView />
      </div>
    </div>
  );
}
