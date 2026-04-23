'use client';

import React from 'react';
import { FileText, Palette, Users, Grid3x3 as Grid3X3, TrendingUp, ArrowRight, Plus, Clock, CircleCheck as CheckCircle2, CircleAlert as AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { useCurrentOrg } from '@/store/org.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, formatRelativeTime } from '@/lib/utils';

// Stat card data
const STATS = [
  {
    label: 'Active Requests',
    value: 12,
    change: { value: 3, direction: 'up' as const },
    icon: FileText,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    label: 'Brand Assets',
    value: 248,
    change: { value: 18, direction: 'up' as const },
    icon: Palette,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  {
    label: 'Team Members',
    value: 8,
    change: { value: 1, direction: 'up' as const },
    icon: Users,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  {
    label: 'Workspaces',
    value: 4,
    change: { value: 0, direction: 'neutral' as const },
    icon: Grid3X3,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
  },
];

// Recent activity mock data
const RECENT_ACTIVITY = [
  {
    id: '1',
    type: 'request_created',
    title: 'New brand guidelines request',
    description: 'Sarah created a new design request',
    time: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    status: 'submitted',
    icon: FileText,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
  },
  {
    id: '2',
    type: 'asset_uploaded',
    title: 'Logo variants uploaded',
    description: '5 new logo files added to Brand library',
    time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: 'completed',
    icon: Palette,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
  },
  {
    id: '3',
    type: 'request_completed',
    title: 'Q4 campaign assets ready',
    description: 'All deliverables approved by client',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    icon: CheckCircle2,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
  },
  {
    id: '4',
    type: 'request_revision',
    title: 'Social media pack revision',
    description: 'Client requested minor changes',
    time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: 'revision',
    icon: AlertCircle,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
  },
];

// Quick actions
const QUICK_ACTIONS = [
  {
    label: 'New Request',
    description: 'Submit a creative request',
    href: '/requests',
    icon: FileText,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 hover:bg-blue-500/20',
  },
  {
    label: 'Upload Asset',
    description: 'Add to brand library',
    href: '/brand',
    icon: Palette,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 hover:bg-emerald-500/20',
  },
  {
    label: 'Invite Member',
    description: 'Grow your team',
    href: '/team',
    icon: Users,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10 hover:bg-amber-500/20',
  },
  {
    label: 'New Workspace',
    description: 'Organize your projects',
    href: '/workspaces',
    icon: Grid3X3,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10 hover:bg-rose-500/20',
  },
];

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: 'default' | 'success' | 'warning' | 'info' | 'muted' }
> = {
  submitted: { label: 'Submitted', variant: 'info' },
  in_progress: { label: 'In Progress', variant: 'default' },
  completed: { label: 'Completed', variant: 'success' },
  revision: { label: 'Revision', variant: 'warning' },
};

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const currentOrg = useCurrentOrg();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {greeting()}, {user?.firstName ?? 'there'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {currentOrg
              ? `Here's what's happening at ${currentOrg.name}`
              : "Here's an overview of your workspace"}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-3 sm:mt-0">
          <Button variant="outline" size="sm" asChild>
            <Link href="/requests">
              View all requests
            </Link>
          </Button>
          <Button size="sm" className="gap-1.5" asChild>
            <Link href="/requests">
              <Plus className="h-3.5 w-3.5" />
              New request
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="card-hover border-border bg-card"
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg',
                      stat.bgColor
                    )}
                  >
                    <Icon className={cn('h-4.5 w-4.5', stat.color)} />
                  </div>
                  {stat.change.direction !== 'neutral' && (
                    <div
                      className={cn(
                        'flex items-center gap-0.5 text-xs font-medium',
                        stat.change.direction === 'up'
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      )}
                    >
                      <TrendingUp
                        className={cn(
                          'h-3 w-3',
                          stat.change.direction === 'down' && 'rotate-180'
                        )}
                      />
                      <span>+{stat.change.value}</span>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold tabular-nums text-foreground">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main grid: Activity + Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold">
                Recent Activity
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link href="/requests">
                  View all
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-1">
                {RECENT_ACTIVITY.map((activity, index) => {
                  const Icon = activity.icon;
                  const statusConfig = STATUS_CONFIG[activity.status];

                  return (
                    <div
                      key={activity.id}
                      className={cn(
                        'flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/30',
                        index < RECENT_ACTIVITY.length - 1 && ''
                      )}
                    >
                      <div
                        className={cn(
                          'mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg',
                          activity.iconBg
                        )}
                      >
                        <Icon className={cn('h-3.5 w-3.5', activity.iconColor)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium truncate text-foreground">
                            {activity.title}
                          </p>
                          {statusConfig && (
                            <Badge
                              variant={statusConfig.variant}
                              className="flex-shrink-0 text-[10px] h-4 px-1.5"
                            >
                              {statusConfig.label}
                            </Badge>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground truncate">
                          {activity.description}
                        </p>
                        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground/60">
                          <Clock className="h-2.5 w-2.5" />
                          <span>{formatRelativeTime(activity.time)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-2">
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg p-3 transition-all duration-150',
                        action.bgColor
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg',
                          action.bgColor.split(' ')[0]
                        )}
                      >
                        <Icon className={cn('h-4 w-4', action.color)} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {action.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upgrade card (for free plan) */}
          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <h4 className="text-sm font-semibold text-foreground">
              Upgrade to Pro
            </h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Unlock unlimited requests, advanced analytics, and priority
              support.
            </p>
            <Button
              size="sm"
              className="mt-3 w-full h-8 text-xs"
              variant="outline"
            >
              View plans
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
