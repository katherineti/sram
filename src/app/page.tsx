'use client';

import AboutUs from '@/app/components/landing/AboutUs';
import SearchSection from '@/app/components/landing/SearchSection';
import EventsAndCompetitions from '@/app/components/landing/EventsAndCompetitions';
import TopWinners from './components/landing/TopWinners';
import AppLayout from './components/AppLayout';

export default function Home() {
  return (
    <AppLayout>
      <EventsAndCompetitions />
      <AboutUs />
      <TopWinners />
      <SearchSection />
    </AppLayout>
  );
}
