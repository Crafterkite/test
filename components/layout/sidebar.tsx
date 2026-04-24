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

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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

function SidebarContent({
  collapsed,
  setCollapsed,
  onClose,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const orgs = useOrgStore((s) => s.orgs);
  const setCurrentOrg = useOrgStore((s) => s.setCurrentOrg);
  const { mutate: logout } = useLogout();

  const [hovered, setHovered] = useState(false);
  const isExpanded = !collapsed || hovered;

  const userInitials = user ? getInitials(`${user.firstName} ${user.lastName}`) : 'CK';
  const orgInitials = currentOrg ? getInitials(currentOrg.name) : 'CK';
  const orgColor = currentOrg ? stringToColor(currentOrg.id) : '#2563eb';

  return (
    <div
      className="flex h-full flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-4 pb-3">
        <div className={cn('flex items-center', isExpanded ? 'gap-2.5' : 'justify-center w-full')}>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15">
            <Wind className="h-3.5 w-3.5 text-primary" />
          </div>

          {isExpanded && (
            <span className="text-[13px] font-bold tracking-tight text-foreground">
              Crafterkite
            </span>
          )}
        </div>

        {/* Collapse toggle */}
        {isExpanded && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-md p-1 text-muted-foreground hover:bg-white/5 hover:text-foreground transition"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}

        {/* Mobile close */}
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-white/5 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Org selector */}
      {!collapsed && (
        <div className="px-3 pb-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-white/[0.06] border border-white/[0.04]">
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold text-white"
                  style={{ backgroundColor: orgColor }}
                >
                  {orgInitials}
                </div>
                <div className="flex-1 text-left">
                  <p className="truncate text-[12.5px] font-semibold">
                    {currentOrg?.name ?? 'Select workspace'}
                  </p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[220px]">
              {orgs.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => setCurrentOrg(org)}
                >
                  {org.name}
                  {currentOrg?.id === org.id && <Check className="ml-auto h-3.5 w-3.5" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-1">
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            const link = (
              <Link
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group flex items-center rounded-lg text-[13px] font-medium transition-all',
                  isExpanded ? 'gap-2.5 px-2.5 py-[7px]' : 'justify-center px-0 py-2',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {isExpanded && <span>{item.label}</span>}
              </Link>
            );

            return collapsed ? (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ) : (
              <div key={item.href}>{link}</div>
            );
          })}
        </div>
      </nav>

      {/* Notifications */}
      <div className="px-2 pb-2">
        <button className={cn(
          'flex w-full items-center rounded-lg text-[13px]',
          isExpanded ? 'gap-2.5 px-2.5 py-[7px]' : 'justify-center py-2'
        )}>
          <Bell className="h-4 w-4" />
          {isExpanded && <span>Notifications</span>}
        </button>
      </div>

      {/* User */}
      <div className="border-t border-border/50 px-2 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn(
              'flex w-full items-center rounded-lg',
              isExpanded ? 'gap-2.5 px-2.5 py-2' : 'justify-center'
            )}>
              <Avatar className="h-7 w-7">
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>

              {isExpanded && (
                <div className="flex-1 text-left">
                  <p className="text-[12px] font-semibold">
                    {user?.firstName}
                  </p>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => logout()}>
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
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved) setCollapsed(saved === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-[280px] bg-card transition-transform lg:hidden',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <SidebarContent
          collapsed={false}
          setCollapsed={() => {}}
          onClose={() => setMobileOpen(false)}
        />
      </aside>

      {/* Desktop */}
      <aside className={cn(
        'hidden lg:flex flex-col border-r transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-[280px]'
      )}>
        <SidebarContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </aside>
    </>
  );
}