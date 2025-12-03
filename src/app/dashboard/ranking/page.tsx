
import RankingTable from '@/components/dashboard/RankingTable';
import { athletes as mockAthletes, schools as mockSchools, Athlete } from '@/lib/mock-data';

export default function RankingPage() {
  const athletesWithDate: Athlete[] = mockAthletes.map(a => ({...a, registrationDate: new Date(a.registrationDate)}));
  
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Ranking</h1>
        <p className="text-muted-foreground">
          Visualiza, filtra y gestiona el ranking nacional de atletas.
        </p>
      </div>
      <RankingTable initialAthletes={athletesWithDate} schools={mockSchools} />
    </div>
  );
}

    