'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, ChevronDown, Settings, LogOut, User } from 'lucide-react';
import { cn, getInitials, stringToColor } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Overview',
  '/requests': 'Requests',
  '/brand': 'Brand',
  '/team': 'Team',
  '/workspaces': 'Workspaces',
  '/settings': 'Settings',
};

function getPageTitle(pathname: string): string {
  // Direct match first
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];

  // Prefix match
  for (const [path, title] of Object.entries(PAGE_TITLES)) {
    if (pathname.startsWith(path) && path !== '/dashboard') {
      return title;
    }
  }

  return 'Crafterkite';
}

interface Notification {
  id: string;
  message: string;
  time: string;
  unread: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', message: 'New request submitted by John', time: '2m ago', unread: true },
  { id: '2', message: 'Brand asset uploaded successfully', time: '1h ago', unread: true },
  { id: '3', message: 'Team member invited: jane@example.com', time: '3h ago', unread: false },
];

export function DashboardHeader() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const { mutate: logout } = useLogout();
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const pageTitle = getPageTitle(pathname);
  const userInitials = user ? getInitials(user.firstName, user.lastName) : 'CK';
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchEl = document.getElementById('global-search');
        if (searchEl) searchEl.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-sm">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold text-foreground">{pageTitle}</h1>
      </div>

      {/* Right side: Search + Notifications + User */}
      <div className="flex items-center gap-2">
        {/* Search Bar */}
        <div
          className={cn(
            'relative hidden sm:flex items-center gap-2 rounded-md border px-3 h-8 w-48 lg:w-64 transition-all duration-200',
            searchFocused
              ? 'border-primary/50 bg-background w-64 lg:w-80'
              : 'border-border bg-muted/30 hover:border-border/80'
          )}
        >
          <Search className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
          <input
            id="global-search"
            type="text"
            placeholder="Search..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd
            className={cn(
              'hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground transition-opacity duration-200',
              searchFocused ? 'opacity-0' : 'opacity-100'
            )}
          >
            <span>⌘</span>
            <span>K</span>
          </kbd>
        </div>

        {/* Notifications */}
        <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="relative text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80" sideOffset={8}>
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  {unreadCount} new
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {MOCK_NOTIFICATIONS.map((notif) => (
              <DropdownMenuItem
                key={notif.id}
                className="flex items-start gap-2 py-3"
              >
                <div
                  className={cn(
                    'mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full',
                    notif.unread ? 'bg-primary' : 'bg-transparent'
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm', notif.unread && 'font-medium')}>
                    {notif.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {notif.time}
                  </p>
                </div>
              </DropdownMenuItem>
            ))}
            {MOCK_NOTIFICATIONS.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-xs text-muted-foreground hover:text-foreground">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar + Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-muted/50 focus:outline-none">
              <Avatar className="h-7 w-7">
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
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
            <div className="flex flex-col gap-0.5 px-2 py-2">
              <p className="text-sm font-medium">
                {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email ?? ''}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="flex items-center gap-2 text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
