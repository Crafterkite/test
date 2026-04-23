'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { DashboardSidebar } from '@/components/layout/sidebar';
import { DashboardHeader } from '@/components/layout/header';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const isEditor = pathname.startsWith('/dashboard/docs/editor');

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        <DashboardSidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />

          <main className="flex-1 overflow-y-auto">
            {isEditor ? (
              children 
            ) : (
              <div className="mx-auto max-w-7xl px-6 py-8">
                {children}
              </div>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}