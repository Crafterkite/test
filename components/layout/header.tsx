'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Bell,
  Plus,
  Command,
  FolderOpen,
  Building2,
  Users,
  Layers,
  Settings,
  LogOut,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/hooks/use-auth';
import { cn, getInitials, stringToColor } from '@/lib/utils';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/requests': 'Requests',
  '/dashboard/brand-profiles': 'Brand Profiles',
  '/dashboard/team': 'Team',
  '/dashboard/workspaces': 'Workspaces',
  '/dashboard/settings': 'Settings',
};

const QUICK_ACTIONS = [
  {
    icon: FolderOpen,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-400/10',
    label: 'New Request',
    desc: 'Submit a creative request',
    href: '/dashboard/requests/new',
  },
  {
    icon: Building2,
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-400/10',
    label: 'Brand Profile',
    desc: 'Create a brand identity',
    href: '/dashboard/brand-profiles/new',
  },
  {
    icon: Users,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-400/10',
    label: 'Invite Member',
    desc: 'Add someone to your org',
    href: '/dashboard/team/invite',
  },
  {
    icon: Layers,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-400/10',
    label: 'New Workspace',
    desc: 'Organize into spaces',
    href: '/dashboard/workspaces/new',
  },
];

export function DashboardHeader() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const { mutate: logout } = useLogout();

  const pageTitle = PAGE_TITLES[pathname] || 'Dashboard';
  const unreadCount = 2;

  const userInitials = user ? getInitials(`${user.firstName} ${user.lastName}`) : 'CK';
  const avatarColor = user ? stringToColor(user.id || 'ck') : '#2563eb';

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-card/95 backdrop-blur-md px-6">

      {/* Left: Page Title */}
      <h1 className="text-xl font-bold tracking-tight text-foreground">
        {pageTitle}
      </h1>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-8 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search requests, assets, people..."
            className="h-9 w-full rounded-lg border border-border bg-muted pl-9 pr-14 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[11px] text-muted-foreground/60 pointer-events-none">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </div>
      </div>

            {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Quick Actions (kept your beautiful version) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none">
              <Plus className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-1.5" sideOffset={8}>
            <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Quick Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <DropdownMenuItem key={action.label} asChild>
                  <Link
                    href={action.href}
                    className="flex items-center gap-3 rounded-md px-2 py-2.5 cursor-pointer"
                  >
                    <div className={cn('flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg', action.iconBg)}>
                      <Icon className={cn('h-3.5 w-3.5', action.iconColor)} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-foreground leading-tight">{action.label}</p>
                      <p className="text-[11.5px] text-muted-foreground mt-0.5">{action.desc}</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80" sideOffset={8}>
            <DropdownMenuLabel className="text-[13px]">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <p className="px-4 py-6 text-center text-[13px] text-muted-foreground">
              No new notifications
            </p>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Settings Icon */}
        <Link href="/dashboard/settings">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none">
            <Settings className="h-4 w-4" />
          </button>
        </Link>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-accent focus:outline-none">
              <Avatar className="h-7 w-7">
                {user?.avatarUrl && <AvatarImage src={user.avatarUrl} />}
                <AvatarFallback
                  className="text-[10px] font-bold text-white"
                  style={{ backgroundColor: avatarColor }}
                >
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
            <DropdownMenuLabel className="pb-2">
              <p className="text-[13px] font-semibold text-foreground">
                {user ? `${user.firstName} ${user.lastName}` : 'Account'}
              </p>
              <p className="text-[11.5px] text-muted-foreground font-normal mt-0.5">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-2 cursor-pointer">
                <Settings className="h-3.5 w-3.5" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>