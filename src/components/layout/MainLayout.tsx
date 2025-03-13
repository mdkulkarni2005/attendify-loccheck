
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="h-screen w-full flex overflow-hidden bg-muted/20">
      {!isMobile && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
        <footer className="py-4 px-6 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Attendance Management System
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
