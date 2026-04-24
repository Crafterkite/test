'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileStack,
  Palette,
  Users,
  Settings,
  ChevronDown,
  Check,
  LogOut,
  Wind,
  Plus,
  X,
  Menu,
  Layers,
  Bell,
  MessageSquare,
  Bot,
  FileText,
  CheckSquare,
} from 'lucide-react';
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
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'Requests', href: '/dashboard/requests', icon: FileStack },
  { label: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
  { label: 'Brand Profiles', href: '/dashboard/brand-profiles', icon: Palette },
  { label: 'Team', href: '/dashboard/team', icon: Users },
  { label: 'Workspaces', href: '/dashboard/workspaces', icon: Layers },
  { label: 'Chat', href: '/dashboard/chat', icon: MessageSquare },
  { label: 'AI Agents', href: '/dashboard/agents', icon: Bot },
  { label: 'Docs', href: '/dashboard/docs', icon: FileText },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const orgs = useOrgStore((s) => s.orgs);
  const setCurrentOrg = useOrgStore((s) => s.setCurrentOrg);
  const { mutate: logout } = useLogout();

  const userInitials = user ? getInitials(`${user.firstName} ${user.lastName}`) : 'CK';
  const orgInitials = currentOrg ? getInitials(currentOrg.name) : 'CK';
  const orgColor = currentOrg ? stringToColor(currentOrg.id) : '#2563eb';

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15">
            <Wind className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-[13px] font-bold tracking-tight text-foreground">
            Crafterkite
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Org Selector */}
      <div className="px-3 pb-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all hover:bg-white/[0.06] focus:outline-none group border border-white/[0.04] hover:border-white/[0.08]">
              <div
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white shadow-sm"
                style={{ backgroundColor: orgColor }}
              >
                {orgInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-[12.5px] font-semibold text-foreground leading-tight">
                  {currentOrg?.name ?? 'Select workspace'}
                </p>
                <p className="text-[10.5px] text-muted-foreground leading-tight mt-0.5">
                  Organization
                </p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 flex-shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="bottom" className="w-[220px]" sideOffset={4}>
            <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Organizations
            </DropdownMenuLabel>
            {orgs.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => setCurrentOrg(org)}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <div
                  className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-[9px] font-bold text-white"
                  style={{ backgroundColor: stringToColor(org.id) }}
                >
                  {getInitials(org.name)}
                </div>
                <span className="flex-1 truncate text-sm">{org.name}</span>
                {currentOrg?.id === org.id && <Check className="h-3.5 w-3.5 text-primary" />}
              </DropdownMenuItem>
            ))}
            {orgs.length === 0 && (
              <DropdownMenuItem disabled className="text-muted-foreground text-sm">
                No organizations
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/onboarding/create-org" onClick={onClose} className="flex items-center gap-2 cursor-pointer">
                <Plus className="h-3.5 w-3.5" />
                <span>New organization</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Nav label */}
      <div className="px-5 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Menu
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-1">
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary/[0.12] text-primary'
                    : 'text-muted-foreground hover:bg-white/[0.05] hover:text-foreground'
                )}
              >
                <Icon
                  className={cn(
                    'h-[15px] w-[15px] flex-shrink-0 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground/70 group-hover:text-foreground'
                  )}
                />
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Notifications */}
      <div className="px-3 pb-2">
        <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] font-medium text-muted-foreground transition-all hover:bg-white/[0.05] hover:text-foreground">
          <Bell className="h-[15px] w-[15px]" />
          <span>Notifications</span>
          <span className="ml-auto flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-500/20 px-1 text-[10px] font-semibold text-blue-400">
            3
          </span>
        </button>
      </div>

      {/* User profile */}
      <div className="border-t border-border/50 px-3 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all hover:bg-white/[0.05] focus:outline-none group">
              <Avatar className="h-7 w-7 flex-shrink-0">
                {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.firstName} />}
                <AvatarFallback
                  className="text-[10px] font-bold text-white"
                  style={{ backgroundColor: user ? stringToColor(user.id) : '#2563eb' }}
                >
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <p className="truncate text-[12.5px] font-semibold text-foreground leading-tight">
                  {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
                </p>
                <p className="truncate text-[11px] text-muted-foreground mt-0.5 leading-tight">
                  {user?.email ?? ''}
                </p>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground flex-shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-[200px] mb-1">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="cursor-pointer">
                <Settings className="mr-2 h-3.5 w-3.5" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function DashboardSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg border border-border bg-card p-2 text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[280px] border-r border-border/60 bg-[hsl(var(--sidebar))] transition-transform duration-300 ease-in-out lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

       {/* Desktop sidebar */}
    <aside className="hidden w-[280px] flex-col border-r border-border/60 bg-[hsl(var(--sidebar))] lg:flex shrink-0">
      <SidebarContent />
    </aside>
    </>
  );
}