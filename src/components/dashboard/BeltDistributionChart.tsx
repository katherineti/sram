'use client';
import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, BarChart, ResponsiveContainer } from "recharts";
import { athletes as mockAthletes } from '@/lib/mock-data';

const beltOrder = ["Blanco", "Amarillo", "Naranja", "Verde", "Azul", "Púrpura", "Marrón", "Negro"];

const beltColors: { [key: string]: string } = {
    Blanco: "hsl(0 0% 90%)",
    Amarillo: "hsl(48 96% 58%)",
    Naranja: "hsl(25 95% 53%)",
    Verde: "hsl(142 71% 45%)",
    Azul: "hsl(221 83% 53%)",
    Púrpura: "hsl(262 88% 59%)",
    Marrón: "hsl(25 76% 35%)",
    Negro: "hsl(0 0% 10%)",
};

export default function BeltDistributionChart() {

  const { chartData, chartConfig } = useMemo(() => {
    const beltCounts: { [key: string]: number } = {};
    beltOrder.forEach(belt => beltCounts[belt] = 0);
    
    mockAthletes.forEach(athlete => {
        if (beltCounts[athlete.cinturon] !== undefined) {
            beltCounts[athlete.cinturon]++;
        }
    });

    const data = beltOrder.map(belt => ({
        belt: belt,
        count: beltCounts[belt],
        fill: beltColors[belt] || 'hsl(var(--muted))'
    }));

    const config = {
        count: {
            label: "Atletas",
            color: "hsl(var(--primary))",
        },
    };

    return { chartData: data, chartConfig: config };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Atletas por Cinturón</CardTitle>
        <CardDescription>Muestra la cantidad de atletas en cada nivel de cinturón.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="belt"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.substring(0, 3)}
              />
              <YAxis allowDecimals={false}/>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent 
                    labelKey='count'
                    indicator="dot" 
                    formatter={(value, name, props) => {
                        return (
                            <div className="flex flex-col">
                                <span className="font-medium text-foreground">{props.payload.belt}</span>
                                <span className="text-muted-foreground">{value} Atletas</span>
                            </div>
                        )
                    }}
                />}
              />
              <Bar dataKey="count" radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
