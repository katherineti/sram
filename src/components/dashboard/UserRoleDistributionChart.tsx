'use client';
import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, BarChart, ResponsiveContainer } from "recharts";
import { athletes as mockAthletes } from '@/lib/mock-data';

const roleOrder = ["alumno", "representante", "master", "admin"];
const roleLabels: { [key: string]: string } = {
  admin: "Admin",
  master: "Master",
  alumno: "Alumno",
  representante: "Representante",
};

const roleColors: { [key: string]: string } = {
    alumno: "hsl(var(--chart-1))",
    representante: "hsl(var(--chart-2))",
    master: "hsl(var(--chart-3))",
    admin: "hsl(var(--chart-4))",
};


// This logic is duplicated from UserTable.tsx for simplicity. In a real app, this should be centralized.
const mockUsers = mockAthletes.map(athlete => {
  const roles: ("admin" | "master" | "alumno" | "representante")[] = ["alumno", "representante", "master", "admin"];
  const role = roles[athlete.id % 4] || 'alumno';
  return {
    id: athlete.id,
    firstName: athlete.nombres,
    lastName: athlete.apellidos,
    email: `${athlete.nombres.split(' ')[0].toLowerCase()}.${athlete.apellidos.split(' ')[0].toLowerCase()}@example.com`,
    role: role,
  };
});

export default function UserRoleDistributionChart() {

  const { chartData, chartConfig } = useMemo(() => {
    const roleCounts: { [key: string]: number } = { admin: 0, master: 0, alumno: 0, representante: 0 };
    
    mockUsers.forEach(user => {
        if (roleCounts[user.role] !== undefined) {
            roleCounts[user.role]++;
        }
    });

    const data = roleOrder.map(role => ({
        role: roleLabels[role],
        count: roleCounts[role],
        fill: roleColors[role]
    }));

    const config = {
        count: {
            label: "Usuarios",
        },
        ...roleOrder.reduce((acc, role) => {
            acc[roleLabels[role]] = {
              label: roleLabels[role],
              color: roleColors[role],
            };
            return acc;
          }, {} as any)
    };

    return { chartData: data, chartConfig: config };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Usuarios por Rol</CardTitle>
        <CardDescription>Cantidad de usuarios en cada rol dentro del sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 20, right: 30 }}>
              <CartesianGrid horizontal={false} />
               <XAxis type="number" dataKey="count" allowDecimals={false} />
               <YAxis
                dataKey="role"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                width={90}
                interval={0}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent 
                    hideLabel
                    formatter={(value, name, props) => {
                        return (
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: props.payload.fill}}></div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-foreground">{props.payload.role}</span>
                                    <span className="text-muted-foreground">{value} Usuarios</span>
                                </div>
                            </div>
                        )
                    }}
                />}
              />
              <Bar dataKey="count" radius={5} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
