'use client';

import {
  format,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { KarateEvent } from '@/lib/mock-data';
import { Badge } from '../ui/badge';

interface YearViewProps {
  year: number;
  events: KarateEvent[];
}

const competitionColors = 'bg-blue-500';
const seminarioColors = 'bg-primary';
const exhibicionColors = 'bg-emerald-500';

const typeColorMap: Record<KarateEvent['type'], string> = {
    competencia: competitionColors,
    seminario: seminarioColors,
    exhibicion: exhibicionColors,
};

const weekDays = ["D", "L", "M", "M", "J", "V", "S"];

const MiniMonth = ({ month, year, events }: { month: number, year: number, events: KarateEvent[] }) => {
  const monthDate = new Date(year, month);
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = eachDayOfInterval({
    start: startOfWeek(firstDay, { locale: es }),
    end: endOfWeek(lastDay, { locale: es }),
  });

  return (
    <div className="p-2">
      <h3 className="text-sm font-semibold text-center mb-2 capitalize">{format(monthDate, 'MMMM', { locale: es })}</h3>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {weekDays.map((day, i) => <div key={i}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 grid-rows-6 gap-1 mt-1">
        {days.map(day => {
          const eventsForDay = events.filter(event => isSameDay(event.date, day));
          return (
            <div key={day.toString()} className="relative aspect-square">
              <span className={cn(
                "flex items-center justify-center h-full w-full rounded-full text-xs",
                !isSameMonth(day, monthDate) && "text-muted-foreground",
                isToday(day) && "bg-primary text-primary-foreground",
              )}>
                {format(day, 'd')}
              </span>
               {eventsForDay.length > 0 && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {eventsForDay.slice(0, 3).map(event => (
                        <div key={event.id} className={cn("h-1 w-1 rounded-full", typeColorMap[event.type])} />
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default function YearView({ year, events }: YearViewProps) {
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4 overflow-y-auto">
      {months.map(month => (
        <MiniMonth key={month} month={month} year={year} events={events} />
      ))}
    </div>
  );
}
