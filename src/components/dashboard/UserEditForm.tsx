

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRef, useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CalendarIcon, User as UserIcon, Edit } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { schools, athletes } from "@/lib/mock-data";
import { Combobox } from "../ui/combobox";
import { es } from "date-fns/locale";

const mockUsers = athletes.map(athlete => {
  const roles: ("admin" | "master" | "alumno" | "representante")[] = ["alumno", "representante", "master", "admin"];
  const role = roles[athlete.id % 4] || 'alumno';

  return {
    id: athlete.id,
    firstName: athlete.nombres,
    lastName: athlete.apellidos,
    email: `${athlete.nombres.split(' ')[0].toLowerCase()}.${athlete.apellidos.split(' ')[0].toLowerCase()}@example.com`,
    role: role,
    photoURL: `https://picsum.photos/seed/${athlete.id}/200/200`,
    cedula: athlete.cedula,
    dateOfBirth: new Date(),
    schoolId: schools.find(s => s.label === athlete.escuela)?.value,
    school: athlete.escuela,
    belt: athlete.cinturon,
    ranking: athlete.ranking,
    representativeId: undefined,
  };
});

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
  category?: string;
  representativeId?: string;
}

const roles = ["admin", "master", "alumno", "representante"];
const belts = ["Blanco", "Amarillo", "Naranja", "Verde", "Azul", "Púrpura", "Marrón", "Negro"];
const docTypes = ["V", "E", "P", "T"];
const categories = [
    'Hasta 5 años (mixto)',
    'Infantil A',
    'Infantil B',
    'Infantil C',
    'Cadete',
    'Junior',
    'Sub-21',
    'Adulto',
];

const roleLabels: { [key: string]: string } = {
  admin: "Administrador",
  master: "Master",
  alumno: "Alumno",
  representante: "Representante",
};

const today = new Date();
today.setHours(23, 59, 59, 999);

const formSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres."),
  email: z.string().email("Por favor, introduce un correo electrónico válido."),
  role: z.enum(roles as [string, ...string[]], {
    errorMap: () => ({ message: "Por favor, selecciona un rol." }),
  }),
  photo: z.any().optional(),
  docType: z.string({ required_error: "Por favor, selecciona un tipo de documento." }),
  docNumber: z.string({required_error: "El número de documento es requerido."}).min(6, "El documento debe tener entre 6 y 9 dígitos.").max(9, "El documento debe tener entre 6 y 9 dígitos."),
  dateOfBirth: z.date({
    required_error: "La fecha de nacimiento es requerida.",
  }).max(today, { message: "La fecha de nacimiento no puede ser en el futuro." }),
  schoolId: z.string().optional(),
  belt: z.string().optional(),
  ranking: z.coerce.number().optional(),
  category: z.string().optional(),
  representativeId: z.string().optional(),
}).refine(data => {
    // Si el rol no es 'alumno', los campos de atleta no son requeridos.
    if (data.role !== 'alumno') {
      return true;
    }
    // Si el rol es 'alumno', los campos son requeridos.
    return !!data.schoolId && !!data.belt && data.ranking !== undefined;
}, {
    message: "La escuela, el cinturón y el ranking son requeridos para el rol de alumno.",
    path: ["schoolId"], 
});


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
};

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

export default function UserEditForm({ user, onSuccess }: { user: User; onSuccess: (updatedUser: User) => void }) {
  const { toast } = useToast();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const representatives = Array.from(
    mockUsers
      .filter(user => user.role === 'representante')
      .reduce((map, user) => {
        const key = `${user.firstName} ${user.lastName}`;
        if (!map.has(key)) {
          map.set(key, {
            value: user.id.toString(),
            label: `${user.firstName} ${user.lastName}`
          });
        }
        return map;
      }, new Map<string, { value: string; label: string }>())
      .values()
  );

  const getCedulaParts = (cedula?: string) => {
    if (!cedula) return { docType: 'V', docNumber: '' };
    
    // Allow alphanumeric prefixes
    const typeMatch = cedula.match(/^[VEPT]/i);
    const docType = typeMatch ? typeMatch[0].toUpperCase() : 'V';
    const docNumber = cedula.replace(/^[VEPT]-?/i, '').replace(/\./g, '');
    
    return { docType, docNumber };
  };

  const { docType, docNumber } = getCedulaParts(user.cedula);
  
  const calculatedCategory = user.dateOfBirth ? getCategory(getAge(new Date(user.dateOfBirth))) : "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      role: user.role,
      docType: docType,
      docNumber: docNumber,
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
      schoolId: user.schoolId || "",
      belt: user.belt || "",
      ranking: user.ranking || 0,
      category: user.category || calculatedCategory,
      representativeId: user.representativeId?.toString() || "",
    },
  });

  const dateOfBirth = form.watch('dateOfBirth');
  const role = form.watch('role');
  
  useEffect(() => {
    if (dateOfBirth) {
        const newAge = getAge(dateOfBirth);
        const newCategory = getCategory(newAge);
        form.setValue('category', newCategory);
    }
  }, [dateOfBirth, form]);


  useEffect(() => {
    if (user.photoURL) {
      setPreviewImage(user.photoURL);
    }
     const { docType, docNumber } = getCedulaParts(user.cedula);
     const calculatedCat = user.dateOfBirth ? getCategory(getAge(new Date(user.dateOfBirth))) : "";
    form.reset({
      ...form.getValues(),
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      role: user.role,
      docType: docType,
      docNumber: docNumber,
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
      schoolId: user.schoolId || "",
      belt: user.belt || "",
      ranking: user.ranking || 0,
      category: user.category || calculatedCat,
      representativeId: user.representativeId?.toString() || "",
    });
  }, [user, form]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("photo", file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const fullCedula = values.docType && values.docNumber ? `${values.docType}-${values.docNumber}` : undefined;
    
    // SOLUCIÓN: Usar 'as' para forzar el tipo literal correcto en la propiedad 'role' 
    // que viene de 'values', asegurando la compatibilidad con 'User'.
    const updatedUser: User = {
      ...user,
      ...values,
      role: values.role as "admin" | "master" | "alumno" | "representante", // <-- CAMBIO CLAVE
      school: schools.find(s => s.value === values.schoolId)?.label || '',
      photoURL: previewImage || user.photoURL,
      cedula: fullCedula,
    };
    
    toast({
      title: "¡Usuario Actualizado!",
      description: `El usuario ${values.email} ha sido actualizado con éxito.`,
    });
    onSuccess(updatedUser);
  } 
  
    const getInitials = (firstName?: string, lastName?: string) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ScrollArea className="h-[65vh] pr-4">
          <div className="space-y-8 p-1">

            {/* Profile Information Section */}
            <div className="space-y-4">
               <h3 className="font-medium text-lg">Información de Perfil</h3>
                <Separator />
                <div className="flex flex-col items-center text-center">
                    <Label>Foto de Perfil</Label>
                    <div onClick={handlePhotoClick} className="mt-2 cursor-pointer relative group h-24 w-24 mb-4">
                        <Avatar className="h-full w-full rounded-full">
                            <AvatarImage src={previewImage || undefined} />
                             <AvatarFallback className="rounded-full">
                                {getInitials(form.getValues('firstName'), form.getValues('lastName')) || <UserIcon className="h-10 w-10" />}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <span className="text-sm text-muted-foreground h-4">
                      {fileName || "Click en la imagen para cambiar"}
                    </span>
                    <FormField
                    control={form.control}
                    name="photo"
                    render={() => (
                        <FormItem>
                        <FormControl>
                            <Input
                            id="photo-upload"
                            ref={fileInputRef}
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={handlePhotoChange}
                            className="sr-only"
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                        <Input placeholder="John" {...field} data-invalid={!!form.formState.errors.firstName} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Apellido</FormLabel>
                        <FormControl>
                        <Input placeholder="Doe" {...field} data-invalid={!!form.formState.errors.lastName} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <FormField
                        control={form.control}
                        name="docType"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Tipo</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                <SelectTrigger data-invalid={!!form.formState.errors.docType}>
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {docTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="docNumber"
                        render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                            <FormLabel>Nº de Documento</FormLabel>
                            <FormControl>
                            <Input placeholder="12345678" {...field} data-invalid={!!form.formState.errors.docNumber} onChange={(e) => {
                                const { value } = e.target;
                                field.onChange(value.replace(/[^0-9]/g, ''));
                            }} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de Nacimiento</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              data-invalid={!!form.formState.errors.dateOfBirth}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                                form.formState.errors.dateOfBirth && "border-destructive"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: es })
                              ) : (
                                <span>Elige una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            locale={es}
                            selected={field.value}
                            onSelect={field.onChange}
                            defaultMonth={field.value}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            {/* Credentials Section */}
             <div className="space-y-4">
                <h3 className="font-medium text-lg">Credenciales de Acceso</h3>
                <Separator />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="usuario@email.com" {...field} data-invalid={!!form.formState.errors.email} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
            <div className="space-y-4">
                <h3 className="font-medium text-lg">Permisos</h3>
                <Separator />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rol</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                <SelectTrigger data-invalid={!!form.formState.errors.role}>
                                    <SelectValue placeholder="Selecciona un rol" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role} value={role} className="capitalize">
                                    {roleLabels[role] || role}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Athlete Information Section */}
            {role === 'alumno' && (
                <div className="space-y-4">
                    <h3 className="font-medium text-lg">Información de Atleta</h3>
                    <Separator />

                     <FormField
                        control={form.control}
                        name="schoolId"
                        render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Escuela</FormLabel>
                            <Combobox
                            items={schools}
                            value={field.value}
                            onSelect={(currentValue) => {
                                field.onChange(currentValue);
                            }}
                            searchPlaceholder="Buscar escuela..."
                            selectPlaceholder="Selecciona una escuela"
                            noResultsMessage="No se encontró la escuela."
                            className={cn(form.formState.errors.schoolId && "border-destructive")}
                            />
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="belt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cinturón</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                    <SelectTrigger data-invalid={!!form.formState.errors.belt}>
                                        <SelectValue placeholder="Selecciona un cinturón" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {belts.map((belt) => (
                                        <SelectItem key={belt} value={belt} className="capitalize">
                                        {belt}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Categoría</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                              <SelectTrigger data-invalid={!!form.formState.errors.category}>
                              <SelectValue placeholder="Selecciona una categoría" />
                              </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                              {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                  {category}
                              </SelectItem>
                              ))}
                          </SelectContent>
                          </Select>
                            <FormDescription>
                              Calculada por edad. Puedes ajustarla si es necesario.
                          </FormDescription>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                    <FormField
                        control={form.control}
                        name="ranking"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ranking</FormLabel>
                            <FormControl>
                            <Input type="number" placeholder="0" {...field} data-invalid={!!form.formState.errors.ranking} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="representativeId"
                        render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Representante (Opcional)</FormLabel>
                            <Combobox
                                items={representatives}
                                value={field.value}
                                onSelect={(currentValue) => {
                                    field.onChange(currentValue === field.value ? "" : currentValue);
                                }}
                                searchPlaceholder="Buscar representante..."
                                selectPlaceholder="Selecciona un representante"
                                noResultsMessage="No se encontró ningún representante."
                            />
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
            )}
          </div>
        </ScrollArea>
        <Button type="submit" className="w-full mt-6">
          Guardar Cambios
        </Button>
      </form>
    </Form>
  );
}
