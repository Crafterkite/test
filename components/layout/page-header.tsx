'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const BASE_ROUTES = [
  '/dashboard',
  '/dashboard/requests',
  '/dashboard/brand-profiles',
  '/dashboard/team',
  '/dashboard/workspaces',
];

export function PageHeader() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const show =
    !BASE_ROUTES.includes(pathname) && segments.length > 2;

  if (!show) return null;

  return (
    <div className="h-10 flex items-center px-4 border-b border-border bg-muted/30">
      <div className="flex items-center text-sm text-muted-foreground gap-1">

        {segments.slice(1).map((seg, i) => {
          const href = '/' + segments.slice(0, i + 2).join('/');

          return (
            <div key={href} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3" />}

              <Link
                href={href}
                className={cn(
                  "capitalize hover:text-foreground",
                  pathname === href && "text-foreground font-medium"
                )}
              >
                {seg.replace('-', ' ')}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}