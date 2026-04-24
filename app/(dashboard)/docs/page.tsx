'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Clock, FileText, FileSpreadsheet,
  Presentation, FormInput, Star, ChevronLeft, ChevronRight,
  MoreHorizontal, Grid3x3, List, SlidersHorizontal,
  FileCode, FilePen, Zap, TrendingUp, Users, Folder,
  StarOff, Trash2, Copy, ExternalLink, Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

const DOC_TYPES = [
  { label: 'Document',    type: 'docs',   icon: FileText,        color: 'text-blue-400',    bg: 'bg-blue-400/10',    desc: 'Briefs, notes, rich text'        },
  { label: 'Spreadsheet', type: 'sheets', icon: FileSpreadsheet, color: 'text-amber-400',   bg: 'bg-amber-400/10',   desc: 'Budgets, data, tracking'         },
  { label: 'Slides',      type: 'slides', icon: Presentation,    color: 'text-rose-400',    bg: 'bg-rose-400/10',    desc: 'Decks and presentations'         },
  { label: 'Form',        type: 'forms',  icon: FormInput,       color: 'text-emerald-400', bg: 'bg-emerald-400/10', desc: 'Collect responses and feedback'  },
  { label: 'Contract',    type: 'docs',   icon: FilePen,         color: 'text-purple-400',  bg: 'bg-purple-400/10',  desc: 'Agreements with signature blocks'},
  { label: 'Code',        type: 'code',   icon: FileCode,        color: 'text-cyan-400',    bg: 'bg-cyan-400/10',    desc: 'Specs, snippets, API docs'       },
] as const;

const TEMPLATES = [
  { id: '1', title: 'Creative Brief',     desc: 'Campaign & project brief with deliverables and timeline', gradient: 'from-violet-600 to-fuchsia-600', type: 'docs',   tag: 'Popular'  },
  { id: '2', title: 'Brand Guidelines',   desc: 'Full brand identity, typography, colors & usage rules',   gradient: 'from-blue-600 to-cyan-500',       type: 'docs',   tag: 'Popular'  },
  { id: '3', title: 'Client Contract',    desc: 'Standard service agreement with signature blocks',        gradient: 'from-emerald-600 to-teal-500',    type: 'docs',   tag: 'Legal'    },
  { id: '4', title: 'Budget Tracker',     desc: 'Project budget, expenses & approval workflow',            gradient: 'from-amber-500 to-orange-500',    type: 'sheets', tag: 'Finance'  },
  { id: '5', title: 'Pitch Deck',         desc: 'Investor & client pitch deck structure',                  gradient: 'from-rose-600 to-pink-500',       type: 'slides', tag: 'Popular'  },
  { id: '6', title: 'Meeting Notes',      desc: 'Structured notes with decisions and action items',        gradient: 'from-indigo-600 to-purple-600',   type: 'docs',   tag: 'Team'     },
  { id: '7', title: 'NDA Template',       desc: 'Mutual non-disclosure agreement ready to sign',           gradient: 'from-slate-600 to-zinc-600',      type: 'docs',   tag: 'Legal'    },
  { id: '8', title: 'Data Analysis',      desc: 'Pivot-ready data table with chart placeholders',          gradient: 'from-teal-600 to-emerald-500',    type: 'sheets', tag: 'Data'     },
];

const RECENT = [
  { id: '1', title: 'Bloom Studio — Client Contract Q2', type: 'docs',   updated: 'Today at 12:08 PM', starred: true,  shared: 3 },
  { id: '2', title: 'A Guide to Mining Aegisum',         type: 'docs',   updated: 'Today at 10:56 AM', starred: false, shared: 0 },
  { id: '3', title: 'Brand Guidelines — Acme Corp',      type: 'docs',   updated: 'Today at 10:54 AM', starred: true,  shared: 5 },
  { id: '4', title: 'Q2 Asset Delivery Tracker',         type: 'sheets', updated: 'Sep 13, 2025',      starred: false, shared: 2 },
  { id: '5', title: 'Campaign Pitch — Spring Drop',      type: 'slides', updated: 'Sep 10, 2025',      starred: false, shared: 1 },
  { id: '6', title: 'Marketing Template',                type: 'docs',   updated: 'Sep 8, 2025',       starred: false, shared: 0 },
];

const TAG_COLORS: Record<string, string> = {
  Popular: 'bg-blue-400/10 text-blue-400',
  Legal:   'bg-purple-400/10 text-purple-400',
  Finance: 'bg-amber-400/10 text-amber-400',
  Team:    'bg-emerald-400/10 text-emerald-400',
  Data:    'bg-cyan-400/10 text-cyan-400',
};

type ViewMode = 'grid' | 'list';

// ─── TemplateCard ─────────────────────────────────────────────────────────────

function TemplateCard({ tmpl }: { tmpl: typeof TEMPLATES[number] }) {
  return (
    <Link href={`/${tmpl.type}/editor/new`} className="group flex-shrink-0 w-56">
      <div className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg hover:border-border/60 hover:shadow-black/20 transition-all duration-200">
        {/* Gradient preview */}
        <div className={cn('h-28 bg-gradient-to-br relative overflow-hidden', tmpl.gradient)}>
          {/* Subtle doc lines overlay */}
          <div className="absolute inset-0 flex flex-col justify-center px-5 gap-1.5 opacity-20">
            {[60, 90, 75, 45].map((w, i) => (
              <div key={i} className="h-1 rounded-full bg-white" style={{ width: `${w}%` }} />
            ))}
          </div>
          {/* Tag */}
          <span className={cn('absolute top-2.5 right-2.5 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm', TAG_COLORS[tmpl.tag] ?? 'bg-white/10 text-white')}>
            {tmpl.tag}
          </span>
        </div>
        <div className="p-4">
          <h3 className="text-[13.5px] font-semibold text-foreground leading-tight mb-1">{tmpl.title}</h3>
          <p className="text-[11.5px] text-muted-foreground line-clamp-2 leading-relaxed">{tmpl.desc}</p>
        </div>
      </div>
    </Link>
  );
}

// ─── RecentDocCard ────────────────────────────────────────────────────────────

function RecentDocCard({ doc, onStar }: { doc: typeof RECENT[number]; onStar: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const typeInfo = DOC_TYPES.find(t => t.type === doc.type) ?? DOC_TYPES[0];
  const Icon = typeInfo.icon;

  // Simulated mini-preview lines
  const previewLines = [85, 100, 70, 95, 60, 80, 45];

  return (
    <div className="group relative rounded-xl border border-border bg-card hover:border-border/70 hover:shadow-md hover:shadow-black/10 transition-all duration-200 overflow-hidden cursor-pointer">
      <Link href={`/docs/editor/${doc.id}`} className="block">
        {/* Document preview */}
        <div className="h-36 bg-muted/30 border-b border-border px-4 pt-4 pb-2 flex flex-col gap-1 relative overflow-hidden">
          {/* Doc icon watermark */}
          <Icon className={cn('absolute bottom-2 right-3 h-8 w-8 opacity-5', typeInfo.color)} />
          {/* Line preview */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="h-2 rounded bg-foreground/15 w-3/4" />
            {previewLines.map((w, i) => (
              <div key={i} className="h-1 rounded bg-foreground/8" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </Link>

      {/* Info row */}
      <div className="px-3 py-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-foreground truncate leading-tight">{doc.title}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <div className={cn('flex h-4 w-4 items-center justify-center rounded', typeInfo.bg)}>
                <Icon className={cn('h-2.5 w-2.5', typeInfo.color)} />
              </div>
              <Clock className="h-3 w-3 text-muted-foreground/50" />
              <span className="text-[11px] text-muted-foreground truncate">{doc.updated}</span>
            </div>
          </div>

          {/* Context menu */}
          <div className="relative flex-shrink-0">
            <button
              onClick={e => { e.preventDefault(); setMenuOpen(v => !v); }}
              className="rounded-md p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-accent hover:text-foreground transition-all"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-6 z-20 w-44 rounded-xl border border-border bg-card shadow-xl py-1 overflow-hidden">
                  {[
                    { icon: ExternalLink, label: 'Open' },
                    { icon: Copy,         label: 'Duplicate' },
                    { icon: Download,     label: 'Export' },
                    { icon: doc.starred ? StarOff : Star, label: doc.starred ? 'Unstar' : 'Star', action: onStar },
                    { icon: Trash2,       label: 'Delete', destructive: true },
                  ].map(item => {
                    const ItemIcon = item.icon;
                    return (
                      <button key={item.label} onClick={() => { item.action?.(); setMenuOpen(false); }}
                        className={cn('flex w-full items-center gap-2.5 px-3 py-2 text-[12.5px] transition-colors hover:bg-accent',
                          item.destructive ? 'text-destructive hover:bg-destructive/10' : 'text-foreground')}
                      >
                        <ItemIcon className="h-3.5 w-3.5 flex-shrink-0" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Star indicator */}
        {doc.starred && (
          <Star className="absolute top-2 left-2 h-3 w-3 fill-amber-400 text-amber-400" />
        )}
      </div>
    </div>
  );
}

// ─── RecentDocRow ─────────────────────────────────────────────────────────────

function RecentDocRow({ doc, onStar }: { doc: typeof RECENT[number]; onStar: () => void }) {
  const typeInfo = DOC_TYPES.find(t => t.type === doc.type) ?? DOC_TYPES[0];
  const Icon = typeInfo.icon;
  return (
    <Link href={`/docs/editor/${doc.id}`}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-accent/40 transition-colors group"
    >
      <div className={cn('flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg', typeInfo.bg)}>
        <Icon className={cn('h-4 w-4', typeInfo.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-medium text-foreground truncate">{doc.title}</p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {doc.starred && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
        {doc.shared > 0 && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-3 w-3" />
            <span className="text-[11px]">{doc.shared}</span>
          </div>
        )}
        <span className="text-[11.5px] text-muted-foreground w-28 text-right">{doc.updated}</span>
      </div>
    </Link>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const [searchQuery, setSearchQuery]   = useState('');
  const [viewMode, setViewMode]         = useState<ViewMode>('grid');
  const [recent, setRecent]             = useState(RECENT);
  const scrollRef                       = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') =>
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });

  const toggleStar = (id: string) =>
    setRecent(p => p.map(d => d.id === id ? { ...d, starred: !d.starred } : d));

  const filtered = recent.filter(d =>
    !searchQuery || d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1.5">
            <Zap className="h-3.5 w-3.5" />
            <span className="text-xs font-medium uppercase tracking-[2px]">Workspace</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Docs & Knowledge</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Central hub for documents, templates, and knowledge
          </p>
        </div>
          <Link href="/docs/editor/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-white hover:bg-primary/90 transition-colors shadow-sm flex-shrink-0"
        >
          <Plus className="h-4 w-4" /> New Document
        </Link>
      </div>

      {/* ── Quick create row ── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {DOC_TYPES.map(t => {
          const Icon = t.icon;
          return (
            <Link
  key={t.type + t.label}
  href={`/${t.type}/editor/new`}
              className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card px-3 py-4 hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl transition-transform group-hover:scale-110', t.bg)}>
                <Icon className={cn('h-4.5 w-4.5', t.color)} />
              </div>
              <span className="text-[12px] font-medium text-foreground">{t.label}</span>
            </Link>
          );
        })}
      </div>

           {/* ── Templates carousel ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-[15px] font-semibold text-foreground">Popular Templates</h2>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground font-medium">{TEMPLATES.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll('left')}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => scroll('right')}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <Link href="/templates"
              className="flex items-center gap-1 text-[12.5px] font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Scrollable strip */}
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Blank card */}
         <Link href="/docs/editor/new"
            <div className="h-[192px] rounded-xl border-2 border-dashed border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 text-muted-foreground group-hover:border-primary/50 group-hover:text-primary transition-colors">
                <Plus className="h-5 w-5" />
              </div>
              <p className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">Blank Document</p>
            </div>
          </Link>

          {TEMPLATES.map(tmpl => <TemplateCard key={tmpl.id} tmpl={tmpl} />)}
        </div>
      </div>

      {/* ── Recent docs ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-[15px] font-semibold text-foreground">Recent Documents</h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-8 w-40 rounded-lg border border-border bg-card pl-8 pr-3 text-[12.5px] placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 transition-colors"
              />
            </div>
            {/* View toggle */}
            <div className="flex items-center gap-0.5 rounded-lg border border-border bg-card p-1">
              <button onClick={() => setViewMode('grid')}
                className={cn('rounded-md p-1.5 transition-colors', viewMode === 'grid' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground')}
              >
                <Grid3x3 className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setViewMode('list')}
                className={cn('rounded-md p-1.5 transition-colors', viewMode === 'list' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground')}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Starred section */}
        {filtered.some(d => d.starred) && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2.5">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Starred</span>
            </div>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {filtered.filter(d => d.starred).map(doc => (
                  <RecentDocCard key={doc.id} doc={doc} onStar={() => toggleStar(doc.id)} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                {filtered.filter(d => d.starred).map((doc, i, arr) => (
                  <div key={doc.id} className={cn(i < arr.length - 1 && 'border-b border-border/50')}>
                    <RecentDocRow doc={doc} onStar={() => toggleStar(doc.id)} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* All recents */}
        <div>
          {filtered.some(d => d.starred) && (
            <div className="flex items-center gap-2 mb-2.5">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">All Recent</span>
            </div>
          )}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filtered.filter(d => !d.starred).map(doc => (
                <RecentDocCard key={doc.id} doc={doc} onStar={() => toggleStar(doc.id)} />
              ))}
              {/* New doc shortcut */}
              <Link href="/docs/editor/new"
                className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/30 hover:border-primary/40 hover:bg-primary/5 transition-all min-h-[168px]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 text-muted-foreground group-hover:border-primary/50 group-hover:text-primary transition-colors">
                  <Plus className="h-4 w-4" />
                </div>
                <p className="text-[12px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">New</p>
              </Link>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              {/* List header */}
              <div className="flex items-center gap-3 border-b border-border bg-muted/20 px-3 py-2">
                <div className="w-8" />
                <p className="flex-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Name</p>
                <p className="w-28 text-right text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Modified</p>
              </div>
              {filtered.filter(d => !d.starred).map((doc, i, arr) => (
                <div key={doc.id} className={cn(i < arr.length - 1 && 'border-b border-border/50')}>
                  <RecentDocRow doc={doc} onStar={() => toggleStar(doc.id)} />
                </div>
              ))}
            </div>
          )}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-border bg-muted/10 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/25 mb-3" />
            <p className="text-[14px] font-medium text-muted-foreground">No documents found</p>
            <p className="text-[12.5px] text-muted-foreground/70 mt-1">Try a different search or create a new document</p>
          </div>
        )}
      </div>
    </div>
  );
}
