'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AthleteSearch from "./AthleteSearch";
import SchoolSearch from "./SchoolSearch";
import { useEffect, useState } from "react";

export default function SearchSection({ searchTerm, onSearchChange }: { searchTerm: string; onSearchChange: (term: string) => void; }) {
  const [activeTab, setActiveTab] = useState("athlete");
  
  useEffect(() => {
    if (searchTerm) {
        setActiveTab("athlete");
    }
  }, [searchTerm]);

  return (
    <section id="search" className="py-16 sm:py-24 bg-gradient-to-br from-primary via-primary to-accent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-primary-foreground">
                Explora el Ranking
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-foreground/90">
                Busca atletas por nombre o cédula, o explora las estadísticas por escuela.
            </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 h-12 bg-white/20 text-primary-foreground">
            <TabsTrigger value="athlete" className="text-base data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg">Buscar Atleta</TabsTrigger>
            <TabsTrigger value="school" className="text-base data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg">Buscar Escuela</TabsTrigger>
          </TabsList>
          <TabsContent value="athlete" className="mt-8">
            <AthleteSearch initialSearchTerm={searchTerm} onSearchChange={onSearchChange} />
          </TabsContent>
          <TabsContent value="school" className="mt-8">
            <SchoolSearch />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
