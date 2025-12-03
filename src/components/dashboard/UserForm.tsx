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
import { Separator } from "../ui/separator";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Por favor, introduce un correo electrónico válido."),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres."),
});

export default function UserForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Simulating user creation with:", values);
    toast({
      title: "¡Usuario Creado! (Simulación)",
      description: `El usuario ${values.email} ha sido registrado con éxito.`,
    });
    onSuccess();
  }
  
  const togglePasswordVisibility = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    setShowPassword(prev => !prev);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ScrollArea className="h-auto pr-4">
          <div className="space-y-8 p-1">
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
                      <Input
                        type="email"
                        placeholder="usuario@email.com"
                        {...field}
                        data-invalid={!!form.formState.errors.email}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                       <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          data-invalid={!!form.formState.errors.password}
                        />
                        <span
                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-muted-foreground"
                            onMouseDown={togglePasswordVisibility}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </ScrollArea>
        <Button type="submit" className="w-full mt-6">
          Crear Usuario
        </Button>
      </form>
    </Form>
  );
}
