'use client';

import * as React from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { es } from 'date-fns/locale';

const competitionImages = [
  PlaceHolderImages.find(p => p.id === 'karate-competition'),
  PlaceHolderImages.find(p => p.id === 'karate-event'),
].filter(Boolean) as (typeof PlaceHolderImages[number])[];

export default function EventsAndCompetitions() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  return (
    <section className="w-full py-16 sm:py-24 bg-black text-accent-foreground">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Calendario Section */}
          <div className="flex flex-col justify-center items-center">
            <div className="w-full text-center mb-8">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-primary">
                      Calendario de Eventos
                  </h2>
                  <p className="text-lg text-primary-foreground/80 mt-4 max-w-md mx-auto">
                      Mantente al día con nuestras próximas competencias y seminarios.
                  </p>
              </div>
              <Card className="p-0 shadow-lg overflow-hidden w-auto inline-block">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md"
                  locale={es}
                  initialFocus
                />
              </Card>
          </div>

          {/* Carousel Section */}
          <div className="flex flex-col justify-center items-center">
            <div className="w-full text-center mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-primary">
                Galería de Competencias
              </h2>
              <p className="text-lg text-primary-foreground/80 mt-4 max-w-md mx-auto">
                Revive los momentos más emocionantes de nuestros torneos.
              </p>
            </div>
            <Carousel className="w-full max-w-sm sm:max-w-md"
                opts={{
                    loop: true,
                }}
            >
              <CarouselContent>
                {competitionImages.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="overflow-hidden border-2 border-primary/20 shadow-xl rounded-xl">
                        <CardContent className="flex aspect-[4/3] items-center justify-center p-0">
                          {img && <Image
                            src={img.imageUrl}
                            alt={img.description}
                            width={800}
                            height={600}
                            data-ai-hint={img.imageHint}
                            className="w-full h-full object-cover"
                          />}
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex -left-12 text-primary-foreground bg-primary/80 hover:bg-primary" />
              <CarouselNext className="hidden sm:flex -right-12 text-primary-foreground bg-primary/80 hover:bg-primary" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}
