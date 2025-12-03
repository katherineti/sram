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
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { useUser } from "@/contexts/UserContext";
import { useMemo, useEffect } from "react";
import type { Claim } from "@/app/dashboard/claims/page";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const formSchema = z.object({
  subject: z.string().min(5, "El asunto debe tener al menos 5 caracteres."),
  description: z.string().min(20, "La descripción debe tener al menos 20 caracteres."),
  status: z.enum(['enviado', 'en-proceso', 'resuelto', 'rechazado']),
});

type ClaimEditFormValues = z.infer<typeof formSchema>;

interface ClaimEditFormProps {
    claim: Claim;
    onSuccess: (updatedClaim: Claim) => void;
}

export default function ClaimEditForm({ claim, onSuccess }: ClaimEditFormProps) {
  const { user } = useUser();

  const form = useForm<ClaimEditFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        subject: "",
        description: "",
        status: 'enviado',
    },
  });

  useEffect(() => {
    form.reset({
        subject: claim.subject,
        description: claim.description,
        status: claim.status,
    });
  }, [claim, form]);


  async function onSubmit(values: ClaimEditFormValues) {
    if (!user) return;

    const updatedClaim: Claim = {
        ...claim,
        subject: values.subject,
        description: values.description,
        status: values.status,
    };

    console.log("Simulating claim update with:", updatedClaim);
    onSuccess(updatedClaim);
  }

  const canChangeStatus = user?.role === 'admin' || user?.role === 'master';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ScrollArea className="h-[65vh] pr-4">
          <div className="space-y-6 p-1">
             <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Representado</p>
                <p className="font-semibold">{claim.representedName} ({claim.representedType})</p>
            </div>

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
            
            {canChangeStatus && (
                 <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Estado del Reclamo</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un estado" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="enviado">Enviado</SelectItem>
                                    <SelectItem value="en-proceso">En Proceso</SelectItem>
                                    <SelectItem value="resuelto">Resuelto</SelectItem>
                                    <SelectItem value="rechazado">Rechazado</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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

    