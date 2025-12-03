
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "../ui/scroll-area";
import { athletes } from "@/lib/mock-data";
import { Combobox } from "../ui/combobox";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Building, Edit } from "lucide-react";
import { Label } from "../ui/label";

const mockUsers = athletes.map(athlete => {
  const roles: ("admin" | "master" | "alumno" | "representante")[] = ["alumno", "representante", "master", "admin"];
  const role = roles[athlete.id % 4] || 'alumno';

  return {
  id: athlete.id,
  firstName: athlete.nombres,
  lastName: athlete.apellidos,
  email: `${athlete.nombres.split(' ')[0].toLowerCase()}.${athlete.apellidos.split(' ')[0].toLowerCase()}@example.com`,
  role: role,
}});

const formSchema = z.object({
  name: z.string().min(1, "El nombre de la escuela es requerido."),
  address: z.string().min(1, "La dirección es requerida."),
  masterId: z.string().min(1, "Debe seleccionar un director."),
  logo: z.any().optional(),
});

export default function SchoolForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const masters = mockUsers
    .filter(user => user.role === 'master')
    .map(user => ({
      value: user.id.toString(),
      label: `${user.firstName} ${user.lastName}`
    }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      masterId: "",
    },
  });

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("logo", file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Simulating school creation with:", values);
    toast({
      title: "¡Escuela Creada! (Simulación)",
      description: `La escuela ${values.name} ha sido registrada con éxito.`,
    });
    onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ScrollArea className="h-[65vh] pr-4">
          <div className="space-y-6 p-1">
             <div className="flex flex-col items-center text-center">
              <Label htmlFor="photo-upload" className="cursor-pointer w-fit">Logo de la Escuela</Label>
              <div onClick={handlePhotoClick} className="mt-2 cursor-pointer relative group h-24 w-24">
                  <Avatar className="h-full w-full mx-auto rounded-md">
                      <AvatarImage src={previewImage || undefined} className="rounded-md"/>
                      <AvatarFallback className="rounded-md">
                          <Building className="h-10 w-10" />
                      </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit className="h-8 w-8 text-white" />
                  </div>
              </div>
              <FormField
                control={form.control}
                name="logo"
                render={() => (
                    <FormItem>
                    <FormControl>
                        <Input
                        id="photo-upload"
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handlePhotoChange}
                        className="sr-only"
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Escuela</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Dojo Samurai"
                      {...field}
                      data-invalid={!!form.formState.errors.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Av. Principal, Edificio XYZ, Piso 1"
                      {...field}
                      data-invalid={!!form.formState.errors.address}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="masterId"
                render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Director (Rol Master)</FormLabel>
                    <Combobox
                    items={masters}
                    value={field.value}
                    onSelect={(currentValue) => {
                       field.onChange(currentValue);
                    }}
                    searchPlaceholder="Buscar director..."
                    selectPlaceholder="Selecciona un director"
                    noResultsMessage="No se encontró ningún master."
                    />
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>
        </ScrollArea>
        <Button type="submit" className="w-full mt-6">
          Crear Escuela
        </Button>
      </form>
    </Form>
  );
}
