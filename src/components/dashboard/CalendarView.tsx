'use client';

import { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Trophy,
  Presentation,
  Eye,
  Info,
  MapPin,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  addYears,
  subYears
} from 'date-fns';
import { es } from 'date-fns/locale';
import { events as mockEvents, KarateEvent } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import YearView from './YearView';

const competitionColors = 'bg-blue-500 hover:bg-blue-600';
const seminarioColors = 'bg-primary hover:bg-primary/90';
const exhibicionColors = 'bg-emerald-500 hover:bg-emerald-600';


const typeVariantMap: Record<KarateEvent['type'], string> = {
    competencia: `text-white ${competitionColors}`,
    seminario: `text-primary-foreground ${seminarioColors}`,
    exhibicion: `text-white ${exhibicionColors}`,
};

const typeIconMap: Record<KarateEvent['type'], React.ElementType> = {
  competencia: Trophy,
  seminario: Presentation,
  exhibicion: Eye,
};

type ViewMode = 'mes' | 'año';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('mes');

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(firstDayOfMonth, { locale: es }),
    end: endOfWeek(lastDayOfMonth, { locale: es }),
  });

  const events = useMemo(() => {
    return mockEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, []);

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.date, day));
  };

  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const handlePrev = () => {
    if (viewMode === 'mes') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subYears(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'mes') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addYears(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const headerLabel = viewMode === 'mes' 
    ? format(currentDate, 'MMMM yyyy', { locale: es })
    : format(currentDate, 'yyyy', { locale: es });

  return (
    <div className="flex h-full flex-col bg-card rounded-lg border shadow-sm">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={goToToday}>
                Hoy
            </Button>
            <div className="flex items-center gap-1">
                <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                aria-label={viewMode === 'mes' ? 'Mes anterior' : 'Año anterior'}
                >
                <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                aria-label={viewMode === 'mes' ? 'Siguiente mes' : 'Siguiente año'}
                >
                <ChevronRight className="h-5 w-5" />
                </Button>
            </div>
        </div>
        <h2 className="text-lg font-semibold capitalize">
          {headerLabel}
        </h2>
         <Select value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Vista" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="mes">Mes</SelectItem>
                <SelectItem value="año">Año</SelectItem>
            </SelectContent>
        </Select>
      </header>
      
      {viewMode === 'mes' ? (
        <div className="grid flex-1 grid-cols-7 grid-rows-[auto,1fr]">
            {weekDays.map(day => (
            <div
                key={day}
                className="border-b border-r p-2 text-center text-sm font-medium text-muted-foreground"
            >
                {day}
            </div>
            ))}
            
            <div className="col-span-7 grid grid-cols-7 grid-rows-6">
                {daysInMonth.map(day => {
                const eventsForDay = getEventsForDay(day);
                return (
                    <div
                    key={day.toString()}
                    className={cn(
                        'relative flex flex-col border-b border-r p-1 transition-colors duration-200',
                        isSameMonth(day, currentDate)
                        ? 'hover:bg-accent/50'
                        : 'bg-muted/30 text-muted-foreground',
                    )}
                    >
                    <time
                        dateTime={format(day, 'yyyy-MM-dd')}
                        className={cn(
                            'flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium mb-1',
                            isToday(day) && 'bg-primary text-primary-foreground'
                        )}
                    >
                        {format(day, 'd')}
                    </time>
                    <div className="mt-1 flex-1 space-y-1 overflow-y-auto">
                        {eventsForDay.map(event => {
                            const Icon = typeIconMap[event.type];
                            return (
                            <Popover key={event.id}>
                                <PopoverTrigger asChild>
                                    <Badge
                                        className={cn(
                                            "flex w-full cursor-pointer items-center gap-1.5 p-1 text-xs hover:opacity-80",
                                            typeVariantMap[event.type]
                                        )}
                                        >
                                        <Icon className="h-3 w-3 flex-shrink-0" />
                                        <p className="truncate font-medium">{event.name}</p>
                                    </Badge>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h3 className="font-medium leading-none flex items-center gap-2">
                                            <Icon className="h-5 w-5 text-primary" />
                                            {event.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                        {format(event.date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                                        </p>
                                    </div>
                                    <Separator />
                                    <div className="space-y-4 text-sm">
                                        <div className="flex items-start gap-3">
                                            <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                                            <p className="text-muted-foreground">{event.description}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-muted-foreground">{event.location}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-muted-foreground capitalize">{event.status}</p>
                                        </div>
                                    </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            );
                        })}
                        </div>
                    </div>
                );
                })}
            </div>
        </div>
      ) : (
        <YearView year={currentDate.getFullYear()} events={events} />
      )}
    </div>
  );
}
