'use client';

import React, { useState } from 'react';
import { Palette, Plus, Search, Upload, Image as ImageIcon, FileText, Film, Type, Grid3x3 as Grid3X3, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type AssetCategory = 'all' | 'logos' | 'colors' | 'typography' | 'images' | 'templates';

const ASSET_CATEGORIES: { value: AssetCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'all', label: 'All assets', icon: Grid3X3 },
  { value: 'logos', label: 'Logos', icon: Layers },
  { value: 'colors', label: 'Colors', icon: Palette },
  { value: 'typography', label: 'Typography', icon: Type },
  { value: 'images', label: 'Images', icon: ImageIcon },
  { value: 'templates', label: 'Templates', icon: FileText },
];

export default function BrandPage() {
  const [activeCategory, setActiveCategory] = useState<AssetCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Brand Assets
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your centralized brand library and design system
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Upload className="h-3.5 w-3.5" />
            Upload
          </Button>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add asset
          </Button>
        </div>
      </div>

      {/* Categories + Search */}
      <div className="flex flex-col gap-4">
        {/* Category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {ASSET_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={cn(
                  'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap',
                  'focus:outline-none',
                  activeCategory === cat.value
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-border/80 hover:text-foreground'
                )}
              >
                <Icon className="h-3 w-3" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-sm"
          />
        </div>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 border border-border mb-4">
          <Palette className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          Your brand library is empty
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Upload logos, color palettes, fonts, and templates to build your
          centralized brand hub. Keep everyone on-brand, always.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <Button size="sm" className="gap-1.5">
            <Upload className="h-3.5 w-3.5" />
            Upload your first asset
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Import from Figma
          </Button>
        </div>

        {/* Asset type cards */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 w-full max-w-2xl">
          {[
            {
              icon: Layers,
              title: 'Logos',
              description: 'All logo variants and formats',
              color: 'text-blue-400',
              bg: 'bg-blue-500/10',
            },
            {
              icon: Palette,
              title: 'Color palettes',
              description: 'Brand colors with hex, RGB, CMYK',
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10',
            },
            {
              icon: Type,
              title: 'Typography',
              description: 'Fonts, sizes, and usage guidelines',
              color: 'text-amber-400',
              bg: 'bg-amber-500/10',
            },
            {
              icon: ImageIcon,
              title: 'Photography',
              description: 'Approved brand imagery',
              color: 'text-rose-400',
              bg: 'bg-rose-500/10',
            },
            {
              icon: Film,
              title: 'Video',
              description: 'Motion graphics and brand videos',
              color: 'text-indigo-400',
              bg: 'bg-indigo-500/10',
            },
            {
              icon: FileText,
              title: 'Templates',
              description: 'Slide decks, docs, and more',
              color: 'text-cyan-400',
              bg: 'bg-cyan-500/10',
            },
          ].map((type) => {
            const Icon = type.icon;
            return (
              <div
                key={type.title}
                className="flex flex-col items-start gap-2 rounded-lg border border-border bg-card p-4 text-left"
              >
                <div className={cn('flex h-7 w-7 items-center justify-center rounded-md', type.bg)}>
                  <Icon className={cn('h-3.5 w-3.5', type.color)} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {type.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {type.description}
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
