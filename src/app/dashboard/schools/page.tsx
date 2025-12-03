
import SchoolTable from '@/components/dashboard/SchoolTable';
import { schools as mockSchools, athletes } from "@/lib/mock-data";

const mockUsers = athletes.map(athlete => {
  const roles: ("admin" | "master" | "alumno" | "representante")[] = ["alumno", "representante", "master", "admin"];
  const role = roles[athlete.id % 4] || 'alumno';

  return {
  id: athlete.id,
  firstName: athlete.nombres,
  lastName: athlete.apellidos,
  email: `${athlete.nombres.split(' ')[0].toLowerCase()}.${athlete.apellidos.split(' ')[0].toLowerCase()}@example.com`,
  role: role,
}});

const getMasterForSchool = (schoolValue: string) => {
    // This is a simplistic way to assign a master. 
    // In a real app, this relationship would be in the data.
    const masters = mockUsers.filter(u => u.role === 'master');
    const index = mockSchools.findIndex(s => s.value === schoolValue);
    return masters[index % masters.length];
}

const initialSchoolsData = mockSchools.map((school, index) => ({
  id: school.value,
  name: school.label,
  address: `Dirección de ${school.label}`,
  masterId: getMasterForSchool(school.value)?.id,
  logoUrl: `https://picsum.photos/seed/${index + 50}/200`
}));

export default function SchoolsPage() {
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Escuelas</h1>
        <p className="text-muted-foreground">
          Visualiza, crea, edita y elimina escuelas del sistema.
        </p>
      </div>
      <SchoolTable initialSchools={initialSchoolsData} allUsers={mockUsers}/>
    </div>
  );
}

    