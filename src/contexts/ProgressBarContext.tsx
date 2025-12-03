'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface ProgressBarContextType {
  progress: number;
  isVisible: boolean;
  startProgress: () => void;
  completeProgress: () => void;
}

const ProgressBarContext = createContext<ProgressBarContextType | undefined>(undefined);

export const ProgressBarProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const startProgress = useCallback(() => {
    if (timer) clearTimeout(timer);
    setIsVisible(true);
    setProgress(0);
    const newTimer = setTimeout(() => setProgress(30 + Math.random() * 20), 50);
    setTimer(newTimer);
  }, [timer]);

  const completeProgress = useCallback(() => {
    if (timer) clearTimeout(timer);
    setProgress(100);
    const newTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setProgress(0), 300);
    }, 300);
    setTimer(newTimer);
  }, [timer]);

  return (
    <ProgressBarContext.Provider value={{ progress, isVisible, startProgress, completeProgress }}>
      {children}
    </ProgressBarContext.Provider>
  );
};

export const useProgressBar = (): ProgressBarContextType => {
  const context = useContext(ProgressBarContext);
  if (context === undefined) {
    throw new Error('useProgressBar must be used within a ProgressBarProvider');
  }
  return context;
};
