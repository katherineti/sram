"use client";

import { useForm, Controller } from "react-hook-form";
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
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useUser } from "@/contexts/UserContext";
import { Combobox } from "../ui/combobox";
import { schools as mockSchools } from "@/lib/mock-data";
import { useMemo } from "react";
import type { Claim } from "@/app/dashboard/claims/page";

const formSchema = z.object({
  representedType: z.enum(['alumno', 'escuela'], {
    required_error: "Debes seleccionar si representas a un alumno o una escuela.",
  }),
  representedId: z.string().min(1, "Debes seleccionar a quién representas."),
  subject: z.string().min(5, "El asunto debe tener al menos 5 caracteres."),
  description: z.string().min(20, "La descripción debe tener al menos 20 caracteres."),
});

type ClaimFormValues = z.infer<typeof formSchema>;

interface ClaimFormProps {
    onSuccess: (newClaim: Claim) => void;
}

export default function ClaimForm({ onSuccess }: ClaimFormProps) {
  const { user } = useUser();
  const { toast } = useToast();

  const form = useForm<ClaimFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        representedId: "",
        subject: "",
        description: "",
    },
  });

  const representedType = form.watch("representedType");

  const studentOptions = useMemo(() => 
    user?.representedStudents?.map(s => ({
        value: s.id.toString(),
        label: `${s.firstName} ${s.lastName}`
    })) || [], 
  [user?.representedStudents]);

  const schoolOptions = useMemo(() => mockSchools.map(s => ({
    value: s.value,
    label: s.label,
  })), []);


  async function onSubmit(values: ClaimFormValues) {
    if (!user) {
        toast({ variant: "destructive", title: "No autenticado" });
        return;
    }

    const representedItem = 
        values.representedType === 'alumno' 
        ? studentOptions.find(s => s.value === values.representedId)
        : schoolOptions.find(s => s.value === values.representedId);

    if (!representedItem) {
        toast({ variant: "destructive", title: "Error", description: "El representado seleccionado no es válido."});
        return;
    }

    const newClaim: Claim = {
        id: `claim-${Date.now()}`,
        representativeId: user.id.toString(),
        representativeName: `${user.firstName} ${user.lastName}`,
        representedId: values.representedId,
        representedName: representedItem.label,
        representedType: values.representedType,
        subject: values.subject,
        description: values.description,
        status: 'enviado',
        submissionDate: new Date(),
    };

    console.log("Simulating claim creation with:", newClaim);
    onSuccess(newClaim);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ScrollArea className="h-[65vh] pr-4">
          <div className="space-y-6 p-1">
            <FormField
              control={form.control}
              name="representedType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>¿A quién va dirigido el reclamo?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.resetField("representedId");
                      }}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="alumno" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Un Alumno
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="escuela" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Una Escuela
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {representedType && (
                <FormField
                    control={form.control}
                    name="representedId"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>
                            {representedType === 'alumno' ? 'Selecciona el Alumno' : 'Selecciona la Escuela'}
                        </FormLabel>
                        <Combobox
                            items={representedType === 'alumno' ? studentOptions : schoolOptions}
                            value={field.value}
                            onSelect={field.onChange}
                            searchPlaceholder={representedType === 'alumno' ? "Buscar alumno..." : "Buscar escuela..."}
                            selectPlaceholder={representedType === 'alumno' ? "Selecciona un alumno" : "Selecciona una escuela"}
                            noResultsMessage={representedType === 'alumno' ? "No se encontró el alumno." : "No se encontró la escuela."}
                        />
                        <FormMessage />
                    </FormItem>
                    )}
                />
            )}

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asunto del Reclamo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Problema con puntuación en torneo"
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
                  <FormLabel>Descripción Detallada</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explica detalladamente el motivo de tu reclamo..."
                      className="resize-none min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </ScrollArea>
        <Button type="submit" className="w-full mt-6">
          Enviar Reclamo
        </Button>
      </form>
    </Form>
  );
}
