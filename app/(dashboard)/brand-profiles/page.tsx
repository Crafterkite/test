'use client';

import React, { useState } from 'react';
import { Plus, Search, Palette, Globe, Building2, MoveHorizontal as MoreHorizontal, ExternalLink, FileImage, Type, Droplets, Layers2, ChevronRight } from 'lucide-react';
import { cn, getInitials, stringToColor } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProfileCardSkeleton } from '@/components/ui/skeleton';

interface BrandProfile {
  id: string;
  name: string;
  industry: string;
  website?: string;
  description: string;
  colors: string[];
  fonts: string[];
  assetCount: number;
  requestCount: number;
  updatedAt: string;
}

const MOCK_PROFILES: BrandProfile[] = [
  {
    id: '1',
    name: 'Acme Corp',
    industry: 'Technology',
    website: 'acmecorp.com',
    description: 'Enterprise software solutions for modern teams',
    colors: ['#2563eb', '#1e40af', '#f8fafc', '#0f172a'],
    fonts: ['Inter', 'Geist Mono'],
    assetCount: 48,
    requestCount: 12,
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    name: 'Bloom Studio',
    industry: 'Creative Agency',
    website: 'bloomstudio.io',
    description: 'Premium design studio for ambitious brands',
    colors: ['#f97316', '#ea580c', '#fef3c7', '#1c1917'],
    fonts: ['Playfair Display', 'DM Sans'],
    assetCount: 127,
    requestCount: 8,
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    name: 'NovaMed Health',
    industry: 'Healthcare',
    description: 'Patient-first digital health platform',
    colors: ['#10b981', '#059669', '#ecfdf5', '#064e3b'],
    fonts: ['Plus Jakarta Sans', 'Space Grotesk'],
    assetCount: 32,
    requestCount: 5,
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60">
        <Palette className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="mb-1.5 text-[15px] font-semibold text-foreground">No brand profiles yet</h3>
      <p className="mb-6 max-w-xs text-sm text-muted-foreground leading-relaxed">
        Create a brand profile to organize your assets, colors, fonts, and guidelines in one place.
      </p>
      <Button size="sm" className="gap-2">
        <Plus className="h-3.5 w-3.5" />
        Create Brand Profile
      </Button>
    </div>
  );
}

function BrandCard({ profile }: { profile: BrandProfile }) {
  const primary = profile.colors[0] ?? '#2563eb';

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-border/80 hover:shadow-lg hover:shadow-black/20">
      {/* Color header strip */}
      <div className="h-[3px] w-full" style={{ background: `linear-gradient(to right, ${profile.colors.slice(0, 3).join(', ')})` }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[13px] font-bold text-white shadow-sm"
              style={{ backgroundColor: primary }}
            >
              {getInitials(profile.name)}
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-foreground leading-tight">{profile.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Building2 className="h-3 w-3 text-muted-foreground" />
                <span className="text-[11.5px] text-muted-foreground">{profile.industry}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {profile.website && (
              <button className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            )}
            <button className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-[12.5px] text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {profile.description}
        </p>

        {/* Color palette */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Droplets className="h-3 w-3 text-muted-foreground" />
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Colors</span>
          </div>
          <div className="flex items-center gap-1.5">
            {profile.colors.map((color, i) => (
              <div
                key={i}
                className="h-5 w-5 rounded-full border border-black/10 ring-1 ring-white/5"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Fonts */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Type className="h-3 w-3 text-muted-foreground" />
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Fonts</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profile.fonts.map((font, i) => (
              <span key={i} className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                {font}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between border-t border-border/60 pt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <FileImage className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[12px] text-muted-foreground">
                <span className="font-medium text-foreground">{profile.assetCount}</span> assets
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers2 className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[12px] text-muted-foreground">
                <span className="font-medium text-foreground">{profile.requestCount}</span> requests
              </span>
            </div>
          </div>
          <button className="flex items-center gap-1 text-[12px] font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            View
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BrandProfilesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading] = useState(false);

  const filtered = MOCK_PROFILES.filter((p) =>
    !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Brand Profiles</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Manage brand identities, assets, and guidelines
          </p>
        </div>
        <Button size="sm" className="gap-2 self-start sm:self-auto">
          <Plus className="h-3.5 w-3.5" />
          New Brand Profile
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Brand Profiles', value: 3, icon: Palette, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Total Assets', value: 207, icon: FileImage, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Active Requests', value: 25, icon: Layers2, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-border bg-card px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', stat.bg)}>
                  <Icon className={cn('h-4 w-4', stat.color)} />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search brand profiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-full rounded-lg border border-border bg-card pl-8 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProfileCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((profile) => (
            <BrandCard key={profile.id} profile={profile} />
          ))}

          {/* Add new card */}
          <button className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/30 p-8 transition-all hover:border-primary/40 hover:bg-primary/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 text-muted-foreground transition-colors group-hover:border-primary/50 group-hover:text-primary">
              <Plus className="h-5 w-5" />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Add Brand Profile
              </p>
              <p className="text-[11.5px] text-muted-foreground/70 mt-0.5">
                Create a new brand identity
              </p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
