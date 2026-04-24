'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, FileStack, Clock, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, RefreshCw, Archive, Activity, MoveHorizontal as MoreHorizontal, ArrowUpRight, CalendarDays, SlidersHorizontal, X } from 'lucide-react';
import { cn, formatRelativeTime, formatDate, getInitials, stringToColor } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RequestsListSkeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Request, RequestStatus, RequestType, TurnaroundTier } from '@/types';
import { MOCK_REQUESTS, STATUS_LABELS, TYPE_LABELS, TIER_LABELS } from '@/lib/mock-requests';

type FilterStatus = 'ALL' | RequestStatus;

const STATUS_CONFIG: Record<RequestStatus, { icon: React.ElementType; bg: string; text: string }> = {
  DRAFT: { icon: Clock, bg: 'bg-slate-500/10', text: 'text-slate-400' },
  SUBMITTED: { icon: Clock, bg: 'bg-amber-500/10', text: 'text-amber-400' },
  ACTIVE: { icon: Activity, bg: 'bg-blue-500/10', text: 'text-blue-400' },
  IN_PROGRESS: { icon: RefreshCw, bg: 'bg-sky-500/10', text: 'text-sky-400' },
  IN_REVISION: { icon: AlertCircle, bg: 'bg-orange-500/10', text: 'text-orange-400' },
  COMPLETED: { icon: CheckCircle2, bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  ARCHIVED: { icon: Archive, bg: 'bg-muted', text: 'text-muted-foreground' },
};

const TYPE_CONFIG: Record<RequestType, { color: string; bg: string }> = {
  DESIGN: { color: 'text-blue-400', bg: 'bg-blue-500/10' },
  MOTION: { color: 'text-violet-400', bg: 'bg-violet-500/10' },
  COPY: { color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  STRATEGY: { color: 'text-amber-400', bg: 'bg-amber-500/10' },
  DEVELOPMENT: { color: 'text-rose-400', bg: 'bg-rose-500/10' },
};

const TIER_CONFIG: Record<TurnaroundTier, { color: string }> = {
  STANDARD: { color: 'text-muted-foreground' },
  RUSH: { color: 'text-amber-400' },
  PRIORITY: { color: 'text-rose-400' },
};

const FILTER_TABS: { key: FilterStatus; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'DRAFT', label: 'Draft' },
  { key: 'SUBMITTED', label: 'Submitted' },
  { key: 'ACTIVE', label: 'Active' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'IN_REVISION', label: 'In Revision' },
  { key: 'COMPLETED', label: 'Completed' },
];

function StatusBadge({ status }: { status: RequestStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide', cfg.bg, cfg.text)}>
      <Icon className="h-3 w-3" />
      {STATUS_LABELS[status]}
    </span>
  );
}

function TypeBadge({ type }: { type: RequestType }) {
  const cfg = TYPE_CONFIG[type];
  return (
    <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold', cfg.bg, cfg.color)}>
      {TYPE_LABELS[type]}
    </span>
  );
}

function AssigneeAvatar({ user }: { user: { firstName: string; lastName: string; avatarUrl?: string | null } }) {
  const initials = getInitials(user.firstName, user.lastName);
  const color = stringToColor(`${user.firstName}${user.lastName}`);
  return (
    <div
      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-background"
      style={{ backgroundColor: color }}
      title={`${user.firstName} ${user.lastName}`}
    >
      {initials}
    </div>
  );
}

function RequestRow({ request, onClick }: { request: Request; onClick: () => void }) {
  const tierCfg = TIER_CONFIG[request.turnaroundTier];
  const statusCfg = STATUS_CONFIG[request.status];
  const Icon = statusCfg.icon;

  return (
    <div
      onClick={onClick}
      className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-3.5 transition-all hover:border-primary/20 hover:bg-card/60 hover:shadow-sm cursor-pointer"
    >
      <div className={cn('flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg', statusCfg.bg)}>
        <Icon className={cn('h-3.5 w-3.5', statusCfg.text)} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-[13.5px] font-semibold text-foreground group-hover:text-primary transition-colors">
            {request.title}
          </p>
          <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11.5px] text-muted-foreground">{request.workspace?.name ?? '—'}</span>
          <span className="text-muted-foreground/30">·</span>
          <span className={cn('text-[11.5px] font-medium', tierCfg.color)}>{TIER_LABELS[request.turnaroundTier]}</span>
          <span className="text-muted-foreground/30">·</span>
          <span className="text-[11.5px] text-muted-foreground">{formatRelativeTime(request.createdAt)}</span>
        </div>
      </div>

      <div className="hidden items-center gap-3 md:flex">
        <TypeBadge type={request.type} />
        <StatusBadge status={request.status} />
      </div>

      {request.dueDate ? (
        <div className="hidden items-center gap-1.5 lg:flex">
          <CalendarDays className="h-3 w-3 text-muted-foreground" />
          <span className="text-[11.5px] text-muted-foreground whitespace-nowrap">
            {formatDate(request.dueDate)}
          </span>
        </div>
      ) : (
        <div className="hidden w-24 lg:block" />
      )}

      {request.assignee ? (
        <AssigneeAvatar user={request.assignee} />
      ) : (
        <div className="hidden h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-dashed border-border sm:flex">
          <span className="text-[9px] text-muted-foreground/50">—</span>
        </div>
      )}

      <button
        onClick={(e) => e.stopPropagation()}
        className="flex-shrink-0 rounded-md p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-accent hover:text-foreground group-hover:opacity-100"
      >
        <MoreHorizontal className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function EmptyState({ hasFilters, onClear }: { hasFilters: boolean; onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 ring-1 ring-border">
        <FileStack className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="mb-1.5 text-[15px] font-semibold text-foreground">
        {hasFilters ? 'No matching requests' : 'No requests yet'}
      </h3>
      <p className="mb-6 max-w-xs text-sm text-muted-foreground leading-relaxed">
        {hasFilters
          ? "Try adjusting your filters or search to find what you're looking for."
          : 'Create your first creative request to get the team started.'}
      </p>
      {hasFilters ? (
        <Button variant="outline" size="sm" onClick={onClear} className="gap-2">
          <X className="h-3.5 w-3.5" />
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}

interface NewRequestFormState {
  title: string;
  type: RequestType | '';
  description: string;
  dueDate: string;
  turnaroundTier: TurnaroundTier;
}

function NewRequestModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: NewRequestFormState) => void;
}) {
  const [form, setForm] = useState<NewRequestFormState>({
    title: '',
    type: '',
    description: '',
    dueDate: '',
    turnaroundTier: 'STANDARD',
  });
  const [submitting, setSubmitting] = useState(false);

  const isValid = form.title.trim().length > 0 && form.type !== '';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    setTimeout(() => {
      onSubmit(form);
      setSubmitting(false);
      setForm({ title: '', type: '', description: '', dueDate: '', turnaroundTier: 'STANDARD' });
    }, 600);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">New Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          <div className="space-y-1.5">
            <label className="text-[12.5px] font-medium text-muted-foreground">Title *</label>
            <input
              type="text"
              placeholder="e.g. Q4 Campaign — Social Assets"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-muted-foreground">Type *</label>
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as RequestType }))}>
                <SelectTrigger className="h-9 text-[13px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(TYPE_LABELS) as RequestType[]).map((t) => (
                    <SelectItem key={t} value={t} className="text-[13px]">
                      {TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-muted-foreground">Turnaround</label>
              <Select
                value={form.turnaroundTier}
                onValueChange={(v) => setForm((f) => ({ ...f, turnaroundTier: v as TurnaroundTier }))}
              >
                <SelectTrigger className="h-9 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(TIER_LABELS) as TurnaroundTier[]).map((t) => (
                    <SelectItem key={t} value={t} className="text-[13px]">
                      {TIER_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12.5px] font-medium text-muted-foreground">Description</label>
            <textarea
              placeholder="Describe the creative request, goals, and any references..."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={4}
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12.5px] font-medium text-muted-foreground">Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
              className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={!isValid || submitting} className="gap-2 min-w-[128px]">
              {submitting ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              Create Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function RequestsPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('ALL');
  const [typeFilter, setTypeFilter] = useState<RequestType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading] = useState(false);
  const [requests, setRequests] = useState<Request[]>(MOCK_REQUESTS);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (r.status === 'ARCHIVED') return false;
      if (activeFilter !== 'ALL' && r.status !== activeFilter) return false;
      if (typeFilter !== 'ALL' && r.type !== typeFilter) return false;
      if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [requests, activeFilter, typeFilter, searchQuery]);

  const counts = useMemo(() => {
    const base = requests.filter((r) => r.status !== 'ARCHIVED');
    const result: Record<string, number> = { ALL: base.length };
    FILTER_TABS.slice(1).forEach((tab) => {
      result[tab.key] = base.filter((r) => r.status === tab.key).length;
    });
    return result;
  }, [requests]);

  const hasFilters = activeFilter !== 'ALL' || typeFilter !== 'ALL' || searchQuery.length > 0;

  function handleClearFilters() {
    setActiveFilter('ALL');
    setTypeFilter('ALL');
    setSearchQuery('');
  }

  function handleNewRequest(data: NewRequestFormState) {
    if (!data.type) return;
    const newReq: Request = {
      id: `req_${Date.now()}`,
      orgId: 'mock-org-crafterkite',
      workspaceId: 'mock-ws-marketing',
      title: data.title,
      description: data.description || null,
      type: data.type as RequestType,
      status: 'DRAFT',
      priorityOrder: 9999,
      turnaroundTier: data.turnaroundTier,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      creatorId: 'mock-user-current',
      assigneeId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creator: { id: 'mock-user-current', firstName: 'Alex', lastName: 'Rivera', avatarUrl: null },
      assignee: null,
      workspace: { id: 'mock-ws-marketing', name: 'Marketing', slug: 'marketing' },
    };
    setRequests((prev) => [newReq, ...prev]);
    setShowModal(false);
  }

  const statsRow = [
    { label: 'Total Active', value: (counts['ALL'] ?? 0) - (counts['COMPLETED'] ?? 0), color: 'text-foreground' },
    { label: 'In Progress', value: counts['IN_PROGRESS'] ?? 0, color: 'text-sky-400' },
    { label: 'In Revision', value: counts['IN_REVISION'] ?? 0, color: 'text-orange-400' },
    { label: 'Completed', value: counts['COMPLETED'] ?? 0, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Requests</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Manage and track all creative requests across workspaces
          </p>
        </div>
        <Button size="sm" className="gap-2 self-start" onClick={() => setShowModal(true)}>
          <Plus className="h-3.5 w-3.5" />
          New Request
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statsRow.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card px-4 py-3.5 transition-colors hover:bg-card/80"
          >
            <p className={cn('text-2xl font-bold tabular-nums', stat.color)}>{stat.value}</p>
            <p className="text-[11.5px] text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1">
          {FILTER_TABS.map((tab) => {
            const count = counts[tab.key] ?? 0;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={cn(
                  'flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-[12px] font-medium transition-all',
                  activeFilter === tab.key
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={cn(
                      'flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-semibold',
                      activeFilter === tab.key
                        ? 'bg-white/20 text-white'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-52 rounded-lg border border-border bg-card pl-8 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as RequestType | 'ALL')}>
            <SelectTrigger className="h-9 w-[130px] text-[12.5px] gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-[13px]">All types</SelectItem>
              {(Object.keys(TYPE_LABELS) as RequestType[]).map((t) => (
                <SelectItem key={t} value={t} className="text-[13px]">
                  {TYPE_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        {isLoading ? (
          <RequestsListSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState hasFilters={hasFilters} onClear={handleClearFilters} />
        ) : (
          <div className="space-y-2">
            <p className="text-[11.5px] text-muted-foreground px-1 mb-3">
              {filtered.length} {filtered.length === 1 ? 'request' : 'requests'}
              {hasFilters ? ' matching filters' : ''}
            </p>
            {filtered.map((request) => (
              <RequestRow
                key={request.id}
                request={request}
                onClick={() => router.push(`/dashboard/requests/${request.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      <NewRequestModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleNewRequest}
      />
    </div>
  );
}
