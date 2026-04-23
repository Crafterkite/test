'use client';

import React, { useState } from 'react';
import { FileText, Plus, Search, Filter, Import as SortAsc, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type FilterTab = 'all' | 'submitted' | 'in_progress' | 'revision' | 'completed';

const FILTER_TABS: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'revision', label: 'Revision' },
  { value: 'completed', label: 'Completed' },
];

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Requests
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and track all your creative requests
          </p>
        </div>
        <Button size="sm" className="gap-1.5 self-start sm:self-auto">
          <Plus className="h-3.5 w-3.5" />
          New request
        </Button>
      </div>

      {/* Filter Tabs + Search/Filter bar */}
      <div className="flex flex-col gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border pb-0 overflow-x-auto">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'relative flex items-center gap-1.5 px-3 pb-2.5 pt-1 text-sm transition-colors whitespace-nowrap',
                'focus:outline-none',
                activeTab === tab.value
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
              {activeTab === tab.value && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-sm"
            />
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1.5">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5">
            <SortAsc className="h-3.5 w-3.5" />
            Sort
          </Button>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 border border-border mb-4">
          <Inbox className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          No requests yet
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Start by creating your first creative request. Your team can track
          progress, leave feedback, and deliver assets all in one place.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Create your first request
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Learn more
          </Button>
        </div>

        {/* Feature highlights */}
        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3 w-full max-w-2xl">
          {[
            {
              icon: FileText,
              title: 'Structured briefs',
              description: 'Use templates to capture all the details upfront',
            },
            {
              icon: Filter,
              title: 'Status tracking',
              description: 'Always know where every request stands',
            },
            {
              icon: SortAsc,
              title: 'Priority management',
              description: 'Focus the team on what matters most',
            },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex flex-col items-start gap-2 rounded-lg border border-border bg-card p-4 text-left"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {feature.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
