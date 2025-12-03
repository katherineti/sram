
"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Eye, Trash, Search, Edit, Building, Download, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { athletes } from "@/lib/mock-data";
import SchoolForm from "./SchoolForm";
import SchoolEditForm from "./SchoolEditForm";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "master" | "alumno" | "representante";
}

interface School {
  id: string;
  name: string;
  address: string;
  masterId?: string | number;
  logoUrl?: string;
}

const ITEMS_PER_PAGE = 8;

interface SchoolTableProps {
  initialSchools: School[];
  allUsers: User[];
}

export default function SchoolTable({ initialSchools, allUsers }: SchoolTableProps) {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const [schoolsData, setSchoolsData] = useState<School[]>(initialSchools); 
  const isSchoolsLoading = false;
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<string | null>(null);

  const filteredSchools = useMemo(() => {
    return schoolsData.filter(school =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [schoolsData, searchTerm]);

  const totalPages = Math.ceil(filteredSchools.length / ITEMS_PER_PAGE);

  const paginatedSchools = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSchools.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredSchools, currentPage]);
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE - 1, filteredSchools.length);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const handleViewClick = (school: School) => {
    setSelectedSchool(school);
    setViewDialogOpen(true);
  };

  const handleEditClick = (school: School) => {
    setSelectedSchool(school);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (school: School) => {
    setSelectedSchool(school);
    setDeleteDialogOpen(true);
  }
  
  const handleDownload = (school: School) => {
    setIsGeneratingPdf(school.id);
    const worker = new Worker(new URL('@/workers/pdf-worker', import.meta.url));

    worker.onmessage = (event: MessageEvent<Blob>) => {
      const blob = event.data;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_${school.id}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      worker.terminate();
      setIsGeneratingPdf(null);
    };

    worker.onerror = (error) => {
      console.error('PDF Worker Error:', error);
      toast({
        variant: "destructive",
        title: "Error al generar PDF",
        description: "Hubo un problema al crear el reporte. Por favor, intenta de nuevo.",
      });
      worker.terminate();
      setIsGeneratingPdf(null);
    };

    const schoolAthletes = athletes.filter(a => a.escuela === school.name);
    const schoolToExport = {
        value: school.id,
        label: school.name,
        logoUrl: school.logoUrl,
    };

    worker.postMessage({
      school: schoolToExport,
      athletes: schoolAthletes,
    });
  };


  const handleEditSuccess = (updatedSchool: School) => {
    setSchoolsData(prev => prev.map(s => s.id === updatedSchool.id ? updatedSchool : s));
    setEditDialogOpen(false);
  };

  const confirmDelete = async () => {
    if (!selectedSchool) return;
    
    setSchoolsData(prev => prev.filter(s => s.id !== selectedSchool.id));

    toast({
        title: "Escuela Eliminada (Simulación)",
        description: `La escuela ${selectedSchool.name} ha sido eliminada.`,
    });
    setDeleteDialogOpen(false);
  };
  
  const getMasterName = (masterId?: string | number) => {
      if (!masterId) return 'No Asignado';
      const master = allUsers.find(u => u.id === masterId);
      return master ? `${master.firstName} ${master.lastName}`: 'Desconocido';
  }

  return (
    <>
      <div className="border rounded-lg w-full bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border-b">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre..."
              className="pr-8 sm:w-full"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              disabled={isSchoolsLoading}
            />
          </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                <Button className="w-full md:w-auto">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Agregar
                </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Registrar Nueva Escuela</DialogTitle>
                    <DialogDescription>
                    Completa el formulario para añadir una nueva escuela al sistema.
                    </DialogDescription>
                </DialogHeader>
                <SchoolForm onSuccess={() => setAddDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
        
        {isSchoolsLoading ? (
            <div className="h-96 flex items-center justify-center">Cargando lista de escuelas...</div>
        ): (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden sm:table-cell">Dirección</TableHead>
                  <TableHead className="hidden md:table-cell">Director (Master)</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSchools.length > 0 ? (
                  paginatedSchools.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                           <Avatar className="h-9 w-9 rounded-md">
                                <AvatarImage src={school.logoUrl || undefined} className="rounded-md" />
                                <AvatarFallback className="rounded-md bg-muted">
                                    <Building className="h-5 w-5 text-muted-foreground" />
                                </AvatarFallback>
                           </Avatar>
                          <div className="font-medium">{school.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{school.address}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getMasterName(school.masterId)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menú</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewClick(school)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver
                            </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handleEditClick(school)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(school)} disabled={isGeneratingPdf === school.id}>
                                {isGeneratingPdf === school.id ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Download className="mr-2 h-4 w-4" />
                                )}
                                {isGeneratingPdf === school.id ? 'Generando...' : 'Descargar PDF'}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/50"
                                onClick={() => handleDeleteClick(school)}
                            >
                            <Trash className="mr-2 h-4 w-4" />
                            Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No se encontraron escuelas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {filteredSchools.length > 0 ? (
                      <>
                        Mostrando <strong>{startIndex} - {endIndex}</strong> de <strong>{filteredSchools.length}</strong> escuelas
                      </>
                    ) : (
                      'No hay escuelas que mostrar'
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
                     <span className="text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages}
                    </span>
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
          </>
        )}
      </div>

       {/* View School Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles de la Escuela</DialogTitle>
            <DialogDescription>
                Información de la escuela seleccionada.
            </DialogDescription>
          </DialogHeader>
          {selectedSchool && (
            <div className="grid gap-4 py-4 text-sm">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24 rounded-md">
                    <AvatarImage src={selectedSchool.logoUrl || undefined} className="rounded-md"/>
                    <AvatarFallback className="rounded-md bg-muted">
                        <Building className="h-10 w-10 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="rounded-lg border p-4 grid gap-3">
                  <div className="grid grid-cols-[150px_1fr] items-center gap-x-4">
                    <label className="text-right font-medium text-muted-foreground">Nombre</label>
                    <p>{selectedSchool.name}</p>
                  </div>
                  <div className="grid grid-cols-[150px_1fr] items-center gap-x-4">
                    <label className="text-right font-medium text-muted-foreground">Dirección</label>
                    <p>{selectedSchool.address}</p>
                  </div>
                  <div className="grid grid-cols-[150px_1fr] items-center gap-x-4">
                    <label className="text-right font-medium text-muted-foreground">Director (Master)</label>
                    <p>{getMasterName(selectedSchool.masterId)}</p>
                  </div>
                </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Edit School Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Escuela</DialogTitle>
            <DialogDescription>
              Modifica la información de la escuela seleccionada.
            </DialogDescription>
          </DialogHeader>
          {selectedSchool && (
            <SchoolEditForm
              school={selectedSchool}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
      
       {/* Delete School Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente la escuela <span className="font-medium">{selectedSchool?.name}</span>.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}

    