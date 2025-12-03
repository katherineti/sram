'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

const categories = [
    'Hasta 5 años (mixto)',
    'Infantil A (6-7 años)',
    'Infantil B (8-9 años)',
    'Infantil C (10-11 años)',
    'Cadete (12-13 años)',
    'Junior (14-15 años)',
    'Sub-21 (16-17 años)',
    'Adulto (18+ años)',
];

export default function CategoryListCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Categorías de Competición
        </CardTitle>
        <CardDescription>
          Divisiones de edad para los torneos de karate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
          {categories.map(category => (
            <Badge key={category} variant="secondary" className="border border-transparent text-sm font-normal justify-center py-1.5">
              {category}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
