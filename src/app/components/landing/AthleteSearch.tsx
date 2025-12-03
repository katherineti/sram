'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Athlete, athletes } from '@/lib/mock-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';

const ITEMS_PER_PAGE = 5;

export default function AthleteSearch({ initialSearchTerm, onSearchChange }: { initialSearchTerm: string, onSearchChange: (term: string) => void }) {
  const [search, setSearch] = useState(initialSearchTerm || '');

  useEffect(() => {
    setSearch(initialSearchTerm || '');
  }, [initialSearchTerm]);
  
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAthletes = useMemo(() => {
    const lowercasedSearch = (search || '').toLowerCase();
    if (!lowercasedSearch) return athletes;

    return athletes.filter((athlete) => {
      return (
        athlete.nombres.toLowerCase().includes(lowercasedSearch) ||
        athlete.apellidos.toLowerCase().includes(lowercasedSearch) ||
        athlete.cedula.includes(lowercasedSearch)
      );
    });
  }, [search]);

  const totalPages = Math.ceil(filteredAthletes.length / ITEMS_PER_PAGE);
  const paginatedAthletes = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAthletes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAthletes, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleLocalSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearch(newSearchTerm);
    if (typeof onSearchChange === 'function') {
      onSearchChange(newSearchTerm);
    }
    setCurrentPage(1);
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Input
          type="text"
          placeholder="Buscar por nombre, apellido o cédula..."
          value={search || ''}
          onChange={handleLocalSearchChange}
          className="pr-10 text-base py-6"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </div>

      <Card className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[50px]">Nº</TableHead>
              <TableHead>Nombres</TableHead>
              <TableHead>Apellidos</TableHead>
              <TableHead className="hidden sm:table-cell">Edad</TableHead>
              <TableHead>Escuela</TableHead>
              <TableHead className="hidden sm:table-cell">Cinturón</TableHead>
              <TableHead className="text-right">Ranking</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAthletes.length > 0 ? (
              paginatedAthletes.map((athlete, index) => (
                <TableRow key={athlete.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <TableCell className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                  <TableCell>{athlete.nombres}</TableCell>
                  <TableCell>{athlete.apellidos}</TableCell>
                  <TableCell className="hidden sm:table-cell">{athlete.edad}</TableCell>
                  <TableCell>{athlete.escuela}</TableCell>
                  <TableCell className="hidden sm:table-cell">{athlete.cinturon}</TableCell>
                  <TableCell className="text-right font-mono">{athlete.ranking}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-primary-foreground/90">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="secondary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
