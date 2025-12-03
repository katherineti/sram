'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Users, Building, FileText, Trophy, ClipboardList } from "lucide-react"
import { es } from 'date-fns/locale';
import { format, subMonths } from 'date-fns';
import BeltDistributionChart from "@/components/dashboard/BeltDistributionChart";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import RecentAthletesTable from "@/components/dashboard/RecentAthletesTable";
import UserRoleDistributionChart from "@/components/dashboard/UserRoleDistributionChart";
import { useUser } from "@/contexts/UserContext";
import BeltSystemCard from "@/components/dashboard/BeltSystemCard";
import CategoryListCard from "@/components/dashboard/CategoryListCard";


export default function DashboardPage() {
  const { user } = useUser();
  
  const getPreviousMonthName = () => {
    const today = new Date();
    const previousMonth = subMonths(today, 1);
    const monthName = format(previousMonth, 'MMMM', { locale: es });
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);
  };
  
  const getCurrentMonthName = () => {
    const today = new Date();
    const monthName = format(today, 'MMMM', { locale: es });
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);
  };
  
  const getFormattedDate = () => {
    const today = new Date();
    const formattedDate = format(today, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  const previousMonthName = getPreviousMonthName();
  const currentMonthName = getCurrentMonthName();
  const currentDate = getFormattedDate();
  const displayName = user ? `${user.firstName} ${user.lastName}` : "Usuario";

  return (
    <div className="grid gap-8">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">¡Bienvenido, {displayName}!</h1>
            <p className="text-muted-foreground">{currentDate}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Atletas Totales</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100</div>
              <p className="text-xs text-muted-foreground">Aumento del 3.5% respecto a {previousMonthName}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Escuelas Registradas</CardTitle>
              <Building className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">16</div>
              <p className="text-xs text-muted-foreground">+2 nuevas en {currentMonthName}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Competencias Activas</CardTitle>
              <Trophy className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Próximo evento en 3 días</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Eventos Programados</CardTitle>
              <ClipboardList className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">5 nuevos este mes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Reclamos Pendientes</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">1 nuevo hoy</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
                <BeltDistributionChart />
            </div>
            <div className="lg:col-span-2">
                <UserRoleDistributionChart />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
                <RecentAthletesTable />
            </div>
            <div className="lg:col-span-2">
                <UpcomingEvents />
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <BeltSystemCard />
             <CategoryListCard />
        </div>
      </div>
  )
}
