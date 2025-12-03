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
import type { Athlete } from "./RankingTable";
import { useEffect } from "react";
import { Medal } from "lucide-react";

const formSchema = z.object({
  ranking: z.coerce
    .number()
    .int("El ranking debe ser un número entero.")
    .nonnegative("El ranking no puede ser negativo."),
  oro: z.coerce
    .number()
    .int("El número de medallas debe ser un entero.")
    .nonnegative("El número de medallas no puede ser negativo."),
  plata: z.coerce
    .number()
    .int("El número de medallas debe ser un entero.")
    .nonnegative("El número de medallas no puede ser negativo."),
  bronce: z.coerce
    .number()
    .int("El número de medallas debe ser un entero.")
    .nonnegative("El número de medallas no puede ser negativo."),
});

export default function RankingEditForm({ athlete, onSuccess }: { athlete: Athlete; onSuccess: (updatedAthlete: Athlete) => void }) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ranking: athlete.ranking || 0,
      oro: athlete.oro || 0,
      plata: athlete.plata || 0,
      bronce: athlete.bronce || 0,
    },
  });
  
  useEffect(() => {
    form.reset({
      ranking: athlete.ranking || 0,
      oro: athlete.oro || 0,
      plata: athlete.plata || 0,
      bronce: athlete.bronce || 0,
    });
  }, [athlete, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Updating athlete ranking:", values);

    const updatedAthlete: Athlete = {
        ...athlete,
        ...values,
    };
    
    toast({
      title: "¡Ranking Actualizado! (Simulación)",
      description: `El ranking de ${athlete.nombres} ha sido actualizado.`,
    });
    onSuccess(updatedAthlete);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="ranking"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Puntuación de Ranking</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="1500"
                  {...field}
                  data-invalid={!!form.formState.errors.ranking}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
            <FormLabel>Medallas</FormLabel>
            <div className="grid grid-cols-3 gap-4">
                 <FormField
                    control={form.control}
                    name="oro"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2 text-muted-foreground">
                                <Medal className="h-4 w-4 text-yellow-500" /> Oro
                            </FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="plata"
                    render={({ field }) => (
                        <FormItem>
                             <FormLabel className="flex items-center gap-2 text-muted-foreground">
                                <Medal className="h-4 w-4 text-gray-400" /> Plata
                            </FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="bronce"
                    render={({ field }) => (
                        <FormItem>
                             <FormLabel className="flex items-center gap-2 text-muted-foreground">
                                <Medal className="h-4 w-4 text-amber-600" /> Bronce
                            </FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>

        <Button type="submit" className="w-full mt-6">
          Guardar Cambios
        </Button>
      </form>
    </Form>
  );
}
