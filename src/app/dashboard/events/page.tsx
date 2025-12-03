
import EventTable from '@/components/dashboard/EventTable';
import { events as mockEvents, KarateEvent } from '@/lib/mock-data';

export default function EventsPage() {
  const eventsData: KarateEvent[] = mockEvents;

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Eventos</h1>
        <p className="text-muted-foreground">
          Visualiza, crea, edita y elimina eventos y competencias.
        </p>
      </div>
      <EventTable initialEvents={eventsData} />
    </div>
  );
}

    