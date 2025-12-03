'use client';
import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { User as UserIcon, Calendar, Mail, Award, School, Shield, Edit, Fingerprint, BarChart2, Save, X, Users } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
  } from "@/components/ui/dialog";
import UserEditForm from '@/components/dashboard/UserEditForm';
import ChangePasswordForm from '@/components/dashboard/ChangePasswordForm';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { useUser } from '@/contexts/UserContext';


interface UserProfile {
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
}


const beltColors: { [key: string]: string } = {
    "Blanco": "bg-white text-black border border-gray-300",
    "Amarillo": "bg-yellow-400 text-black",
    "Naranja": "bg-orange-500 text-white",
    "Verde": "bg-green-600 text-white",
    "Azul": "bg-blue-600 text-white",
    "Púrpura": "bg-purple-600 text-white",
    "Marrón": "bg-amber-800 text-white",
    "Negro": "bg-black text-white",
};

const roleVariantMap: Record<UserProfile['role'], "default" | "secondary" | "destructive" | "outline"> = {
    admin: "destructive",
    master: "default",
    alumno: "secondary",
    representante: "outline",
};

const roleLabels: { [key: string]: string } = {
  admin: "Administrador",
  master: "Master",
  alumno: "Alumno",
  representante: "Representante",
};


export default function ProfilePage() {
  const { user, setUser } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(user);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setUserProfile(user);
  }, [user]);

  if (!userProfile) {
    return <div>Cargando perfil...</div>;
  }

  const getAge = (dateOfBirth?: Date) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  
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

  const userAge = getAge(userProfile.dateOfBirth);
  const userCategory = getCategory(userAge);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Archivo no válido",
          description: "Por favor, selecciona una imagen en formato PNG, JPG o JPEG.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = () => {
    if (newAvatar) {
      const updatedProfile = {...userProfile, photoURL: newAvatar };
      setUserProfile(updatedProfile);
      setUser(updatedProfile); // Actualizar contexto global
      toast({
        title: "Foto de perfil actualizada",
        description: "Tu nueva foto de perfil ha sido guardada (simulación).",
      });
      setNewAvatar(null);
    }
  };

  const handleCancelAvatarChange = () => {
    setNewAvatar(null);
  };
  
  const handleEditSuccess = (updatedUser: UserProfile) => {
    setUserProfile(updatedUser);
    setUser(updatedUser); // Actualizar contexto global
    setEditDialogOpen(false);
  }

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Perfil de Usuario</h1>
            <p className="text-muted-foreground">Administra la información de tu perfil y visualiza tus estadísticas.</p>
        </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Columna Izquierda: Perfil Principal */}
            <div className="xl:col-span-1 space-y-8">
                <Card className="flex flex-col items-center justify-center text-center p-8">
                    <div onClick={handleAvatarClick} className="cursor-pointer relative group h-32 w-32 mb-4">
                        <Avatar className="h-full w-full border-4 border-primary/20 rounded-full">
                            <AvatarImage src={newAvatar || userProfile.photoURL} />
                            <AvatarFallback className="text-4xl rounded-full">{getInitials(userProfile.firstName, userProfile.lastName)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/png, image/jpeg, image/jpg"
                    />

                    {newAvatar && (
                        <div className="flex gap-2 mb-4 animate-in fade-in-50">
                            <Button size="sm" onClick={handleSaveAvatar}><Save className="mr-2 h-4 w-4" />Guardar Foto</Button>
                            <Button size="sm" variant="outline" onClick={handleCancelAvatarChange}><X className="mr-2 h-4 w-4" />Cancelar</Button>
                        </div>
                    )}

                    <h2 className="text-2xl font-bold">{`${userProfile.firstName} ${userProfile.lastName}`}</h2>
                    <p className="text-muted-foreground">{userProfile.email}</p>
                    <Badge variant={roleVariantMap[userProfile.role] || "secondary"} className="mt-2 capitalize text-sm">
                        {roleLabels[userProfile.role]}
                    </Badge>
                     <DialogTrigger asChild>
                            <Button className="mt-6 w-full">
                                <Edit className="mr-2 h-4 w-4" />
                                Editar Perfil
                            </Button>
                    </DialogTrigger>
                </Card>
            </div>

             {/* Columna Central y Derecha: Detalles */}
            <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Award className="h-5 w-5 text-primary"/> Detalles del Atleta
                        </CardTitle>
                        <CardDescription>Tu información como competidor en SRAM.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-muted/50">
                            <div className='flex items-center gap-3 mb-1 md:mb-0'>
                               <School className="h-6 w-6 text-muted-foreground" />
                               <span className="font-medium">Escuela</span>
                           </div>
                           <span className="font-medium text-left md:text-right">{userProfile.school}</span>
                       </div>
                       <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-muted/50">
                            <div className='flex items-center gap-3 mb-1 md:mb-0'>
                               <Users className="h-6 w-6 text-muted-foreground" />
                               <span className="font-medium">Categoría</span>
                           </div>
                           <span className="font-medium text-left md:text-right">{userCategory}</span>
                       </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-muted/50">
                             <div className='flex items-center gap-3 mb-1 md:mb-0'>
                                <Shield className="h-6 w-6 text-muted-foreground" />
                                <span className="font-medium">Cinturón</span>
                            </div>
                           <div className={`px-3 py-1 text-sm font-semibold rounded-full w-fit ${beltColors[userProfile.belt || ''] || 'bg-gray-200 text-gray-800'}`}>
                                {userProfile.belt}
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-muted/50">
                             <div className='flex items-center gap-3'>
                                <BarChart2 className="h-6 w-6 text-muted-foreground" />
                                <span className="font-medium">Ranking Nacional</span>
                            </div>
                            <span className="text-2xl font-bold text-primary">#{userProfile.ranking}</span>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <UserIcon className="h-5 w-5 text-primary"/> Información de la Cuenta
                        </CardTitle>
                        <CardDescription>Tus datos personales y de acceso.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex flex-col md:flex-row md:items-start md:gap-4 p-2 rounded-lg">
                            <div className="flex items-center gap-4 mb-1 md:mb-0 md:min-w-[150px]">
                                <Fingerprint className="h-5 w-5 text-muted-foreground" />
                                <p className="text-muted-foreground">Cédula</p>
                            </div>
                            <p className="font-medium text-left md:text-right w-full">{userProfile.cedula}</p>
                        </div>
                         <div className="flex flex-col md:flex-row md:items-start md:gap-4 p-2 rounded-lg">
                             <div className="flex items-center gap-4 mb-1 md:mb-0 md:min-w-[150px]">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <p className="text-muted-foreground">Fecha de Nacimiento</p>
                            </div>
                            <p className="font-medium text-left md:text-right w-full">{userProfile.dateOfBirth ? format(userProfile.dateOfBirth, "d 'de' MMMM 'de' yyyy", { locale: es }) : 'N/A'}</p>
                        </div>
                         <div className="flex flex-col md:flex-row md:items-start md:gap-4 p-2 rounded-lg">
                             <div className="flex items-center gap-4 mb-1 md:mb-0 md:min-w-[150px]">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <p className="text-muted-foreground">Correo Electrónico</p>
                            </div>
                            <p className="font-medium text-left md:text-right w-full">{userProfile.email}</p>
                        </div>
                    </CardContent>
                     <CardFooter>
                        <Dialog open={isChangePasswordDialogOpen} onOpenChange={setChangePasswordDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full">Cambiar Contraseña</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Cambiar Contraseña</DialogTitle>
                                    <DialogDescription>
                                        Por tu seguridad, introduce tu contraseña actual antes de establecer una nueva.
                                    </DialogDescription>
                                </DialogHeader>
                                <ChangePasswordForm onSuccess={() => setChangePasswordDialogOpen(false)} />
                            </DialogContent>
                        </Dialog>
                     </CardFooter>
                </Card>
            </div>
        </div>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>Editar Perfil</DialogTitle>
                <DialogDescription>
                Modifica la información de tu perfil.
                </DialogDescription>
            </DialogHeader>
            <UserEditForm
                user={userProfile}
                onSuccess={handleEditSuccess}
            />
        </DialogContent>
      </Dialog>
    </div>
  );
}
