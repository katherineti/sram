"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useProgressBar } from '@/contexts/ProgressBarContext';

export default function PageProgressBar() {
  const pathname = usePathname();
  const { progress, isVisible, startProgress, completeProgress } = useProgressBar();

  useEffect(() => {
    // Si la barra está visible al cambiar de ruta (p.ej. recarga de página), complétala.
    if (isVisible) {
      completeProgress();
    }
  // Queremos que esto solo se ejecute cuando el pathname cambie.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div 
        className={cn(
            "fixed top-0 left-0 w-full h-1 z-50 transition-opacity duration-300",
            isVisible ? "opacity-100" : "opacity-0"
        )}
    >
        <Progress value={progress} className="h-1 rounded-none bg-transparent" />
    </div>
  );
}
