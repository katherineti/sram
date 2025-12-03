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
import { useEffect, useState, useMemo } from "react";
import { Medal } from "lucide-react";
import { Combobox } from "../ui/combobox";
import { athletes as mockAthletes } from "@/lib/mock-data";
import { ScrollArea } from "../ui/scroll-area";

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

const formSchema = z.object({
  athleteId: z.string().min(1, "Debes seleccionar un atleta."),
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

export default function AssignRankingForm({ athletes, onSuccess }: { athletes: Athlete[]; onSuccess: (updatedAthlete: Athlete) => void }) {
  const { toast } = useToast();
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);

  const athleteOptions = useMemo(() => 
    athletes.map(a => ({
        value: a.id.toString(),
        label: `${a.nombres} ${a.apellidos} (${a.cedula})`
    })), [athletes]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      athleteId: "",
      ranking: 0,
      oro: 0,
      plata: 0,
      bronce: 0,
    },
  });

  const athleteId = form.watch("athleteId");

  useEffect(() => {
    const athlete = athletes.find(a => a.id.toString() === athleteId);
    setSelectedAthlete(athlete || null);
    if (athlete) {
        form.reset({
            athleteId: athlete.id.toString(),
            ranking: athlete.ranking || 0,
            oro: athlete.oro || 0,
            plata: athlete.plata || 0,
            bronce: athlete.bronce || 0,
        });
    } else {
        form.reset({
            athleteId: "",
            ranking: 0,
            oro: 0,
            plata: 0,
            bronce: 0,
        });
    }
  }, [athleteId, athletes, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedAthlete) return;
    
    console.log("Updating athlete ranking:", values);

    const updatedAthlete: Athlete = {
        ...selectedAthlete,
        ...values,
    };
    
    toast({
      title: "¡Ranking Asignado! (Simulación)",
      description: `El ranking de ${selectedAthlete.nombres} ha sido actualizado.`,
    });
    onSuccess(updatedAthlete);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6">
                <FormField
                    control={form.control}
                    name="athleteId"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Atleta</FormLabel>
                            <Combobox
                                items={athleteOptions}
                                value={field.value}
                                onSelect={(currentValue) => field.onChange(currentValue)}
                                searchPlaceholder="Buscar atleta..."
                                selectPlaceholder="Selecciona un atleta"
                                noResultsMessage="No se encontró ningún atleta."
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {selectedAthlete && (
                    <div className="space-y-4 pt-4 border-t animate-in fade-in-50">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Categoría</p>
                                <p className="font-semibold">{getCategory(selectedAthlete.edad)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Cinturón</p>
                                <p className="font-semibold">{selectedAthlete.cinturon}</p>
                            </div>
                        </div>

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
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <div>
                            <FormLabel>Medallas</FormLabel>
                            <div className="grid grid-cols-3 gap-4 mt-2">
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
                    </div>
                )}
            </div>
        </ScrollArea>
        <Button type="submit" className="w-full mt-6" disabled={!selectedAthlete}>
          Guardar Cambios
        </Button>
      </form>
    </Form>
  );
}
