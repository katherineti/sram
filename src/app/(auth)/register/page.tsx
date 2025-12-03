
'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
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
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Por favor, introduce un correo electrónico válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});


export default function RegisterPage() {
  const router = useRouter();
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
    // Simulate registration
    console.log("Simulating registration with:", values);
    
    toast({
      title: "¡Registro exitoso!",
      description: "Tu cuenta ha sido creada (simulación). ¡Bienvenido!",
    });
    router.push("/dashboard");
  }

  const togglePasswordVisibility = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    setShowPassword(prev => !prev);
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="hidden lg:block lg:fixed lg:top-0 lg:right-0 lg:w-1/2 lg:h-full">
        <div className="relative flex flex-col items-center justify-center h-full bg-gray-900 text-white text-center p-12">
          <video
            src="/videos/videoQuienesSomos.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover opacity-30"
          />
          <div className="relative z-10 space-y-4">
            <h1 className="text-4xl xl:text-5xl font-bold tracking-tight">
              Únete a la comunidad SRAM
            </h1>
            <p className="text-lg xl:text-xl text-white/80 max-w-lg">
              Crea tu cuenta y empieza a forjar tu camino.
            </p>
          </div>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 lg:mr-[50%] h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto min-h-screen">
        <div className="mx-auto grid w-full max-w-md gap-8">
          <div className="grid gap-3 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-primary">Crear una Cuenta</h1>
            <p className="text-muted-foreground">
              Introduce tus datos para registrarte.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        {...field}
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
              <Button type="submit" className="w-full py-6 text-base font-semibold mt-2">
                Registrarse
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="underline font-semibold">
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
