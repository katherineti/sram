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
import type { KarateEvent } from "@/lib/mock-data";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const formSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
  date: z.date({ required_error: "La fecha es requerida." }),
  location: z.string().min(3, "La ubicación es requerida."),
  type: z.enum(['competencia', 'seminario', 'exhibicion'], {
    errorMap: () => ({ message: "Por favor, selecciona un tipo." }),
  }),
  status: z.enum(['programado', 'en-curso', 'finalizado', 'cancelado'], {
      errorMap: () => ({ message: "Por favor, selecciona un estado." }),
  })
});

type EventFormValues = z.infer<typeof formSchema>;

interface EventEditFormProps {
    event: KarateEvent;
    onSuccess: (updatedEvent: KarateEvent) => void;
}

export default function EventEditForm({ event, onSuccess }: EventEditFormProps) {
  const { toast } = useToast();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: event.name,
      description: event.description,
      date: event.date,
      location: event.location,
      type: event.type,
      status: event.status,
    },
  });

  async function onSubmit(values: EventFormValues) {
    console.log("Simulating event update with:", values);
    
    const updatedEvent: KarateEvent = {
        ...event,
        ...values,
    };

    toast({
      title: "¡Evento Actualizado! (Simulación)",
      description: `El evento ${values.name} ha sido actualizado con éxito.`,
    });
    onSuccess(updatedEvent);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ScrollArea className="h-[65vh] pr-4">
          <div className="space-y-6 p-1">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Evento</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Campeonato Nacional Juvenil"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe brevemente el evento..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Fecha del Evento</FormLabel>
                    <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
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
                        initialFocus
                        />
                    </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lugar</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Caracas, Distrito Capital"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un tipo" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="competencia">Competencia</SelectItem>
                                    <SelectItem value="seminario">Seminario</SelectItem>
                                    <SelectItem value="exhibicion">Exhibición</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un estado" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="programado">Programado</SelectItem>
                                    <SelectItem value="en-curso">En Curso</SelectItem>
                                    <SelectItem value="finalizado">Finalizado</SelectItem>
                                    <SelectItem value="cancelado">Cancelado</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
          </div>
        </ScrollArea>
        <Button type="submit" className="w-full mt-6">
          Guardar Cambios
        </Button>
      </form>
    </Form>
  );
}
