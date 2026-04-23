'use client';

import React from 'react';
import { Grid3x3 as Grid3X3, Plus, Folder, Users, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn, stringToColor } from '@/lib/utils';

const MOCK_WORKSPACES = [
  {
    id: '1',
    name: 'Marketing',
    description: 'Brand campaigns, social media, and advertising assets',
    memberCount: 4,
    requestCount: 8,
    color: '#2563eb',
  },
  {
    id: '2',
    name: 'Product Design',
    description: 'UI/UX design, prototypes, and design system components',
    memberCount: 3,
    requestCount: 5,
    color: '#059669',
  },
  {
    id: '3',
    name: 'Content',
    description: 'Blog posts, newsletters, and editorial content',
    memberCount: 2,
    requestCount: 3,
    color: '#d97706',
  },
];

export default function WorkspacesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Workspaces
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Organize your team's work into dedicated spaces
          </p>
        </div>
        <Button size="sm" className="gap-1.5 self-start sm:self-auto">
          <Plus className="h-3.5 w-3.5" />
          New workspace
        </Button>
      </div>

      {/* Workspace Grid */}
      {MOCK_WORKSPACES.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_WORKSPACES.map((workspace) => (
            <Card
              key={workspace.id}
              className="group card-hover cursor-pointer border-border bg-card"
            >
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
                    style={{ backgroundColor: workspace.color }}
                  >
                    {workspace.name.charAt(0)}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">{workspace.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {workspace.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="mt-4 flex items-center gap-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>{workspace.memberCount} members</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" />
                    <span>{workspace.requestCount} requests</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add new workspace card */}
          <button className="group flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-5 text-center transition-all hover:border-primary/40 hover:bg-primary/5 min-h-[160px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 border border-border transition-colors group-hover:bg-primary/10 group-hover:border-primary/20 mb-3">
              <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
            </div>
            <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
              New workspace
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Create a new project space
            </p>
          </button>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 border border-border mb-4">
            <Grid3X3 className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            No workspaces yet
          </h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Workspaces help you organize your team's creative work. Create
            separate spaces for marketing, product, content, and more.
          </p>
          <Button size="sm" className="mt-6 gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Create your first workspace
          </Button>
        </div>
      )}
    </div>
  );
}
