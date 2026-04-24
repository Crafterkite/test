'use client';

import Link from 'next/link';
import {
  Search,
  Bell,
  Megaphone,
  Plus,
  HelpCircle,
} from 'lucide-react';

import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ProfileMenu } from './profile-menu';

export function TopHeader() {
  return (
    <header className="h-12 flex items-center justify-between px-4 border-b border-border bg-card">

      {/* LEFT */}
      <div className="font-semibold text-sm">
        Crafterkite
      </div>

      {/* CENTER SEARCH */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            placeholder="Search..."
            className="h-8 w-full rounded-md border border-border bg-muted pl-8 pr-3 text-sm"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">

        {/* Create */}
        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-primary text-white text-sm">
          <Plus className="h-3.5 w-3.5" />
          New
        </button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent">
              <Bell className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <p className="p-4 text-sm text-muted-foreground text-center">
              No new notifications
            </p>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Announcements */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent">
              <Megaphone className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Announcements</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <p className="p-4 text-sm text-muted-foreground text-center">
              No announcements
            </p>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Help */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent">
              <HelpCircle className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Help</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-2 text-sm space-y-2">
              <p>Helpdesk</p>
              <p>Tutorials / Articles</p>
              <p>Search Help</p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />

        <ProfileMenu />
      </div>
    </header>
  );
}