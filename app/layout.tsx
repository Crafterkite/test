'use client';

import { TopHeader } from '@/components/layout/top-header';
import { PageHeader } from '@/components/layout/page-header';
import { DashboardSidebar } from '@/components/layout/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col">

      {/* 🔝 GLOBAL HEADER (FULL WIDTH) */}
      <TopHeader />

      {/* 🧱 MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <Sidebar />

        {/* Page Content */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* Contextual Header (breadcrumbs, views, etc.) */}
          <PageHeader />

          {/* Page Body */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>

        </main>
      </div>
    </div>
  );
}