'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Palette, Users, Grid3x3 as Grid3X3, Settings, ChevronDown, Check, LogOut, Wind, Plus } from 'lucide-react';
import { cn, getInitials, stringToColor } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { useOrgStore } from '@/store/org.store';
import { useLogout } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Requests', href: '/requests', icon: FileText },
  { label: 'Brand', href: '/brand', icon: Palette },
  { label: 'Team', href: '/team', icon: Users },
  { label: 'Workspaces', href: '/workspaces', icon: Grid3X3 },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const orgs = useOrgStore((s) => s.orgs);
  const setCurrentOrg = useOrgStore((s) => s.setCurrentOrg);
  const { mutate: logout } = useLogout();

  const userInitials = user
    ? getInitials(user.firstName, user.lastName)
    : 'CK';

  const orgInitials = currentOrg
    ? getInitials(currentOrg.name)
    : 'CK';

  const orgColor = currentOrg ? stringToColor(currentOrg.id) : '#2563eb';

  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 flex w-[240px] flex-col border-r border-[#1e1e2e]"
      style={{ backgroundColor: '#0d0d14' }}
    >
      {/* Logo + Org Selector */}
      <div className="flex flex-col gap-1 px-3 pt-4 pb-2">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 px-2 py-1.5 mb-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Wind className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Crafterkite
          </span>
        </div>

        {/* Org Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left transition-colors hover:bg-white/5 focus:outline-none group">
              <div
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white"
                style={{ backgroundColor: orgColor }}
              >
                {orgInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {currentOrg?.name ?? 'Select workspace'}
                </p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180 flex-shrink-0" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            side="bottom"
            className="w-[220px]"
            sideOffset={4}
          >
            <DropdownMenuLabel>Organizations</DropdownMenuLabel>
            {orgs.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => setCurrentOrg(org)}
                className="flex items-center gap-2"
              >
                <div
                  className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-[9px] font-bold text-white"
                  style={{ backgroundColor: stringToColor(org.id) }}
                >
                  {getInitials(org.name)}
                </div>
                <span className="flex-1 truncate text-sm">{org.name}</span>
                {currentOrg?.id === org.id && (
                  <Check className="h-3.5 w-3.5 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
            {orgs.length === 0 && (
              <DropdownMenuItem disabled className="text-muted-foreground text-sm">
                No organizations
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2" asChild>
              <Link href="/onboarding/create-org">
                <Plus className="h-3.5 w-3.5" />
                <span>New organization</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-all duration-150',
                  'hover:bg-white/5',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 flex-shrink-0',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary/20 px-1 text-[10px] font-semibold text-primary">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom: User profile + logout */}
      <div className="border-t border-[#1e1e2e] px-3 py-3">
        <div className="flex items-center gap-2.5 rounded-md px-2 py-2">
          <Avatar className="h-7 w-7 flex-shrink-0">
            {user?.avatarUrl && (
              <AvatarImage src={user.avatarUrl} alt={user.firstName} />
            )}
            <AvatarFallback
              className="text-[10px] font-semibold text-white"
              style={{ backgroundColor: user ? stringToColor(user.id) : '#2563eb' }}
            >
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-foreground leading-none">
              {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
            </p>
            <p className="truncate text-xs text-muted-foreground mt-0.5">
              {user?.email ?? ''}
            </p>
          </div>
          <button
            onClick={() => logout()}
            className="flex-shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
