'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, RefreshCw, Archive, Activity, CalendarDays, User, Building2, Layers, Zap, CreditCard as Edit3, MoveHorizontal as MoreHorizontal, ChevronRight } from 'lucide-react';
import { cn, formatDate, formatRelativeTime, getInitials, stringToColor } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Request, RequestStatus, RequestType, TurnaroundTier } from '@/types';
import { MOCK_REQUESTS, STATUS_LABELS, TYPE_LABELS, TIER_LABELS } from '@/lib/mock-requests';

const STATUS_CONFIG: Record<RequestStatus, { icon: React.ElementType; bg: string; text: string; border: string }> = {
  DRAFT: { icon: Clock, bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' },
  SUBMITTED: { icon: Clock, bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  ACTIVE: { icon: Activity, bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  IN_PROGRESS: { icon: RefreshCw, bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20' },
  IN_REVISION: { icon: AlertCircle, bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  COMPLETED: { icon: CheckCircle2, bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  ARCHIVED: { icon: Archive, bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border' },
};

const TYPE_CONFIG: Record<RequestType, { color: string; bg: string }> = {
  DESIGN: { color: 'text-blue-400', bg: 'bg-blue-500/10' },
  MOTION: { color: 'text-violet-400', bg: 'bg-violet-500/10' },
  COPY: { color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  STRATEGY: { color: 'text-amber-400', bg: 'bg-amber-500/10' },
  DEVELOPMENT: { color: 'text-rose-400', bg: 'bg-rose-500/10' },
};

const TIER_COLORS: Record<TurnaroundTier, string> = {
  STANDARD: 'text-muted-foreground',
  RUSH: 'text-amber-400',
  PRIORITY: 'text-rose-400',
};

const STATUS_FLOW: RequestStatus[] = ['DRAFT', 'SUBMITTED', 'ACTIVE', 'IN_PROGRESS', 'IN_REVISION', 'COMPLETED'];

function MetaRow({ icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  const Icon = icon;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-muted/60 mt-0.5">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
        <div className="text-[13px] text-foreground">{children}</div>
      </div>
    </div>
  );
}

function AssigneeAvatar({ user }: { user: { firstName: string; lastName: string; avatarUrl?: string | null } }) {
  const initials = getInitials(user.firstName, user.lastName);
  const color = stringToColor(`${user.firstName}${user.lastName}`);
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>
      <span>{user.firstName} {user.lastName}</span>
    </div>
  );
}

function StatusProgress({ status }: { status: RequestStatus }) {
  const currentIndex = STATUS_FLOW.indexOf(status);
  if (status === 'ARCHIVED') return null;

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Progress</p>
      <div className="flex items-center gap-0">
        {STATUS_FLOW.map((s, i) => {
          const isDone = i < currentIndex;
          const isCurrent = i === currentIndex;
          const cfg = STATUS_CONFIG[s];
          const Icon = cfg.icon;

          return (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full border transition-all',
                    isDone ? 'bg-primary border-primary' : isCurrent ? cn(cfg.bg, cfg.border, 'border') : 'bg-muted/30 border-border'
                  )}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                  ) : (
                    <Icon className={cn('h-3.5 w-3.5', isCurrent ? cfg.text : 'text-muted-foreground/40')} />
                  )}
                </div>
                <p className={cn('text-[9px] font-medium text-center w-14 leading-tight', isCurrent ? 'text-foreground' : isDone ? 'text-primary' : 'text-muted-foreground/50')}>
                  {STATUS_LABELS[s]}
                </p>
              </div>
              {i < STATUS_FLOW.length - 1 && (
                <div className={cn('h-px flex-1 mb-4 mx-0.5 transition-colors', isDone ? 'bg-primary' : 'bg-border')} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const request = MOCK_REQUESTS.find((r) => r.id === requestId);

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50">
          <Archive className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="mb-1.5 text-[15px] font-semibold text-foreground">Request not found</h3>
        <p className="mb-6 text-sm text-muted-foreground">This request may have been archived or deleted.</p>
        <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-3.5 w-3.5" />
          Go back
        </Button>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[request.status];
  const typeCfg = TYPE_CONFIG[request.type];
  const StatusIcon = statusCfg.icon;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
        <button onClick={() => router.push('/requests')} className="hover:text-foreground transition-colors">
          Requests
        </button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium truncate max-w-xs">{request.title}</span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <button
            onClick={() => router.push('/requests')}
            className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">{request.title}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold', statusCfg.bg, statusCfg.text)}>
                <StatusIcon className="h-3 w-3" />
                {STATUS_LABELS[request.status]}
              </span>
              <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold', typeCfg.bg, typeCfg.color)}>
                {TYPE_LABELS[request.type]}
              </span>
              <span className={cn('text-[11.5px] font-medium', TIER_COLORS[request.turnaroundTier])}>
                {TIER_LABELS[request.turnaroundTier]} turnaround
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start">
          <Button variant="outline" size="sm" className="gap-2">
            <Edit3 className="h-3.5 w-3.5" />
            Edit
          </Button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:text-foreground hover:bg-accent">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-xl border border-border bg-card p-5">
            <StatusProgress status={request.status} />
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-1">
            <h2 className="text-[13px] font-semibold text-foreground mb-3">Description</h2>
            {request.description ? (
              <p className="text-[13.5px] text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {request.description}
              </p>
            ) : (
              <div className="flex items-center gap-2 py-4">
                <p className="text-[13px] text-muted-foreground/60 italic">No description provided.</p>
                <Button variant="ghost" size="sm" className="text-[12px] h-7 gap-1 text-muted-foreground hover:text-foreground">
                  <Edit3 className="h-3 w-3" />
                  Add description
                </Button>
              </div>
            )}
          </div>

          {request.briefFormData && Object.keys(request.briefFormData).length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-[13px] font-semibold text-foreground mb-3">Brief Data</h2>
              <pre className="text-[12px] text-muted-foreground bg-muted/30 rounded-lg p-3 overflow-auto">
                {JSON.stringify(request.briefFormData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-[13px] font-semibold text-foreground mb-2">Details</h2>

            <MetaRow icon={User} label="Assignee">
              {request.assignee ? (
                <AssigneeAvatar user={request.assignee} />
              ) : (
                <span className="text-muted-foreground/60 italic">Unassigned</span>
              )}
            </MetaRow>

            <MetaRow icon={User} label="Creator">
              {request.creator ? (
                <AssigneeAvatar user={request.creator} />
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </MetaRow>

            <MetaRow icon={Building2} label="Workspace">
              <span>{request.workspace?.name ?? '—'}</span>
            </MetaRow>

            <MetaRow icon={Layers} label="Type">
              <span className={cn('font-medium', typeCfg.color)}>{TYPE_LABELS[request.type]}</span>
            </MetaRow>

            <MetaRow icon={Zap} label="Turnaround">
              <span className={cn('font-medium', TIER_COLORS[request.turnaroundTier])}>
                {TIER_LABELS[request.turnaroundTier]}
              </span>
            </MetaRow>

            {request.dueDate && (
              <MetaRow icon={CalendarDays} label="Due Date">
                <span>{formatDate(request.dueDate)}</span>
              </MetaRow>
            )}

            <MetaRow icon={Clock} label="Created">
              <span className="text-muted-foreground">{formatRelativeTime(request.createdAt)}</span>
            </MetaRow>

            <MetaRow icon={Clock} label="Updated">
              <span className="text-muted-foreground">{formatRelativeTime(request.updatedAt)}</span>
            </MetaRow>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-[13px] font-semibold text-foreground mb-3">Request ID</h2>
            <p className="text-[11.5px] font-mono text-muted-foreground bg-muted/40 rounded-md px-2.5 py-1.5 select-all">
              {request.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
