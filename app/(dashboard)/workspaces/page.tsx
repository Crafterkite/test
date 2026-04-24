'use client';

import React, { useState } from 'react';
import { Layers, Plus, FileStack, Users, MoveHorizontal as MoreHorizontal, Settings, ChevronRight, Search } from 'lucide-react';
import { cn, getInitials, stringToColor } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const WORKSPACE_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const MOCK_WORKSPACES = [
  { id: '1', name: 'Marketing', description: 'Campaign assets, social media, and advertising materials', memberCount: 5, requestCount: 8, color: '#2563eb', updatedAt: '2 hours ago' },
  { id: '2', name: 'Product Design', description: 'UI/UX design, product mockups, and prototypes', memberCount: 3, requestCount: 4, color: '#10b981', updatedAt: '1 day ago' },
  { id: '3', name: 'Executive', description: 'Annual reports, presentations, and board materials', memberCount: 2, requestCount: 2, color: '#f59e0b', updatedAt: '3 days ago' },
  { id: '4', name: 'Brand & Identity', description: 'Brand guidelines, logos, and visual identity', memberCount: 4, requestCount: 6, color: '#8b5cf6', updatedAt: '1 week ago' },
];

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60">
        <Layers className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="mb-1.5 text-[15px] font-semibold text-foreground">No workspaces yet</h3>
      <p className="mb-6 max-w-xs text-sm text-muted-foreground leading-relaxed">
        Organize your creative work into dedicated workspaces for different teams or projects.
      </p>
      <Button size="sm" className="gap-2">
        <Plus className="h-3.5 w-3.5" />
        Create Workspace
      </Button>
    </div>
  );
}

function WorkspaceCard({ workspace }: { workspace: typeof MOCK_WORKSPACES[0] }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-border/80 hover:shadow-md hover:shadow-black/10">
      <div className="h-[3px] w-full" style={{ backgroundColor: workspace.color }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[12px] font-bold text-white"
              style={{ backgroundColor: workspace.color }}
            >
              {getInitials(workspace.name)}
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-foreground">{workspace.name}</h3>
              <p className="text-[11.5px] text-muted-foreground">Updated {workspace.updatedAt}</p>
            </div>
          </div>
          <button className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-accent hover:text-foreground group-hover:opacity-100">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>

        <p className="mb-4 text-[12.5px] text-muted-foreground leading-relaxed line-clamp-2">
          {workspace.description}
        </p>

        <div className="flex items-center justify-between border-t border-border/60 pt-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <FileStack className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[12px] text-muted-foreground">
                <span className="font-medium text-foreground">{workspace.requestCount}</span> requests
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[12px] text-muted-foreground">
                <span className="font-medium text-foreground">{workspace.memberCount}</span> members
              </span>
            </div>
          </div>
          <button className="flex items-center gap-1 text-[12px] font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Open
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WorkspacesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading] = useState(false);

  const filtered = MOCK_WORKSPACES.filter(
    (w) => !searchQuery || w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Workspaces</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Organize your team's work into focused spaces
          </p>
        </div>
        <Button size="sm" className="gap-2 self-start sm:self-auto">
          <Plus className="h-3.5 w-3.5" />
          New Workspace
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Workspaces', value: MOCK_WORKSPACES.length, color: 'text-foreground' },
          { label: 'Active Requests', value: MOCK_WORKSPACES.reduce((a, w) => a + w.requestCount, 0), color: 'text-blue-400' },
          { label: 'Total Members', value: 8, color: 'text-emerald-400' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card px-4 py-3">
            <p className={cn('text-xl font-bold', s.color)}>{s.value}</p>
            <p className="text-[11.5px] text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search workspaces..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 w-full rounded-lg border border-border bg-card pl-8 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}

          <button className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/30 p-8 transition-all hover:border-primary/40 hover:bg-primary/5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 text-muted-foreground transition-colors group-hover:border-primary/50 group-hover:text-primary">
              <Plus className="h-4 w-4" />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                New Workspace
              </p>
              <p className="text-[11.5px] text-muted-foreground/70 mt-0.5">
                Organize work into teams
              </p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
