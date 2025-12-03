'use client';
import { useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { athletes as mockAthletes } from '@/lib/mock-data';
import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '../ui/badge';

export default function RecentAthletesTable() {
  const recentAthletes = useMemo(() => {
    return mockAthletes
      .map(a => ({ ...a, registrationDate: new Date(a.registrationDate) }))
      .filter(a => isValid(a.registrationDate))
      .sort((a, b) => b.registrationDate.getTime() - a.registrationDate.getTime())
      .slice(0, 5);
  }, []);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Atletas Recientemente Registrados</CardTitle>
        <CardDescription>
          Los últimos 5 atletas que se han unido a la plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Atleta</TableHead>
              <TableHead className="hidden sm:table-cell">Escuela</TableHead>
              <TableHead className="hidden md:table-cell">Cinturón</TableHead>
              <TableHead className="text-right">Registrado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentAthletes.map(athlete => (
              <TableRow key={athlete.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={`https://picsum.photos/seed/${athlete.id}/200/200`}
                      />
                      <AvatarFallback>
                        {getInitials(athlete.nombres, athlete.apellidos)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">
                      {athlete.nombres} {athlete.apellidos}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {athlete.escuela}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="secondary">{athlete.cinturon}</Badge>
                </TableCell>

                <TableCell className="text-right text-muted-foreground">
                  {format(athlete.registrationDate, 'dd MMM, yyyy', {
                    locale: es,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
