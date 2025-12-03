import { Card } from "@/components/ui/card";

export default function AboutUs() {
  return (
    <section id="conocenos" className="bg-card py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-left md:order-1">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-primary">
              Quiénes Somos
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg text-left sm:text-justify">
              SRAM (Sistema de Ranking de Artes Mariales) es la plataforma oficial para el seguimiento y clasificación de atletas de karate en Venezuela. Nuestra misión es promover la excelencia, la transparencia y el espíritu deportivo en la comunidad de las artes marciales a nivel nacional.
            </p>
            <p className="text-muted-foreground text-base sm:text-lg text-left sm:text-justify">
              Ofrecemos un sistema robusto y escalable que permite a administradores, maestros, alumnos y representantes interactuar de manera eficiente. Desde la gestión de escuelas y atletas hasta el registro de puntuaciones en competencias, SRAM es la herramienta definitiva para el karate venezolano.
            </p>
          </div>
          <div className="md:order-2">
            <Card className="overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 max-w-lg mx-auto">
              <video
                src="/videos/videoQuienesSomos.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto object-cover"
              />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
