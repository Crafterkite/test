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
    title: 'Workspace',
    desc: 'Organize work into spaces',
  },
];

const recentActivity = [
  {
    icon: Activity,
    title: 'Design request submitted',
    subtitle: 'New branding request created',
    time: 'Just now',
    status: 'Submitted',
  },
  {
    icon: Building2,
    title: 'Brand updated',
    subtitle: 'Logo variants uploaded',
    time: '1 hour ago',
    status: 'Done',
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Zap className="h-3.5 w-3.5" />
            <span className="text-xs uppercase tracking-widest">
              Your Workspace
            </span>
          </div>

          <h1 className="text-xl font-bold text-foreground">
            Welcome back
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Here’s what’s happening in your workspace today.
          </p>
        </div>

        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <div className={cn('p-2 rounded-lg', card.bg)}>
                  <Icon className={cn('h-4 w-4', card.color)} />
                </div>

                {card.trend && (
                  <div className="text-emerald-400 text-xs flex items-center gap-1">
                    {card.trend}
                    <ArrowUpRight className="h-3 w-3" />
                  </div>
                )}
              </div>

              <div className="mt-3">
                <p className="text-xl font-bold">{card.number}</p>
                <p className="text-xs text-muted-foreground">
                  {card.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Activity */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Recent Activity
            </h2>

            <button className="text-xs text-primary flex items-center gap-1">
              View all <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          {recentActivity.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-muted-foreground">
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-sm font-semibold">Quick Actions</h2>

          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                className="w-full flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:bg-accent/30"
              >
                <div className={cn('p-2 rounded-lg', action.iconBg)}>
                  <Icon className={cn('h-4 w-4', action.iconColor)} />
                </div>

                <div className="text-left">
                  <p className="text-sm font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {action.desc}
                  </p>
                </div>
              </button>
            );
          })}

          {/* Weekly summary */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4" />
              This Week
            </h3>

            <p className="text-xs text-muted-foreground">
              Activity summary placeholder — plug your analytics here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}