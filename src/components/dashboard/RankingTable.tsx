"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Search, Trophy, Building, Medal, Calendar, Edit, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { Combobox } from "../ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import RankingEditForm from "./RankingEditForm";
import AssignRankingForm from "./AssignRankingForm";
import type { Athlete, School } from "@/lib/mock-data";


const ITEMS_PER_PAGE = 8;
const CURRENT_YEAR = new Date().getFullYear();

const getCategory = (age: number): string => {
    if (age <= 5) return 'Hasta 5 años (mixto)';
    if (age <= 7) return 'Infantil A';
    if (age <= 9) return 'Infantil B';
    if (age <= 11) return 'Infantil C';
    if (age <= 13) return 'Cadete';
    if (age <= 15) return 'Junior';
    if (age <= 17) return 'Sub-21';
    return 'Adulto';
};

interface RankingTableProps {
  initialAthletes: Athlete[];
  schools: School[];
}

export default function RankingTable({ initialAthletes, schools }: RankingTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState(Math.max(CURRENT_YEAR, 2025).toString());
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  
  const [athletesData, setAthletesData] = useState<Athlete[]>(initialAthletes);
  const isDataLoading = false;

  const categories = useMemo(() => ["all", ...Array.from(new Set(initialAthletes.map(a => getCategory(a.edad))))], [initialAthletes]);
  const years = useMemo(() => {
    const startYear = 2020;
    const endYear = Math.max(CURRENT_YEAR, 2025);
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i);
  }, []);
  
  const handleEditSuccess = (updatedAthlete: Athlete) => {
    setAthletesData(prev => prev.map(a => a.id === updatedAthlete.id ? updatedAthlete : a));
    setEditDialogOpen(false);
    setAssignDialogOpen(false);
  };
  
  const handleEditClick = (athlete: Athlete) => {
    setSelectedAthlete(athlete);
    setEditDialogOpen(true);
  };

  const sortedAthletes = useMemo(() => {
    return [...athletesData].sort((a, b) => {
      // 1. Sort by points (ranking) descending
      if (b.ranking !== a.ranking) {
        return b.ranking - a.ranking;
      }
      // 2. Sort by gold medals descending
      if (b.oro !== a.oro) {
        return b.oro - a.oro;
      }
      // 3. Sort by silver medals descending
      if (b.plata !== a.plata) {
        return b.plata - a.plata;
      }
      // 4. Sort by bronze medals descending
      return b.bronce - a.bronce;
    });
  }, [athletesData]);

  const filteredAthletes = useMemo(() => {
    return sortedAthletes.filter(athlete => {
        const lowercasedSearch = searchTerm.toLowerCase();
        const searchMatch = (
            athlete.nombres.toLowerCase().includes(lowercasedSearch) ||
            athlete.apellidos.toLowerCase().includes(lowercasedSearch) ||
            athlete.cedula.toLowerCase().includes(lowercasedSearch)
        );
        const schoolMatch = schoolFilter === 'all' || athlete.escuela === schools.find(s => s.value === schoolFilter)?.label;
        const categoryMatch = categoryFilter === 'all' || getCategory(athlete.edad) === categoryFilter;
        const yearMatch = athlete.registrationDate && athlete.registrationDate.getFullYear().toString() === yearFilter;
        return searchMatch && schoolMatch && categoryMatch && yearMatch;
    });
  }, [sortedAthletes, searchTerm, schoolFilter, categoryFilter, yearFilter, schools]);

  const totalPages = Math.ceil(filteredAthletes.length / ITEMS_PER_PAGE);

  const paginatedAthletes = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAthletes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAthletes, currentPage]);
  
  const selectedSchoolLabel = useMemo(() => {
    if (schoolFilter === 'all') return null;
    return schools.find(s => s.value === schoolFilter)?.label || null;
  }, [schoolFilter, schools]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE - 1, filteredAthletes.length);
  
  const schoolOptions = [{ value: "all", label: "Todas las escuelas" }, ...schools];


  return (
    <>
    <div className="grid gap-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Filtros de Búsqueda</CardTitle>
            <Dialog open={isAssignDialogOpen} onOpenChange={setAssignDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full md:w-auto">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Asignar Ranking
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Asignar Ranking y Medallas</DialogTitle>
                        <DialogDescription>
                        Busca un atleta para actualizar su puntuación y medallas.
                        </DialogDescription>
                    </DialogHeader>
                    <AssignRankingForm
                        athletes={athletesData}
                        onSuccess={handleEditSuccess}
                    />
                </DialogContent>
            </Dialog>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar por nombre, apellido o cédula..."
                        className="pr-8 w-full"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        disabled={isDataLoading}
                    />
                </div>
                 <Combobox
                    items={schoolOptions}
                    value={schoolFilter}
                    onSelect={(value) => {
                        setSchoolFilter(value || 'all');
                        setCurrentPage(1);
                    }}
                    searchPlaceholder="Buscar escuela..."
                    selectPlaceholder="Todas las escuelas"
                    noResultsMessage="No se encontró la escuela."
                    className="w-full lg:w-[240px]"
                />
                <Select value={categoryFilter} onValueChange={(value) => {
                    setCategoryFilter(value);
                    setCurrentPage(1);
                }}
                disabled={isDataLoading}
                >
                    <SelectTrigger className="w-full lg:w-[220px]">
                        <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas las categorías</SelectItem>
                        {categories.filter(c => c !== 'all').map(category => (
                            <SelectItem key={category} value={category} className="capitalize">{category}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={yearFilter} onValueChange={(value) => {
                    setYearFilter(value);
                    setCurrentPage(1);
                }}
                disabled={isDataLoading}
                >
                    <SelectTrigger className="w-full lg:w-[120px]">
                        <SelectValue placeholder="Año" />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </CardContent>
      </Card>
        
      {isDataLoading ? (
        <div className="h-96 flex items-center justify-center">Cargando ranking...</div>
      ) : paginatedAthletes.length > 0 ? (
        <div className="grid gap-4">
            {paginatedAthletes.map((athlete, index) => {
                const rankingInFilteredList = filteredAthletes.findIndex(a => a.id === athlete.id) + 1;
                const isTop3 = rankingInFilteredList <= 3;
                const top3Styles = {
                    1: "border-yellow-400 bg-yellow-50/50 dark:bg-yellow-900/10",
                    2: "border-gray-400 bg-gray-50/50 dark:bg-gray-900/10",
                    3: "border-amber-600 bg-amber-50/50 dark:bg-amber-900/10"
                };

                return (
                    <Card 
                        key={athlete.id} 
                        className={cn(
                            "transition-all hover:shadow-md animate-in fade-in-50 duration-300",
                            isTop3 && `${top3Styles[rankingInFilteredList as keyof typeof top3Styles]}`
                        )}
                        style={{animationDelay: `${index * 50}ms`}}
                    >
                        <CardContent className="p-4 grid grid-cols-[auto_1.5fr_1.5fr_auto_auto_auto] items-center gap-4">
                           <div className="flex flex-col items-center justify-center w-12">
                               {isTop3 ? (
                                    <Trophy className={cn("h-8 w-8", {
                                        "text-yellow-400": rankingInFilteredList === 1,
                                        "text-gray-400": rankingInFilteredList === 2,
                                        "text-amber-600": rankingInFilteredList === 3,
                                    })} />
                               ) : (
                                    <div className="text-3xl font-bold text-muted-foreground">{rankingInFilteredList}</div>
                               )}
                           </div>

                           <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 rounded-md">
                                    <AvatarImage src={athlete.logoUrl} className="rounded-md object-contain p-1" />
                                    <AvatarFallback className="rounded-md bg-muted">
                                        <Building className="h-5 w-5 text-muted-foreground" />
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{athlete.escuela}</p>
                                </div>
                           </div>

                           <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={`https://picsum.photos/seed/${athlete.id}/200/200`} alt={`${athlete.nombres} ${athlete.apellidos}`} />
                                    <AvatarFallback>{getInitials(athlete.nombres, athlete.apellidos)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{athlete.nombres} {athlete.apellidos}</p>
                                    <p className="text-xs text-muted-foreground">
                                        <span className="font-medium">Categoría:</span> {getCategory(athlete.edad)}
                                    </p>
                                </div>
                           </div>
                           
                           <div className="text-muted-foreground text-sm text-center">
                                {athlete.edad} años
                           </div>

                            <div className="flex items-center justify-center gap-3 text-sm font-medium">
                                <div className="flex items-center gap-1" title="Oro">
                                <Medal className="h-4 w-4 text-yellow-500" />
                                <span className="font-mono">{athlete.oro}</span>
                                </div>
                                <div className="flex items-center gap-1" title="Plata">
                                <Medal className="h-4 w-4 text-gray-400" />
                                <span className="font-mono">{athlete.plata}</span>
                                </div>
                                <div className="flex items-center gap-1" title="Bronce">
                                <Medal className="h-4 w-4 text-amber-600" />
                                <span className="font-mono">{athlete.bronce}</span>
                                </div>
                            </div>

                           <div className="text-right flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(athlete)}>
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Editar Ranking</span>
                                </Button>
                                <div>
                                    <p className="font-mono text-xl font-semibold text-primary">{athlete.ranking}</p>
                                    <p className="text-xs text-muted-foreground">pts</p>
                                </div>
                           </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
      ) : (
        <Card className="h-64 flex items-center justify-center">
          <div className="text-center text-muted-foreground space-y-2">
            <Calendar className="mx-auto h-12 w-12" />
            <p className="font-medium">No se encontraron atletas para el año {yearFilter}.</p>
            <p className="text-sm">Prueba a seleccionar un año diferente o ajusta los otros filtros.</p>
          </div>
        </Card>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {filteredAthletes.length > 0 ? (
                <>
                  Mostrando <strong>{startIndex} - {endIndex}</strong> de <strong>{filteredAthletes.length}</strong> atletas
                </>
              ) : (
                'No hay atletas que mostrar'
              )}
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Anterior
                </Button>
                <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Siguiente
                </Button>
            </div>
        </div>
      )}
    </div>
    
      <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Ranking y Medallas</DialogTitle>
            <DialogDescription>
              Ajusta la puntuación y las medallas para {selectedAthlete?.nombres} {selectedAthlete?.apellidos}.
            </DialogDescription>
          </DialogHeader>
          {selectedAthlete && (
            <RankingEditForm
              athlete={selectedAthlete}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
