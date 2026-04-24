'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

import { DashboardSidebar } from '@/components/layout/sidebar';
import { TopHeader } from '@/components/layout/top-header';
import { PageHeader } from '@/components/layout/page-header';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEditor = pathname.startsWith('/dashboard/docs/editor');

  return (
    <AuthGuard>
      <div className="flex h-screen flex-col bg-background">

        {/* FULL WIDTH HEADER */}
        <TopHeader />

        {/* MAIN AREA */}
        <div className="flex flex-1 overflow-hidden">

          {/* Sidebar */}
          <DashboardSidebar />

          {/* Content */}
          <div className="flex flex-1 flex-col overflow-hidden">

            {/* Conditional page header */}
            {!isEditor && <PageHeader />}

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
      </div>
    </AuthGuard>
  );
}