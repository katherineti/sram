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
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida."),
    newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres."),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
});


export default function ChangePasswordForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Simulating password change with:", values);
    toast({
      title: "¡Contraseña Actualizada!",
      description: "Tu contraseña ha sido cambiada con éxito (simulación).",
    });
    onSuccess();
  }

  const togglePasswordVisibility = (e: React.MouseEvent<HTMLSpanElement>, setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    e.preventDefault();
    setter(prev => !prev);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña Actual</FormLabel>
              <FormControl>
                <div className="relative">
                    <Input type={showCurrentPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                     <span
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-muted-foreground"
                        onMouseDown={(e) => togglePasswordVisibility(e, setShowCurrentPassword)}
                    >
                        {showCurrentPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                    </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nueva Contraseña</FormLabel>
               <FormControl>
                <div className="relative">
                    <Input type={showNewPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                     <span
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-muted-foreground"
                        onMouseDown={(e) => togglePasswordVisibility(e, setShowNewPassword)}
                    >
                        {showNewPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                    </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Nueva Contraseña</FormLabel>
               <FormControl>
                <div className="relative">
                    <Input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                     <span
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-muted-foreground"
                        onMouseDown={(e) => togglePasswordVisibility(e, setShowConfirmPassword)}
                    >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                    </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Guardar Cambios
        </Button>
      </form>
    </Form>
  );
}
