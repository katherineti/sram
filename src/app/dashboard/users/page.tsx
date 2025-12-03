
import UserTable from '@/components/dashboard/UserTable';
import { athletes, schools } from "@/lib/mock-data";

// Helper to generate a plausible date of birth from age
const getBirthDateFromAge = (age: number) => {
  const today = new Date();
  const year = today.getFullYear() - age;
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(year, month, day);
}

// Remap mock data to match User interface
const mockUsers = athletes.map(athlete => {
  const roles: ("admin" | "master" | "alumno" | "representante")[] = ["alumno", "representante", "master", "admin"];
  const role = roles[athlete.id % 4] || 'alumno';

  // Find a representative that is not the athlete themselves
  const possibleReps = athletes.filter(a => a.id !== athlete.id && (a.id % 4) === 1);
  const representative = role === 'alumno' ? possibleReps[athlete.id % possibleReps.length] : undefined;

  return {
    id: athlete.id,
    firstName: athlete.nombres,
    lastName: athlete.apellidos,
    email: `${athlete.nombres.split(' ')[0].toLowerCase()}.${athlete.apellidos.split(' ')[0].toLowerCase()}@example.com`,
    role: role,
    photoURL: `https://picsum.photos/seed/${athlete.id}/200/200`,
    cedula: athlete.cedula,
    dateOfBirth: getBirthDateFromAge(athlete.edad),
    schoolId: schools.find(s => s.label === athlete.escuela)?.value,
    school: athlete.escuela,
    belt: athlete.cinturon,
    ranking: athlete.ranking,
    representativeId: representative ? String(representative.id) : undefined,
  };
});

export default function UsersPage() {
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
        <p className="text-muted-foreground">
          Visualiza, crea, edita y elimina usuarios del sistema.
        </p>
      </div>
      <UserTable initialUsers={mockUsers} />
    </div>
  );
}

    