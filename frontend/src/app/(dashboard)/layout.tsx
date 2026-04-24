import React from 'react';
import { DashboardSidebar } from '@/components/layout/sidebar';
import { TopHeader } from '@/components/layout/top-header';
import { PageHeader } from '@/components/layout/page-header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Fixed Sidebar */}
      <DashboardSidebar />

      {/* Main content area - offset by sidebar width */}
      <div className="flex flex-1 flex-col pl-[240px]">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
