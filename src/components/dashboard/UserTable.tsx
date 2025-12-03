"use client";

import { useState, useMemo, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal, Eye, Trash, Search, Edit } from "lucide-react";
import UserForm from "./UserForm";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { schools } from "@/lib/mock-data";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import UserEditForm from "./UserEditForm";
import { useUser } from "@/contexts/UserContext";

interface User {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "master" | "alumno" | "representante";
  photoURL?: string;
  cedula?: string;
  dateOfBirth?: Date;
  schoolId?: string;
  school?: string;
  belt?: string;
  ranking?: number;
  representativeId?: string;
}

const roleVariantMap: Record<
  User["role"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  admin: "destructive",
  master: "default",
  alumno: "secondary",
  representante: "outline",
};

const roleLabels: { [key in User["role"]]: string } = {
  admin: "Administrador",
  master: "Master",
  alumno: "Alumno",
  representante: "Representante",
};

const ITEMS_PER_PAGE = 8;

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

interface UserTableProps {
  initialUsers: User[];
}

export default function UserTable({ initialUsers }: UserTableProps) {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const { toast } = useToast();
  const { user: currentUser, setUser: setCurrentUser } = useUser();
  
  const [usersData, setUsersData] = useState<User[]>(initialUsers);
  const isUsersLoading = false; 

  const isAdmin = currentUser?.role === 'admin'; 

  const handleEditSuccess = (updatedUser: User) => {
    setUsersData(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    
    if (currentUser && updatedUser.id === currentUser.id) {
      setCurrentUser(updatedUser);
    }
    
    setEditDialogOpen(false);
  };

  const filteredUsers = useMemo(() => {
    return usersData.filter(user => {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
        const searchMatch = (
            fullName.includes(searchTerm.toLowerCase()) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        const roleMatch = roleFilter === 'all' || user.role === roleFilter;
        return searchMatch && roleMatch;
    });
  }, [usersData, searchTerm, roleFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE - 1, filteredUsers.length);


  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const handleViewClick = (user: User) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };
  
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    if (!isAdmin) return;
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  }

  const confirmDelete = async () => {
    if (!selectedUser) return;
    
    setUsersData(prevUsers => prevUsers.filter(u => u.id !== selectedUser.id));

    toast({
        title: "Usuario Eliminado",
        description: `El usuario ${selectedUser.email} ha sido eliminado.`,
    });
    setDeleteDialogOpen(false);
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getAge = (dateOfBirth?: Date) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  const getAgeInYearsString = (dateOfBirth?: Date) => {
    if (!dateOfBirth) return 'N/A';
    const age = getAge(dateOfBirth);
    return `${age} años`;
  }
  
  const getRepresentativeName = (representativeId?: string | number) => {
      if (!representativeId) return 'No Asignado';
      const rep = usersData.find(u => u.id === representativeId);
      return rep ? `${rep.firstName} ${rep.lastName}` : 'Desconocido';
  }

  const formatCedula = (cedula?: string) => {
    if (!cedula) return 'N/A';
  
    let cleaned = cedula.replace(/[^0-9A-Z]/gi, '').toUpperCase();
    let prefix = '';
    let numbers = '';
  
    const potentialPrefix = cleaned.match(/^[VEPT]/);
    
    if (potentialPrefix) {
      prefix = potentialPrefix[0];
      numbers = cleaned.substring(1);
    } else if (!isNaN(Number(cleaned))) {
      prefix = 'V';
      numbers = cleaned;
    } else {
       return cedula;
    }
  
    if (prefix === 'V') {
      if (isNaN(Number(numbers))) {
         return `${prefix}-${numbers}`;
      }
      const formattedNumbers = new Intl.NumberFormat('es-VE').format(Number(numbers));
      return `${prefix}-${formattedNumbers}`;
    }
  
    return `${prefix}-${numbers}`;
  };
  
  const AdminTooltip = ({ children, action }: { children: React.ReactNode, action: string }) => {
    if (isAdmin) {
      return <>{children}</>;
    }
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>{children}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Solo los administradores pueden {action}.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <>
      <div className="border rounded-lg w-full bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border-b">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre, email..."
              className="pr-8 sm:w-full"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              disabled={isUsersLoading}
            />
          </div>
          <div className="flex w-full md:w-auto items-center gap-4">
             <Select value={roleFilter} onValueChange={(value) => {
                setRoleFilter(value);
                setCurrentPage(1);
             }}
             disabled={isUsersLoading}
             >
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos los roles</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="master">Master</SelectItem>
                    <SelectItem value="alumno">Alumno</SelectItem>
                    <SelectItem value="representante">Representante</SelectItem>
                </SelectContent>
            </Select>
            <AdminTooltip action="agregar usuarios">
              <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full md:w-auto" disabled={!isAdmin}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Agregar
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Registrar Nuevo Usuario</DialogTitle>
                    <DialogDescription>
                      Completa el formulario para añadir un nuevo miembro al sistema. Se creará una cuenta y perfil de usuario.
                    </DialogDescription>
                  </DialogHeader>
                  <UserForm onSuccess={() => setAddDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </AdminTooltip>
          </div>
        </div>
        
        {isUsersLoading ? (
            <div className="h-96 flex items-center justify-center">Cargando lista de usuarios...</div>
        ): (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden sm:table-cell">Correo Electrónico</TableHead>
                  <TableHead className="hidden md:table-cell">Rol</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers && paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.photoURL || undefined} alt={`${user.firstName} ${user.lastName}`} />
                            <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{user.firstName || ''} {user.lastName || ''}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant={roleVariantMap[user.role] || "secondary"}
                          className="capitalize"
                        >
                          {roleLabels[user.role]}
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
                            <DropdownMenuItem onClick={() => handleViewClick(user)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver
                            </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handleEditClick(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AdminTooltip action="eliminar usuarios">
                                <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/50"
                                    onClick={() => handleDeleteClick(user)}
                                    disabled={!isAdmin}
                                >
                                <Trash className="mr-2 h-4 w-4" />
                                Eliminar
                                </DropdownMenuItem>
                            </AdminTooltip>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No se encontraron usuarios.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-sm text-muted-foreground">
                        {filteredUsers.length > 0 ? (
                        <>
                            Mostrando <strong>{startIndex} - {endIndex}</strong> de <strong>{filteredUsers.length}</strong> usuarios
                        </>
                        ) : (
                        'No hay usuarios que mostrar'
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

      <Dialog open={isViewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles del Usuario</DialogTitle>
            <DialogDescription>
                Información personal y rol del usuario seleccionado.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4 text-sm">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={usersData.find(u => u.id === selectedUser.id)?.photoURL || undefined} />
                    <AvatarFallback>{getInitials(selectedUser.firstName, selectedUser.lastName)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="rounded-lg border p-4 grid gap-3">
                  <div className="grid grid-cols-[120px_1fr] items-center gap-x-4">
                    <label className="text-right font-medium text-muted-foreground">Nombre</label>
                    <p>{selectedUser.firstName || 'N/A'}</p>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-x-4">
                    <label className="text-right font-medium text-muted-foreground">Apellido</label>
                    <p>{selectedUser.lastName || 'N/A'}</p>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-x-4">
                    <label className="text-right font-medium text-muted-foreground">Email</label>
                    <p>{selectedUser.email}</p>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-x-4">
                    <label className="text-right font-medium text-muted-foreground">Rol</label>
                    <p className="capitalize">{roleLabels[selectedUser.role]}</p>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-x-4">
                    <label className="text-right font-medium text-muted-foreground">Fec. Nacimiento</label>
                    <p>{selectedUser.dateOfBirth ? format(selectedUser.dateOfBirth, "d 'de' MMMM 'de' yyyy", { locale: es }) : 'N/A'}</p>
                  </div>
                   <div className="grid grid-cols-[120px_1fr] items-center gap-x-4">
                    <label className="text-right font-medium text-muted-foreground">Cédula</label>
                    <p>{formatCedula(selectedUser.cedula)}</p>
                  </div>
                   <div className="grid grid-cols-[120px_1fr] items-center gap-x-4">
                    <label className="text-right font-medium text-muted-foreground">Edad</label>
                    <p>{getAgeInYearsString(selectedUser.dateOfBirth)}</p>
                  </div>
                   {selectedUser.role === 'master' && (
                        <div className="grid grid-cols-[120px_1fr] items-center gap-x-4">
                            <label className="text-right font-medium text-muted-foreground">Escuela</label>
                            <p>{schools.find(s => s.value === selectedUser.schoolId)?.label || 'N/A'}</p>
                        </div>
                   )}
                   {selectedUser.role === 'alumno' && (
                    <>
                        <div className="grid grid-cols-[120px_1fr] items-center gap-x-4">
                            <label className="text-right font-medium text-muted-foreground">Escuela</label>
                            <p>{schools.find(s => s.value === selectedUser.schoolId)?.label || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] items-center gap-x-4">
                            <label className="text-right font-medium text-muted-foreground">Cinturón</label>
                            <p>{selectedUser.belt || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] items-center gap-x-4">
                            <label className="text-right font-medium text-muted-foreground">Categoría</label>
                            <p>{selectedUser.dateOfBirth ? getCategory(getAge(selectedUser.dateOfBirth) as number) : 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] items-center gap-x-4">
                            <label className="text-right font-medium text-muted-foreground">Representante</label>
                            <p>{getRepresentativeName(selectedUser.representativeId)}</p>
                        </div>
                    </>
                    )}
                </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Modifica la información del usuario seleccionado.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserEditForm
              user={selectedUser}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
      
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente al
                    usuario <span className="font-medium">{selectedUser?.email}</span>.
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

    