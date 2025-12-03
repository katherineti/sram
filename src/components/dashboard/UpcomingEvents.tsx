'use client';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { events as mockEvents, KarateEvent } from '@/lib/mock-data';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Trophy, Presentation, Eye } from 'lucide-react';
import { Separator } from '../ui/separator';

const typeIconMap: Record<KarateEvent['type'], React.ElementType> = {
    competencia: Trophy,
    seminario: Presentation,
    exhibicion: Eye,
};

const competitionColors = 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
const seminarioColors = 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground/80';
const exhibicionColors = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300';

const typeVariantMap: Record<KarateEvent['type'], string> = {
    competencia: competitionColors,
    seminario: seminarioColors,
    exhibicion: exhibicionColors,
};

export default function UpcomingEvents() {
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return mockEvents
      .filter(event => event.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Próximos Eventos</CardTitle>
        <CardDescription>Los 5 eventos más cercanos en el calendario.</CardDescription>
      </CardHeader>
      <CardContent>
        {upcomingEvents.length > 0 ? (
          <ul className="space-y-4">
            {upcomingEvents.map((event, index) => {
              const Icon = typeIconMap[event.type];
              return (
                <li key={event.id}>
                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                        <div className={`p-3 rounded-full ${typeVariantMap[event.type]}`}>
                            <Icon className="h-5 w-5" />
                        </div>
                        <div className='min-w-0'>
                            <p className="font-semibold truncate">{event.name}</p>
                            <p className="text-sm text-muted-foreground">{event.location}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-sm font-medium">{format(event.date, 'dd MMM', { locale: es })}</p>
                             <p className="text-xs text-muted-foreground">{format(event.date, 'yyyy', { locale: es })}</p>
                        </div>
                    </div>
                    {index < upcomingEvents.length - 1 && <Separator className="mt-4"/>}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No hay eventos programados.</p>
        )}
      </CardContent>
    </Card>
  );
}
