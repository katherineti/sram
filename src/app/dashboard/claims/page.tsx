'use client';
import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  PlusCircle,
  MoreHorizontal,
  Search,
  Eye,
  FileText,
  Calendar,
  User,
  Tag,
  MessageSquare,
  UserCheck,
  Building,
  Trash,
  Edit,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ClaimForm from '@/components/dashboard/ClaimForm';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { athletes } from '@/lib/mock-data';
import ClaimEditForm from '@/components/dashboard/ClaimEditForm';

export interface Claim {
  id: string;
  representativeId: string;
  representativeName: string;
  representedId: string;
  representedName: string;
  representedType: 'alumno' | 'escuela';
  subject: string;
  description: string;
  status: 'enviado' | 'en-proceso' | 'resuelto' | 'rechazado';
  submissionDate: Date;
}

const mockUsers = athletes.map(athlete => {
  const roles: ("admin" | "master" | "alumno" | "representante")[] = ["alumno", "representante", "master", "admin"];
  const role = roles[athlete.id % 4] || 'alumno';

  return {
  id: athlete.id.toString(),
  firstName: athlete.nombres,
  lastName: athlete.apellidos,
  email: `${athlete.nombres.split(' ')[0].toLowerCase()}.${athlete.apellidos.split(' ')[0].toLowerCase()}@example.com`,
  role: role,
}});


const mockClaims: Claim[] = [
  {
    id: 'claim-001',
    representativeId: '1',
    representativeName: 'Admin Prueba',
    representedId: '202501',
    representedName: 'Pedro Salas',
    representedType: 'alumno',
    subject: 'Puntuación incorrecta en torneo',
    description:
      'La puntuación de mi representado en la final de kumite no fue registrada correctamente.',
    status: 'enviado',
    submissionDate: new Date(2024, 6, 21),
  },
  {
    id: 'claim-002',
    representativeId: '1',
    representativeName: 'Admin Prueba',
    representedId: 'antonio-diaz-dojo',
    representedName: 'Antonio Díaz Dojo',
    representedType: 'escuela',
    subject: 'Problema con la inscripción al evento',
    description: 'No aparecen todos nuestros atletas inscritos en el próximo evento.',
    status: 'en-proceso',
    submissionDate: new Date(2024, 6, 19),
  },
  {
    id: 'claim-003',
    representativeId: '202506',
    representativeName: 'Mariana Pinto',
    representedId: 'alu-3',
    representedName: 'Carlos González',
    representedType: 'alumno',
    subject: 'Cambio de categoría',
    description: 'Solicito el cambio de categoría de mi representado por error en la edad.',
    status: 'resuelto',
    submissionDate: new Date(2024, 5, 10),
  },
];

const statusVariantMap: Record<
  Claim['status'],
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  enviado: 'secondary',
  'en-proceso': 'default',
  resuelto: 'outline',
  rechazado: 'destructive',
};

const ITEMS_PER_PAGE = 8;

export default function ClaimsPage() {
  const { user } = useUser();
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [claimsData, setClaimsData] = useState<Claim[]>(mockClaims);
  const isLoading = false; // Simulación

  const getRepresentativeName = (representativeId: string): string => {
    const rep = mockUsers.find(u => u.id === representativeId);
    if (rep) return `${rep.firstName} ${rep.lastName}`;
    
    if (user && user.id.toString() === representativeId) {
        return `${user.firstName} ${user.lastName}`;
    }

    return 'Desconocido';
  }


  const handleAddSuccess = (newClaim: Claim) => {
    setClaimsData(prev => [newClaim, ...prev]);
    setAddDialogOpen(false);
    toast({
      title: '¡Reclamo Enviado!',
      description: 'Tu reclamo ha sido registrado y será revisado pronto.',
    });
  };
  
  const handleEditSuccess = (updatedClaim: Claim) => {
    setClaimsData(prev => prev.map(c => c.id === updatedClaim.id ? updatedClaim : c));
    setEditDialogOpen(false);
    toast({
      title: '¡Reclamo Actualizado!',
      description: 'El reclamo ha sido actualizado con éxito.',
    });
  };

  const filteredClaims = useMemo(() => {
    if (!user) return [];
    
    let userClaims = claimsData;

    if (user.role === 'representante') {
      userClaims = claimsData.filter(claim => claim.representativeId === user.id);
    } else if (user.role === 'admin' || user.role === 'master') {
      userClaims = claimsData;
    } else {
      return [];
    }
    
    return userClaims
      .filter(claim =>
        claim.subject.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => b.submissionDate.getTime() - a.submissionDate.getTime());
  }, [claimsData, searchTerm, user]);

  const totalPages = Math.ceil(filteredClaims.length / ITEMS_PER_PAGE);

  const paginatedClaims = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredClaims.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredClaims, currentPage]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(
    startIndex + ITEMS_PER_PAGE - 1,
    filteredClaims.length
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewClick = (claim: Claim) => {
    setSelectedClaim(claim);
    setViewDialogOpen(true);
  };
  
  const handleEditClick = (claim: Claim) => {
    setSelectedClaim(claim);
    setEditDialogOpen(true);
  };
  
  const handleDeleteClick = (claim: Claim) => {
    setSelectedClaim(claim);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedClaim) return;
    
    setClaimsData(prev => prev.filter(c => c.id !== selectedClaim.id));

    toast({
        title: "Reclamo Eliminado (Simulación)",
        description: `El reclamo sobre "${selectedClaim.subject}" ha sido eliminado.`,
    });
    setDeleteDialogOpen(false);
  };

  if (!user) return null;

  const canManageClaims = user.role === 'admin' || user.role === 'master';
  const canCreateClaim = user.role === 'admin' || user.role === 'master' || user.role === 'representante';

  const canEditOrDeleteClaim = (claim: Claim) => {
    if (!user) return false;
    return user.role === 'admin' || user.role === 'master' || user.id.toString() === claim.representativeId;
  }

  return (
    <>
      <div className="grid gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Reclamos
          </h1>
          <p className="text-muted-foreground">
            Crea y gestiona tus reclamos dirigidos a directores y
            administradores.
          </p>
        </div>

        <div className="border rounded-lg w-full bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border-b">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por asunto..."
                className="pr-8 sm:w-full"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                disabled={isLoading}
              />
            </div>
            {canCreateClaim && (
              <Dialog
                open={isAddDialogOpen}
                onOpenChange={setAddDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="w-full md:w-auto">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Crear Reclamo
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Reclamo</DialogTitle>
                    <DialogDescription>
                      Completa el formulario para enviar tu reclamo.
                    </DialogDescription>
                  </DialogHeader>
                  <ClaimForm onSuccess={handleAddSuccess} />
                </DialogContent>
              </Dialog>
            )}
          </div>

          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              Cargando lista de reclamos...
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asunto</TableHead>
                     {canManageClaims && <TableHead className="hidden lg:table-cell">Representante</TableHead>}
                    <TableHead className="hidden sm:table-cell">
                      Representado
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Fecha
                    </TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedClaims.length > 0 ? (
                    paginatedClaims.map(claim => (
                      <TableRow key={claim.id}>
                        <TableCell className="font-medium">
                          {claim.subject}
                        </TableCell>
                         {canManageClaims && <TableCell className="hidden lg:table-cell">{getRepresentativeName(claim.representativeId)}</TableCell>}
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                             {claim.representedType === 'alumno' ? 
                                <User className="h-4 w-4 text-muted-foreground" /> : 
                                <Building className="h-4 w-4 text-muted-foreground" />
                            }
                            <span>{claim.representedName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {format(claim.submissionDate, 'd MMM, yyyy', {
                            locale: es,
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusVariantMap[claim.status]}>
                            {claim.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <span className="sr-only">Abrir menú</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleViewClick(claim)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalles
                              </DropdownMenuItem>
                              {canEditOrDeleteClaim(claim) && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => handleEditClick(claim)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/50"
                                    onClick={() => handleDeleteClick(claim)}
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={canManageClaims ? 6 : 5}
                        className="h-24 text-center"
                      >
                        No se encontraron reclamos.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {filteredClaims.length > 0 ? (
                      <>
                        Mostrando <strong>{startIndex} - {endIndex}</strong> de{' '}
                        <strong>{filteredClaims.length}</strong> reclamos
                      </>
                    ) : (
                      'No hay reclamos que mostrar'
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
      </div>

      {/* View Claim Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedClaim && (
            <Card className="border-0 shadow-none">
                <CardHeader className="p-4 text-center items-center flex flex-col gap-2 sm:p-6">
                  <FileText className="h-10 w-10 text-primary" />
                  <DialogTitle className="text-2xl font-bold">{selectedClaim.subject}</DialogTitle>
                   <p className="text-sm text-muted-foreground pt-1">
                        {format(
                            selectedClaim.submissionDate,
                            "d 'de' MMMM, yyyy",
                            { locale: es }
                        )}
                   </p>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 text-sm">
                   <Separator className="mb-6"/>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                           <div className="flex items-start gap-3">
                                <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold mb-1">Representado</h4>
                                    <p className="text-muted-foreground">{selectedClaim.representedName}</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-3">
                                <Tag className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold mb-1">Tipo</h4>
                                    <p className="text-muted-foreground capitalize">{selectedClaim.representedType}</p>
                                </div>
                            </div>
                             {canManageClaims && (
                                <div className="flex items-start gap-3">
                                    <UserCheck className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Creado por</h4>
                                        <p className="text-muted-foreground">{getRepresentativeName(selectedClaim.representativeId)}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-start gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold mb-1">Estado</h4>
                                     <Badge variant={statusVariantMap[selectedClaim.status]}>
                                        {selectedClaim.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                         <Separator />
                        <div className="flex items-start gap-3">
                            <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold mb-1">Descripción Detallada</h4>
                                <p className="text-muted-foreground whitespace-pre-wrap">{selectedClaim.description}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Edit Claim Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Reclamo</DialogTitle>
            <DialogDescription>
              Modifica la información del reclamo seleccionado.
            </DialogDescription>
          </DialogHeader>
          {selectedClaim && (
            <ClaimEditForm
              claim={selectedClaim}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Claim Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>¿Estás realmente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
                Esta acción no se puede deshacer. Esto eliminará permanentemente el reclamo sobre <span className="font-medium">"{selectedClaim?.subject}"</span>.
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

    