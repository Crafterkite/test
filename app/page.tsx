'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

export default function RootPage() {
  const router = useRouter();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;

    // Prevent unnecessary redirects
    if (isAuthenticated) {
      router.replace('/');
    } else {
      router.replace('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  // Loading UI while Zustand (or auth state) hydrates
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        <p className="text-sm text-muted-foreground">
          Loading Crafterkite...
        </p>
      </div>
    </div>
  );
}