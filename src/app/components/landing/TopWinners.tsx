
'use client';

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { athletes as mockAthletes } from '@/lib/mock-data';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Crown } from 'lucide-react';

const CURRENT_YEAR = 2025;

// Array of specific images for the top 3 winners
const winnerImages = [
  'https://albaciudad.org/wp-content/uploads/2019/04/Antonio-D%C3%ADaz-e1555770927578.jpg', // 1st place
  'https://media.diariolasamericas.com/p/932cadf3cf139067d36c9727ca30f04b/adjuntos/216/imagenes/002/395/0002395777/ariel-torresjpg.jpg?2021-08-20-11-24-29', // 2nd place
  'https://i0.wp.com/mindeporte.gob.ve/wp-content/uploads/2023/11/WhatsApp-Image-2023-11-25-at-9.30.33-PM-1.jpeg?resize=640%2C853&ssl=1', // 3rd place
];

export default function TopWinners() {

  const topThreeAthletes = useMemo(() => {
    // Simulación de que los atletas "quemados" son los ganadores
    const winners = [
        { ...mockAthletes.find(a => a.apellidos === 'Méndez'), id: 1, nombres: 'Sofía', apellidos: 'Méndez' },
        { ...mockAthletes.find(a => a.apellidos === 'Ramírez'), id: 2, nombres: 'Juan', apellidos: 'Ramírez' },
        { ...mockAthletes.find(a => a.apellidos === 'Rojas'), id: 3, nombres: 'Gabriela', apellidos: 'Rojas' },
    ];
    
    // Esto es solo para asegurar que los datos no son undefined si no encuentra los apellidos.
    // Para el caso de uso actual, se usarán los nombres definidos arriba.
    if (winners.some(w => !w.id)) {
        return [...mockAthletes]
            .sort((a, b) => {
                if (b.ranking !== a.ranking) return b.ranking - a.ranking;
                if (b.oro !== a.oro) return b.oro - a.oro;
                if (b.plata !== a.plata) return b.plata - a.plata;
                return b.bronce - a.bronce;
            })
            .slice(0, 3);
    }
    
    return winners;
  }, []);

  const podiumStyles = [
    { // 1st place
      borderColor: 'group-hover:border-yellow-400',
      textColor: 'text-yellow-400',
      placeText: '1er Lugar',
    },
    { // 2nd place
      borderColor: 'group-hover:border-gray-400',
      textColor: 'text-gray-400',
      placeText: '2do Lugar',
    },
    { // 3rd place
      borderColor: 'group-hover:border-amber-600',
      textColor: 'text-amber-600',
      placeText: '3er Lugar',
    }
  ];

  return (
    <section id="winners" className="py-16 sm:pb-16 bg-background min-h-screen flex flex-col items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-primary">
            Ganadores Destacados {CURRENT_YEAR}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Conoce a los campeones que han llegado a la cima del ranking nacional este año.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 justify-center">
          {topThreeAthletes.map((athlete, index) => {
            const style = podiumStyles[index];

            return (
              <Card 
                key={athlete.id} 
                className={cn(
                  "overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 border-4 border-transparent",
                  style.borderColor
                )}
              >
                <CardContent className="p-0 text-center relative aspect-[3/4]">
                  <Image
                    src={winnerImages[index] || `https://picsum.photos/seed/${athlete.id + 100}/600/800`}
                    alt={`Foto de ${athlete.nombres}`}
                    fill
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint="karate portrait"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
                     <div className='flex items-center gap-2'>
                        <Crown className={cn("h-6 w-6", style.textColor)} />
                        <p className={cn("text-lg font-bold", style.textColor)}>{style.placeText}</p>
                     </div>
                     <h3 className="text-3xl font-bold text-white tracking-tight mt-2">
                        {athlete.nombres} {athlete.apellidos}
                     </h3>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
