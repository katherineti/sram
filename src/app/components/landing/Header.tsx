'use client';

import Link from 'next/link';
import { Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import React, { useState } from 'react';
import KarateLogo from '../KarateLogo';

const menuItems = [
  { name: "Competencias", href: "#" },
  { name: "Eventos", href: "#" },
  { name: "Ganadores", href: "#winners" },
  { name: "Conócenos", href: "#conocenos" },
];

export default function Header({ onSearch }: { onSearch: (term: string) => void }) {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearchTerm);
    const searchSection = document.getElementById('search');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    }
    if (isSheetOpen) {
        setSheetOpen(false);
    }
  };
  
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <KarateLogo />
          <span className="text-2xl font-headline font-bold">SRAM</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
          <form onSubmit={handleSearch} className="relative ml-4 hidden lg:block">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Buscar..." 
                className="pr-9 h-9 w-[200px] bg-muted/50 border-transparent focus:border-primary focus:bg-background focus:ring-primary"
                value={localSearchTerm}
                onChange={handleSearchInputChange}
             />
          </form>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button>Iniciar Sesión</Button>
          </Link>

          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className='sr-only'>Menú de Navegación</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full">
                <Link href="/" className="flex items-center gap-2 mb-8" onClick={() => setSheetOpen(false)}>
                  <KarateLogo />
                  <span className="text-2xl font-headline font-bold">SRAM</span>
                </Link>
                <nav className="flex flex-col gap-6 text-lg">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="font-medium text-foreground transition-colors hover:text-primary"
                      onClick={() => setSheetOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                 <form onSubmit={handleSearch} className="relative mt-8">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar..." 
                        className="pr-10"
                        value={localSearchTerm}
                        onChange={handleSearchInputChange}
                    />
                </form>
                <div className="mt-auto pt-6">
                    <Link href="/login" onClick={() => setSheetOpen(false)}>
                        <Button className="w-full">Iniciar Sesión</Button>
                    </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
