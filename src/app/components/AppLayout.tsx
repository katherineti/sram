'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from './landing/Header';
import Footer from './landing/Footer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState('');

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isDashboard = pathname.startsWith('/dashboard');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  if (isAuthPage || isDashboard) {
    return <>{children}</>;
  }
  
  // Pass searchTerm and onSearch to children
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child) && typeof child.type !== 'string') {
      // @ts-ignore - We are intentionally adding props to our components
      return React.cloneElement(child, { searchTerm: searchTerm, onSearchChange: handleSearch });
    }
    return child;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearch={handleSearch} />
      <main className="flex-grow">
        {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
                // @ts-ignore
                return React.cloneElement(child, { searchTerm, onSearchChange: handleSearch });
            }
            return child;
        })}
      </main>
      <Footer />
    </div>
  );
}
