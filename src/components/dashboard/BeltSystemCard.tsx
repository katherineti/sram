'use client';
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { Badge } from '../ui/badge';

const belts = [
  'Blanco',
  'Amarillo',
  'Naranja',
  'Verde',
  'Azul',
  'Púrpura',
  'Marrón',
  'Negro',
];

const beltColors: { [key: string]: string } = {
  Blanco: 'bg-white text-black border border-gray-300',
  Amarillo: 'bg-yellow-400 text-black',
  Naranja: 'bg-orange-500 text-white',
  Verde: 'bg-green-600 text-white',
  Azul: 'bg-blue-600 text-white',
  Púrpura: 'bg-purple-600 text-white',
  Marrón: 'bg-amber-800 text-white',
  Negro: 'bg-black text-white',
};

export default function BeltSystemCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Sistema de Cinturones (Kyu/Dan)
        </CardTitle>
        <CardDescription>
          Progresión de rangos en el sistema de karate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {belts.map(belt => (
            <Badge
              key={belt}
              className={`text-sm font-semibold justify-center py-2 ${
                beltColors[belt]
              }`}
            >
              {belt}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
