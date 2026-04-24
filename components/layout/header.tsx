'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Search,
  Bell,
  Megaphone,
  Plus,
  Command,
  HelpCircle,
  Settings,
  LogOut,
  User,
  Moon,
  Keyboard,
  BellRing,
  Phone,
  Video,
  Circle,
  ChevronRight,
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

export function DashboardHeader() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const { mutate: logout } = useLogout();

  const userInitials = user
    ? getInitials(`${user.firstName} ${user.lastName}`)
    : 'U';

  const avatarColor = user
    ? stringToColor(user.id || 'u')
    : '#2563eb';

  const segments = pathname.split('/').filter(Boolean);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-md">

      {/* ================= TOP BAR ================= */}
      <div className="flex h-12 items-center justify-between px-4">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="font-semibold text-sm">Workspace</div>
        </div>

        {/* CENTER SEARCH */}
        <div className="flex-1 max-w-md mx-6 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              placeholder="Search..."
              className="h-8 w-full rounded-md border border-border bg-muted pl-8 pr-10 text-sm"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground flex items-center gap-1">
              <Command className="h-3 w-3" /> K
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">

          {/* Create */}
          <button className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm bg-primary text-white">
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

          {/* Announcements (NEW) */}
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
                No system announcements
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
              <DropdownMenuItem>Help Center</DropdownMenuItem>
              <DropdownMenuItem>Tutorials & Articles</DropdownMenuItem>
              <DropdownMenuItem>Search Help</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />

          {/* PROFILE */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-1 flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent">
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

            <DropdownMenuContent align="end" className="w-64">

              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* STATUS */}
              {['Online', 'Away', 'Busy', 'Invisible'].map((status) => (
                <DropdownMenuItem key={status} className="flex gap-2">
                  <Circle className="h-3 w-3" />
                  {status}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              {/* QUICK ACTIONS */}
              <DropdownMenuItem>
                <Phone className="h-3.5 w-3.5 mr-2" />
                Start Call
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Video className="h-3.5 w-3.5 mr-2" />
                Start Video
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings/profile">
                  <User className="h-3.5 w-3.5 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Keyboard className="h-3.5 w-3.5 mr-2" />
                Shortcuts
              </DropdownMenuItem>

              <DropdownMenuItem>
                <BellRing className="h-3.5 w-3.5 mr-2" />
                Notifications
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Moon className="h-3.5 w-3.5 mr-2" />
                Appearance
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => logout()}
                className="text-destructive"
              >
                <LogOut className="h-3.5 w-3.5 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>

      {/* ================= SECOND BAR (BREADCRUMBS) ================= */}
      <div className="flex h-10 items-center px-4 border-t border-border">

        <div className="flex items-center text-sm text-muted-foreground gap-1">
          {segments.map((seg, i) => {
            const href = '/' + segments.slice(0, i + 1).join('/');
            return (
              <React.Fragment key={href}>
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                <Link
                  href={href}
                  className={cn(
                    "hover:text-foreground",
                    isActive(href) && "text-foreground font-medium"
                  )}
                >
                  {seg}
                </Link>
              </React.Fragment>
            );
          })}
        </div>

      </div>
    </div>
  );
}