'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Define la interfaz para un usuario.
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
  representedStudents?: Pick<User, 'id' | 'firstName' | 'lastName'>[];
}

// Define la interfaz para el valor del contexto.
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

// Crea el contexto con un valor predeterminado.
const UserContext = createContext<UserContextType | undefined>(undefined);


// Crea el proveedor del contexto.
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, setIsLoading }}>
      {children}
    </UserContext.Provider>
  );
};


// Hook personalizado para usar el contexto de usuario.
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
