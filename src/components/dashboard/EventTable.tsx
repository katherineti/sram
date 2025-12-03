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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal, Eye, Trash, Search, Edit, Info, MapPin, Calendar as CalendarIcon, Trophy, Presentation } from "lucide-react";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { type KarateEvent } from "@/lib/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import EventForm from "./EventForm";
import EventEditForm from "./EventEditForm";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";

const ITEMS_PER_PAGE = 8;

const statusVariantMap: Record<KarateEvent['status'], "default" | "secondary" | "destructive" | "outline"> = {
  programado: "secondary",
  'en-curso': "default",
  finalizado: "outline",
  cancelado: "destructive",
};

const statusLabels: Record<KarateEvent['status'], string> = {
  programado: "Programado",
  'en-curso': "En Curso",
  finalizado: "Finalizado",
  cancelado: "Cancelado",
};

const typeVariantMap: Record<KarateEvent['type'], "default" | "secondary" | "destructive" | "outline"> = {
    competencia: "default",
    seminario: "secondary",
    exhibicion: "outline",
};

const typeLabels: Record<KarateEvent['type'], string> = {
    competencia: "Competencia",
    seminario: "Seminario",
    exhibicion: "Exhibición",
};

const typeIconMap: Record<KarateEvent['type'], React.ElementType> = {
    competencia: Trophy,
    seminario: Presentation,
    exhibicion: Eye,
};


export default function EventTable({ initialEvents }: { initialEvents: KarateEvent[] }) {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<KarateEvent | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const { toast } = useToast();
  
  const [eventsData, setEventsData] = useState<KarateEvent[]>(initialEvents);
  const isEventsLoading = false;

  const handleAddSuccess = (newEvent: KarateEvent) => {
    setEventsData(prev => [newEvent, ...prev]);
    setAddDialogOpen(false);
  };
  
  const handleEditSuccess = (updatedEvent: KarateEvent) => {
    setEventsData(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    setEditDialogOpen(false);
  };

  const filteredEvents = useMemo(() => {
    return eventsData.filter(event => {
      const searchMatch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === "all" || event.status === statusFilter;
      const typeMatch = typeFilter === "all" || event.type === typeFilter;
      return searchMatch && statusMatch && typeMatch;
    }).sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [eventsData, searchTerm, statusFilter, typeFilter]);

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEvents, currentPage]);
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE - 1, filteredEvents.length);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const handleViewClick = (event: KarateEvent) => {
    setSelectedEvent(event);
    setViewDialogOpen(true);
  };

  const handleEditClick = (event: KarateEvent) => {
    setSelectedEvent(event);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (event: KarateEvent) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  }

  const confirmDelete = async () => {
    if (!selectedEvent) return;
    
    setEventsData(prev => prev.filter(e => e.id !== selectedEvent.id));

    toast({
        title: "Evento Eliminado (Simulación)",
        description: `El evento ${selectedEvent.name} ha sido eliminado.`,
    });
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="border rounded-lg w-full bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border-b">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre o lugar..."
              className="pr-8 sm:w-full"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              disabled={isEventsLoading}
            />
          </div>
            <div className="flex w-full md:w-auto items-center gap-4 flex-col sm:flex-row">
                 <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los tipos</SelectItem>
                        {Object.entries(typeLabels).map(([type, label]) => (
                            <SelectItem key={type} value={type}>{label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        {Object.entries(statusLabels).map(([status, label]) => (
                             <SelectItem key={status} value={status}>{label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
                    <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Agregar Evento
                    </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Crear Nuevo Evento</DialogTitle>
                        <DialogDescription>
                        Completa el formulario para registrar un nuevo evento o competencia.
                        </DialogDescription>
                    </DialogHeader>
                    <EventForm onSuccess={handleAddSuccess} />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
        
        {isEventsLoading ? (
            <div className="h-96 flex items-center justify-center">Cargando lista de eventos...</div>
        ): (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre del Evento</TableHead>
                  <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                  <TableHead className="hidden lg:table-cell">Tipo</TableHead>
                  <TableHead className="hidden md:table-cell">Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEvents.length > 0 ? (
                  paginatedEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        <p>{event.name}</p>
                        <p className="text-muted-foreground text-sm lg:hidden">{typeLabels[event.type]}</p>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {format(event.date, "d MMM, yyyy", { locale: es })}
                      </TableCell>
                       <TableCell className="hidden lg:table-cell">
                        <Badge variant={typeVariantMap[event.type]} className="capitalize">
                          {typeLabels[event.type]}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={statusVariantMap[event.status]}>
                          {statusLabels[event.status]}
                        </Badge>
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
                            <DropdownMenuItem onClick={() => handleViewClick(event)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver
                            </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handleEditClick(event)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/50"
                                onClick={() => handleDeleteClick(event)}
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
                    <TableCell colSpan={5} className="h-24 text-center">
                      No se encontraron eventos.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {filteredEvents.length > 0 ? (
                      <>
                        Mostrando <strong>{startIndex} - {endIndex}</strong> de <strong>{filteredEvents.length}</strong> eventos
                      </>
                    ) : (
                      'No hay eventos que mostrar'
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

       {/* View Event Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedEvent && (
             <Card className="border-0 shadow-none">
                <CardHeader className="p-4 sm:p-6 text-center items-center flex flex-col gap-4">
                    {(() => {
                        const Icon = typeIconMap[selectedEvent.type];
                        return <Icon className="h-12 w-12 text-primary" />;
                    })()}
                  <DialogTitle className="text-3xl font-bold">{selectedEvent.name}</DialogTitle>
                   <p className="text-muted-foreground pt-1">
                        {format(selectedEvent.date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                   </p>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 text-sm">
                   <Separator className="mb-6"/>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold mb-1">Descripción</h4>
                                <p className="text-muted-foreground">{selectedEvent.description}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex items-start gap-4">
                                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold mb-1">Lugar</h4>
                                    <p className="text-muted-foreground">{selectedEvent.location}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold mb-1">Estado</h4>
                                    <Badge variant={statusVariantMap[selectedEvent.status]}>
                                        {statusLabels[selectedEvent.status]}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Evento</DialogTitle>
            <DialogDescription>
              Modifica la información del evento seleccionado.
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <EventEditForm
              event={selectedEvent}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
      
       {/* Delete Event Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente el evento <span className="font-medium">{selectedEvent?.name}</span>.
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

    