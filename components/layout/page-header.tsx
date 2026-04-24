'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Optional: override labels for cleaner names
const LABEL_MAP: Record<string, string> = {
  docs: 'Docs',
  sheets: 'Sheets',
  slides: 'Slides',
  forms: 'Forms',
  code: 'Code',
  contracts: 'Contracts',
  requests: 'Requests',
  tasks: 'Tasks',
  team: 'Team',
  workspaces: 'Workspaces',
  'brand-profiles': 'Brand Profiles',
  editor: 'Editor',
};

// Detect dynamic IDs (UUID, numeric, etc.)
const isId = (segment: string) =>
  /^[0-9a-fA-F-]{6,}$/.test(segment);

const formatLabel = (segment: string) => {
  if (LABEL_MAP[segment]) return LABEL_MAP[segment];

  if (isId(segment)) return 'Details';

  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export function PageHeader() {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);

  // Hide breadcrumbs for top-level pages
  if (segments.length <= 1) return null;

  return (
    <div className="flex items-center gap-1 text-[12.5px] text-muted-foreground">
      {segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;

        return (
          <div key={href} className="flex items-center gap-1">
            {!isLast ? (
              <Link
                href={href}
                className="hover:text-foreground transition-colors"
              >
                {formatLabel(segment)}
              </Link>
            ) : (
              <span className="text-foreground font-medium">
                {formatLabel(segment)}
              </span>
            )}

            {!isLast && (
              <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
            )}
          </div>
        );
      })}
    </div>
  );
}