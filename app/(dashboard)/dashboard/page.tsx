'use client';

import React from 'react';
import {
  ArrowUpRight,
  Users,
  FolderOpen,
  Building2,
  Layers,
  Activity,
  Plus,
  ChevronRight,
  Bell,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// ─── Data ────────────────────────────────────────────────────────────────────

const statCards = [
  {
    icon: FolderOpen,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    number: '12',
    label: 'Active Requests',
    trend: '+3',
  },
  {
    icon: Building2,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    number: '3',
    label: 'Brand Profiles',
    trend: '+1',
  },
  {
    icon: Users,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    number: '8',
    label: 'Team Members',
    trend: '+2',
  },
  {
    icon: Layers,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    number: '4',
    label: 'Workspaces',
    trend: '',
  },
];

const recentActivity = [
  {
    icon: FolderOpen,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-400/10',
    title: 'New brand guidelines request',
    subtitle: 'Sarah created a new design request',
    time: '22 minutes ago',
    status: 'Submitted',
    statusColor: 'bg-yellow-500/10 text-yellow-400',
  },
  {
    icon: Building2,
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-400/10',
    title: 'Logo variants uploaded',
    subtitle: '5 new logo files added to Bloom Studio',
    time: '50 minutes ago',
    status: 'Done',
    statusColor: 'bg-emerald-500/10 text-emerald-400',
  },
  {
    icon: FolderOpen,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-400/10',
    title: 'Q4 campaign assets delivered',
    subtitle: 'All deliverables approved by client',
    time: '2 hours ago',
    status: 'Done',
    statusColor: 'bg-emerald-500/10 text-emerald-400',
  },
  {
    icon: Activity,
    iconColor: 'text-orange-400',
    iconBg: 'bg-orange-400/10',
    title: 'Social media pack needs revision',
    subtitle: 'Client requested minor typography changes',
    time: '5 hours ago',
    status: 'Revision',
    statusColor: 'bg-orange-500/10 text-orange-400',
  },
  {
    icon: Users,
    iconColor: 'text-sky-400',
    iconBg: 'bg-sky-400/10',
    title: 'New member joined',
    subtitle: 'Aria Johnson joined your workspace',
    time: '1 day ago',
    status: 'Submitted',
    statusColor: 'bg-yellow-500/10 text-yellow-400',
  },
];

const quickActions = [
  {
    icon: FolderOpen,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-400/10',
    title: 'New Request',
    desc: 'Submit a creative request to the team',
  },
  {
    icon: Building2,
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-400/10',
    title: 'Brand Profile',
    desc: 'Create a new brand identity profile',
  },
  {
    icon: Users,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-400/10',
    title: 'Invite Member',
    desc: 'Add someone to your organization',
  },
  {
    icon: Layers,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-400/10',
    title: 'New Workspace',
    desc: 'Organize work into dedicated spaces',
  },
];

const weekStats = [
  { label: 'Requests completed', value: '5/8', percent: 62.5, color: 'bg-emerald-500' },
  { label: 'In revision',        value: '2/8', percent: 25,   color: 'bg-amber-500'   },
  { label: 'Assets uploaded',    value: '23/50', percent: 46, color: 'bg-blue-500'    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OverviewPage() {
  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Zap className="h-3.5 w-3.5" />
            <span className="uppercase text-xs tracking-[2px] font-medium">Your Workspace</span>
          </div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Good afternoon, there</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Here's what's happening with your creative operations today.
          </p>
        </div>
        <Button size="sm" className="gap-2 self-start sm:self-auto">
          <Plus className="h-3.5 w-3.5" />
          New Request
        </Button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="rounded-xl border border-border bg-card px-4 py-4">
              <div className="flex items-start justify-between">
                <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', card.bg)}>
                  <Icon className={cn('h-4 w-4', card.color)} />
                </div>
                {card.trend && (
                  <div className="flex items-center gap-0.5 text-emerald-400 text-xs font-medium">
                    {card.trend}
                    <ArrowUpRight className="h-3 w-3" />
                  </div>
                )}
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-foreground tracking-tight">{card.number}</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

       
        {/* Right column */}
        <div className="lg:col-span-5 space-y-5">

          {/* Quick Actions */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-3.5 w-3.5 text-muted-foreground" />
              <h2 className="text-[15px] font-semibold">Quick Actions</h2>
            </div>
            <div className="space-y-2">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <button
                    key={i}
                    className="group flex w-full items-center gap-3.5 rounded-xl border border-border bg-card px-4 py-3 hover:bg-accent/30 hover:border-border/80 transition-all text-left"
                  >
                    <div className={cn('flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg', action.iconBg)}>
                      <Icon className={cn('h-3.5 w-3.5', action.iconColor)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-medium text-foreground">{action.title}</p>
                      <p className="text-[12px] text-muted-foreground mt-0.5">{action.desc}</p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* This Week */}
          <div className="rounded-xl border border-border bg-card px-5 py-4">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
              <h3 className="text-[15px] font-semibold">This Week</h3>
            </div>
            <div className="space-y-4">
              {weekStats.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[12.5px] text-muted-foreground">{item.label}</span>
                    <span className="text-[12.5px] font-semibold text-foreground">{item.value}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', item.color)}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
