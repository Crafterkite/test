'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import CharacterCount from '@tiptap/extension-character-count';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';

import { createLowlight } from 'lowlight';
import { common } from 'lowlight';

const lowlight = createLowlight(common);

import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Highlighter,
  List, ListOrdered, ListChecks, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Download, Search, Info, Share2, Star, StarOff, Undo, Redo, Clock, FileText, Code, Code2,
  Quote, Minus, Type, ChevronDown, ChevronRight,
  Eye, EyeOff, Maximize2, Minimize2, Check, Copy, Link,
  Users, Globe, Lock, ZoomIn, ZoomOut, MoreHorizontal,
  Printer, Save, History, Sparkles, PenLine,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import DocsToolbar from '@/components/docs/DocsToolbar';
import DocsStatusBar from '@/components/docs/DocsStatusBar';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Collaborator {
  id: string;
  name: string;
  color: string;
  initials: string;
  active: boolean;
}

type ZoomLevel = 75 | 90 | 100 | 110 | 125 | 150;
type AccessLevel = 'private' | 'team' | 'public';

// ─── Constants ────────────────────────────────────────────────────────────────

const ZOOM_LEVELS: ZoomLevel[] = [75, 90, 100, 110, 125, 150];

const MOCK_COLLABORATORS: Collaborator[] = [
  { id: '1', name: 'Sarah Chen',    color: 'bg-violet-500', initials: 'SC', active: true  },
  { id: '2', name: 'Marcus Rivera', color: 'bg-emerald-500',initials: 'MR', active: true  },
  { id: '3', name: 'Aria Johnson',  color: 'bg-amber-500',  initials: 'AJ', active: false },
];

const EXPORT_FORMATS = [
  { label: 'PDF Document',    ext: 'pdf',  icon: '📄' },
  { label: 'Word Document',   ext: 'docx', icon: '📝' },
  { label: 'Plain Text',      ext: 'txt',  icon: '📃' },
  { label: 'Markdown',        ext: 'md',   icon: '⬇️'  },
  { label: 'HTML',            ext: 'html', icon: '🌐' },
];

const INITIAL_CONTENT = `
<h1>Welcome to Crafterkite Docs</h1>

<p class="lead">
Your workspace for structured thinking, fast drafting, and beautifully organized documents.
Built for creative teams who move with intention.<br>
</p>

<h2>Getting Started</h2><br>
<p>
Use the toolbar above to format your document, or type <code>/</code> anywhere to open the command menu.
Every action is designed to keep you in flow.
</p>

<ul>
  <li>Clean, modern formatting with headings, lists, and inline styling</li>
  <li>Real‑time collaboration with presence, cursors, and shared awareness</li>
  <li>Export to PDF, DOCX, Markdown, and more — all from one place</li>
</ul>

<h2>Pro Tips</h2>
<p>
Structure your ideas with clear hierarchy. Use <strong>Headings</strong> to define sections, 
<em>inline styles</em> to emphasize key points, and <code>code blocks</code> for technical notes.
</p>

<blockquote>
  <p>
    “Great documents aren’t written — they’re designed.  
    Start with clarity, build with intention, and let your ideas breathe.”
  </p>
</blockquote>

<h2>Start Writing</h2>
<p>
Your canvas is ready. Begin drafting below and watch your document evolve in real time.
</p>

`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ToolbarBtn({
  onClick, active, disabled, title, children, wide = false,
}: {
  onClick: () => void; active?: boolean; disabled?: boolean;
  title: string; children: React.ReactNode; wide?: boolean;
}) {
  return (
    <button
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      className={cn(
        'flex items-center justify-center rounded-md text-muted-foreground transition-all duration-100',
        'hover:bg-accent hover:text-foreground active:scale-95',
        'disabled:pointer-events-none disabled:opacity-30',
        active && 'bg-accent text-foreground',
        wide ? 'h-7 gap-1.5 px-2.5 text-[12px] font-medium' : 'h-7 w-7',
      )}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="h-5 w-px bg-border flex-shrink-0 mx-0.5" />;
}

// ─── Heading Picker ───────────────────────────────────────────────────────────

function HeadingPicker({ editor }: { editor: any }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const active = [1, 2, 3, 4].find(l => editor.isActive('heading', { level: l }));
  const label = active ? `Heading ${active}` : 'Paragraph';

  const options = [
    { label: 'Paragraph', className: 'text-[14px]',       action: () => editor.chain().focus().setParagraph().run(),               active: editor.isActive('paragraph') },
    { label: 'Heading 1', className: 'text-[20px] font-bold',   action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
    { label: 'Heading 2', className: 'text-[17px] font-bold',   action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
    { label: 'Heading 3', className: 'text-[15px] font-semibold',action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),active: editor.isActive('heading', { level: 3 }) },
    { label: 'Heading 4', className: 'text-[14px] font-semibold',action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),active: editor.isActive('heading', { level: 4 }) },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onMouseDown={e => { e.preventDefault(); setOpen(v => !v); }}
        className="flex h-7 items-center gap-1.5 rounded-md px-2 text-[12px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors min-w-[96px]"
      >
        <Type className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="flex-1 text-left">{label}</span>
        <ChevronDown className={cn('h-3 w-3 transition-transform flex-shrink-0', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 w-48 rounded-xl border border-border bg-card shadow-xl py-1.5 overflow-hidden">
          {options.map(opt => (
            <button
              key={opt.label}
              onMouseDown={e => { e.preventDefault(); opt.action(); setOpen(false); }}
              className={cn(
                'flex w-full items-center justify-between px-3 py-2 transition-colors hover:bg-accent',
                opt.active ? 'text-primary' : 'text-foreground',
                opt.className,
              )}
            >
              {opt.label}
              {opt.active && <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Font Size Picker ─────────────────────────────────────────────────────────

function FontSizePicker() {
  const sizes = [10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48];
  const [size, setSize] = useState(16);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onMouseDown={e => { e.preventDefault(); setOpen(v => !v); }}
        className="flex h-7 w-14 items-center justify-between gap-1 rounded-md px-2 text-[12px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
      >
        <span>{size}</span>
        <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 w-20 rounded-xl border border-border bg-card shadow-xl py-1.5 overflow-hidden max-h-52 overflow-y-auto">
          {sizes.map(s => (
            <button
              key={s}
              onMouseDown={e => { e.preventDefault(); setSize(s); setOpen(false); }}
              className={cn('flex w-full items-center justify-between px-3 py-1.5 text-[12px] transition-colors hover:bg-accent', size === s ? 'text-primary font-semibold' : 'text-foreground')}
            >
              {s}
              {size === s && <Check className="h-3 w-3 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Formatting Toolbar ───────────────────────────────────────────────────────

function FormattingToolbar({ editor }: { editor: any }) {
  if (!editor) return null;
  return (
    <div className="sticky top-12 z-40 flex flex-wrap items-center gap-0.5 border-b border-border bg-card px-3 py-1.5 min-h-[42px]">
      <HeadingPicker editor={editor} />
      <Sep />
      <FontSizePicker />
      <Sep />

      {/* Inline */}
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()}      active={editor.isActive('bold')}      title="Bold (⌘B)"><Bold className="h-3.5 w-3.5" /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()}    active={editor.isActive('italic')}    title="Italic (⌘I)"><Italic className="h-3.5 w-3.5" /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline (⌘U)"><UnderlineIcon className="h-3.5 w-3.5" /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()}    active={editor.isActive('strike')}    title="Strikethrough"><Strikethrough className="h-3.5 w-3.5" /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Highlight"><Highlighter className="h-3.5 w-3.5" /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()}      active={editor.isActive('code')}      title="Inline code"><Code className="h-3.5 w-3.5" /></ToolbarBtn>
      <Sep />

      {/* Alignment */}
      <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()}    active={editor.isActive({ textAlign: 'left' })}    title="Align left"><AlignLeft className="h-3.5 w-3.5" /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()}  active={editor.isActive({ textAlign: 'center' })}  title="Center"><AlignCenter className="h-3.5 w-3.5" /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('right').run()}   active={editor.isActive({ textAlign: 'right' })}   title="Align right"><AlignRight className="h-3.5 w-3.5" /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="Justify"><AlignJustify className="h-3.5 w-3.5" /></ToolbarBtn>
      <Sep />

      {/* Lists & blocks */}
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()}  active={editor.isActive('bulletList')}  title="Bullet list"><List className="h-3.5 w-3.5" /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list"><ListOrdered className="h-3.5 w-3.5" /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleTaskList().run()}    active={editor.isActive('taskList')}    title="Task list"><ListChecks className="h-3.5 w-3.5" /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}  title="Quote"><Quote className="h-3.5 w-3.5" /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()}  active={editor.isActive('codeBlock')}   title="Code block"><Code2 className="h-3.5 w-3.5" /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus className="h-3.5 w-3.5" /></ToolbarBtn>
      <Sep />

      {/* History */}
      <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (⌘Z)"><Undo className="h-3.5 w-3.5" /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (⌘⇧Z)"><Redo className="h-3.5 w-3.5" /></ToolbarBtn>
    </div>
  );
}

// ─── Ruler ────────────────────────────────────────────────────────────────────

function Ruler() {
  const marks = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="sticky top-[calc(3rem+56px)] z-30 h-4 border-b border-border bg-card flex-shrink-0 relative overflow-hidden select-none">
      
      <div
        className="absolute inset-x-0 bottom-0 flex items-end"
        style={{
          paddingLeft: 'calc(50% - 430px)',
          paddingRight: 'calc(50% - 430px)',
        }}
      >
        <div className="relative w-full border-b border-border/40 h-2">
          
          {marks.map((m, i) => (
            <div
              key={m}
              className="absolute flex flex-col items-center"
              style={{ left: `${(i / (marks.length - 1)) * 100}%` }}
            >
              <span className="text-[7px] text-muted-foreground/50 leading-none mb-0.5">
                {m}"
              </span>
              <div className="w-px h-1 bg-border/60" />
            </div>
          ))}

          {Array.from({ length: marks.length * 4 - 3 }, (_, i) => {
            if (i % 4 === 0) return null;
            return (
              <div
                key={i}
                className="absolute bottom-0 w-px h-0.5 bg-border/30"
                style={{
                  left: `${(i / ((marks.length - 1) * 4)) * 100}%`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function VerticalRuler() {
  const marks = Array.from({ length: 12 }, (_, i) => i); // inches

  return (
    <div className="sticky top-[84px] w-5 flex-shrink-0 border-r border-border bg-card relative">
      <div className="relative h-full">
        {marks.map((m, i) => (
          <div
            key={m}
            className="absolute left-0 flex items-center"
            style={{ top: `${(i / (marks.length - 1)) * 100}%` }}
          >
            <span className="text-[8px] text-muted-foreground/50 ml-1">
              {m}"
            </span>
            <div className="ml-1 w-2 h-px bg-border/60" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Selection Bubble ─────────────────────────────────────────────────────────

function SelectionBubble({ editor }: { editor: any }) {
  if (!editor) return null;
  return (
    <BubbleMenu editor={editor} tippyOptions={{ duration: 120, placement: 'top' }}
      className="flex items-center gap-0.5 rounded-xl border border-border bg-card/95 px-1.5 py-1.5 shadow-xl backdrop-blur-md"
    >
      {[
        { icon: Bold,          fn: () => editor.chain().focus().toggleBold().run(),      active: editor.isActive('bold'),      title: 'Bold'      },
        { icon: Italic,        fn: () => editor.chain().focus().toggleItalic().run(),    active: editor.isActive('italic'),    title: 'Italic'    },
        { icon: UnderlineIcon, fn: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline'), title: 'Underline' },
        { icon: Strikethrough, fn: () => editor.chain().focus().toggleStrike().run(),    active: editor.isActive('strike'),    title: 'Strike'    },
        { icon: Highlighter,   fn: () => editor.chain().focus().toggleHighlight().run(), active: editor.isActive('highlight'), title: 'Highlight' },
        { icon: Code,          fn: () => editor.chain().focus().toggleCode().run(),      active: editor.isActive('code'),      title: 'Code'      },
        { icon: Link,          fn: () => {},                                             active: false,                        title: 'Link'      },
      ].map(({ icon: Icon, fn, active, title }) => (
        <button key={title} onMouseDown={e => { e.preventDefault(); fn(); }} title={title}
          className={cn('flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground', active && 'bg-accent text-foreground')}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </BubbleMenu>
  );
}

// ─── Share Modal ──────────────────────────────────────────────────────────────

function ShareModal({ title, onClose }: { title: string; onClose: () => void }) {
  const [access, setAccess] = useState<AccessLevel>('team');
  const [copied, setCopied] = useState(false);
  const link = `https://crafterkite.io/docs/shared/abc123`;

  const copy = () => {
    navigator.clipboard?.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-[15px] font-semibold">Share "{title}"</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent transition-colors">
            <ChevronDown className="h-4 w-4 rotate-90" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {/* Access level */}
          <div className="grid grid-cols-3 gap-2">
            {([
              { val: 'private', icon: Lock,  label: 'Private' },
              { val: 'team',    icon: Users, label: 'Team'    },
              { val: 'public',  icon: Globe, label: 'Public'  },
            ] as { val: AccessLevel; icon: any; label: string }[]).map(({ val, icon: Icon, label }) => (
              <button key={val} onClick={() => setAccess(val)}
                className={cn('flex flex-col items-center gap-1.5 rounded-xl border py-3 transition-all text-[12px] font-medium',
                  access === val ? 'border-primary bg-primary/8 text-primary' : 'border-border text-muted-foreground hover:border-muted-foreground/50')}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Collaborators */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">People with access</p>
            {MOCK_COLLABORATORS.map(c => (
              <div key={c.id} className="flex items-center gap-3 rounded-lg px-3 py-2 bg-muted/20">
                <div className={cn('flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white', c.color)}>
                  {c.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground">{c.name}</p>
                </div>
                <span className="text-[11px] text-muted-foreground">Editor</span>
                {c.active && <div className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />}
              </div>
            ))}
          </div>

          {/* Copy link */}
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2">
            <span className="flex-1 text-[12px] font-mono text-muted-foreground truncate">{link}</span>
            <button onClick={copy}
              className={cn('flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-medium transition-all',
                copied ? 'bg-emerald-500/10 text-emerald-400' : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground')}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Export Menu ──────────────────────────────────────────────────────────────

function ExportMenu({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="absolute right-0 top-full mt-1 z-50 w-52 rounded-xl border border-border bg-card shadow-xl py-1.5 overflow-hidden">
      <p className="px-3 pt-1 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Download as</p>
      {EXPORT_FORMATS.map(fmt => (
        <button key={fmt.ext}
          onClick={() => { alert(`Exporting "${title}" as .${fmt.ext}`); onClose(); }}
          className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] text-foreground hover:bg-accent transition-colors"
        >
          <span className="text-base">{fmt.icon}</span>
          {fmt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Zoom Control ─────────────────────────────────────────────────────────────

function ZoomControl({ zoom, onChange }: { zoom: ZoomLevel; onChange: (z: ZoomLevel) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const idx = ZOOM_LEVELS.indexOf(zoom);

  return (
    <div ref={ref} className="relative flex items-center gap-1">
      <button onClick={() => onChange(ZOOM_LEVELS[Math.max(0, idx - 1)])}
        disabled={idx === 0}
        className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-30"
      >
        <ZoomOut className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex h-6 min-w-[52px] items-center justify-center gap-1 rounded-md px-2 text-[11.5px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
      >
        {zoom}%
      </button>
      <button onClick={() => onChange(ZOOM_LEVELS[Math.min(ZOOM_LEVELS.length - 1, idx + 1)])}
        disabled={idx === ZOOM_LEVELS.length - 1}
        className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-30"
      >
        <ZoomIn className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 z-50 w-24 rounded-xl border border-border bg-card shadow-xl py-1 overflow-hidden">
          {ZOOM_LEVELS.map(z => (
            <button key={z} onClick={() => { onChange(z); setOpen(false); }}
              className={cn('flex w-full items-center justify-between px-3 py-1.5 text-[12px] transition-colors hover:bg-accent', zoom === z ? 'text-primary font-semibold' : 'text-foreground')}
            >
              {z}%
              {zoom === z && <Check className="h-3 w-3 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Editor ──────────────────────────────────────────────────────────────

export default function DocumentEditor() {
  const params        = useParams();
  const documentId    = params.id as string;

  const [title, setTitle]           = useState('Untitled Document');
  const [isStarred, setIsStarred]   = useState(false);
  const [showShare, setShowShare]   = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [zoom, setZoom]             = useState<ZoomLevel>(100);
  const [isMounted, setIsMounted]   = useState(false);
  const exportRef                   = useRef<HTMLDivElement>(null);

  useEffect(() => { setIsMounted(true); }, []);

  // Auto-save simulation
  useEffect(() => {
    if (saveStatus !== 'unsaved') return;
    setSaveStatus('saving');
    const t = setTimeout(() => setSaveStatus('saved'), 1200);
    return () => clearTimeout(t);
  }, [saveStatus]);

  // Close export on outside click
  useEffect(() => {
    const h = (e: any) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setShowExport(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: false }),
      CharacterCount,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({
        placeholder: 'Start writing or type "/" for commands...',
        emptyEditorClass: 'before:content-[attr(data-placeholder)] before:text-muted-foreground/40 before:float-left before:h-0 before:pointer-events-none',
      }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: INITIAL_CONTENT,
    immediatelyRender: false,
    onUpdate: () => setSaveStatus('unsaved'),
    editorProps: {
      attributes: {
        class: [
          'prose prose-invert max-w-none focus:outline-none',
          'text-[15px] leading-[1.8] text-foreground/90',
          'prose-h1:text-3xl prose-h1:font-bold prose-h1:tracking-tight prose-h1:text-foreground prose-h1:mb-4 prose-h1:mt-8',
          'prose-h2:text-xl prose-h2:font-semibold prose-h2:tracking-tight prose-h2:text-foreground prose-h2:mb-3 prose-h2:mt-7',
          'prose-h3:text-lg prose-h3:font-semibold prose-h3:text-foreground prose-h3:mb-2 prose-h3:mt-5',
          'prose-p:text-foreground/85 prose-p:leading-[1.8] prose-p:mb-4',
          'prose-ul:text-foreground/85 prose-ol:text-foreground/85',
          'prose-li:mb-1.5',
          'prose-blockquote:border-l-[3px] prose-blockquote:border-primary/50 prose-blockquote:pl-5 prose-blockquote:text-muted-foreground prose-blockquote:italic prose-blockquote:not-italic:text-foreground',
          'prose-code:rounded-md prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[13px] prose-code:font-mono prose-code:border prose-code:border-border prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none',
          'prose-pre:rounded-xl prose-pre:bg-muted/60 prose-pre:border prose-pre:border-border prose-pre:text-[13px] prose-pre:p-5',
          'prose-hr:border-border prose-hr:my-6',
          'prose-strong:text-foreground prose-strong:font-semibold',
          'prose-a:text-primary prose-a:underline-offset-2',
        ].join(' '),
      },
    },
  });

  if (!isMounted) return null;

  const words = editor?.storage.characterCount?.words() ?? 0;
  const chars = editor?.storage.characterCount?.characters() ?? 0;

     return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* 1. Title bar */}
      <div className="flex h-12 flex-shrink-0 items-center justify-between border-b border-border bg-card px-4 gap-4 sticky top-0 z-50">
        {/* Left: breadcrumb + title */}
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 text-blue-400 flex-shrink-0" />
          <span className="text-[12.5px] text-muted-foreground flex-shrink-0">Docs</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 flex-shrink-0" />
          <input
            value={title}
            onChange={e => { setTitle(e.target.value); setSaveStatus('unsaved'); }}
            className="min-w-0 flex-1 max-w-xs bg-transparent text-[13.5px] font-semibold text-foreground focus:outline-none focus:bg-accent/50 rounded px-1.5 py-0.5 transition-colors truncate"
            placeholder="Untitled document"
          />
          <button
            onClick={() => setIsStarred(v => !v)}
            className="flex-shrink-0 rounded-md p-1 text-muted-foreground hover:bg-accent transition-colors"
            title={isStarred ? 'Unstar' : 'Star'}
          >
            {isStarred ? <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> : <StarOff className="h-4 w-4" />}
          </button>
        </div>

        {/* Center: save status */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {saveStatus === 'saved' && <div className="flex items-center gap-1.5 text-[11.5px] text-emerald-400"><Check className="h-3.5 w-3.5" /> Saved</div>}
          {saveStatus === 'saving' && <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground"><div className="h-3 w-3 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" /> Saving…</div>}
          {saveStatus === 'unsaved' && <div className="text-[11.5px] text-amber-400">Unsaved changes</div>}
        </div>

        {/* Right: actions */}
<div className="flex items-center gap-1.5 flex-shrink-0">

  {/* Collaborators */}
  <div className="flex items-center -space-x-2 mr-2">
    {MOCK_COLLABORATORS.slice(0, 3).map((c) => (
      <div
        key={c.id}
        className={cn(
          "h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-background",
          c.color
        )}
        title={c.name}
      >
        {c.initials}
      </div>
    ))}

    <button
      className="h-7 w-7 rounded-full border border-border bg-muted text-muted-foreground hover:bg-accent transition"
      title="Add collaborator"
    >
      +
    </button>
  </div>

  {/* Divider */}
  <div className="h-5 w-px bg-border mx-1" />

  {/* Find */}
  <button
    onClick={() => window.find?.('')}
    className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition"
    title="Find"
  >
    <Search className="h-4 w-4" />
  </button>

  {/* Version History */}
  <button
    onClick={() => alert('Open version history')}
    className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition"
    title="Version history"
  >
    <History className="h-4 w-4" />
  </button>

  {/* Info */}
  <button
    onClick={() => alert('Open document info')}
    className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition"
    title="Document info"
  >
    <Info className="h-4 w-4" />
  </button>

  {/* Share */}
  <button
    onClick={() => setShowShare(true)}
    className="h-8 w-8 flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
    title="Share"
  >
    <Share2 className="h-4 w-4" />
  </button>

</div>
      </div>

      {/* Formatting Toolbar */}
      <FormattingToolbar editor={editor} />

      {/* Ruler */}
      <Ruler />

                {/* 5. Selection bubble */}
      {/* {editor && <SelectionBubble editor={editor} />} */}

      {/* 6. Editor canvas */}
      <div className="flex-1 flex overflow-hidden bg-muted/20">
  {/* Vertical ruler */}
  <VerticalRuler />

  {/* Scrollable canvas */}
  <div className="flex-1 overflow-auto p-6">
    <div
      className="mx-auto shadow-2xl bg-card border border-border rounded-sm"
      style={{ width: `${zoom}%`, maxWidth: '860px', minWidth: '480px' }}
    >
      <div
        className="px-16 py-14 min-h-[1056px]"
        onClick={() => editor?.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  </div>
</div>

      {/* 7. Status bar */}
      <div className="sticky bottom-0 z-40 flex h-10 flex-shrink-0 items-center justify-between border-t border-border bg-card/95 backdrop-blur px-4 text-xs">
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>
            {editor ? editor.getText().trim().split(/\s+/).filter(Boolean).length : 0} words
          </span>
          <span>
            {editor ? editor.getText().length : 0} characters
          </span>
          <span>
            {editor
              ? Math.max(
                  1,
                  Math.ceil(
                    editor.getText().trim().split(/\s+/).filter(Boolean).length / 500
                  )
                )
              : 1}{' '}
            pages
          </span>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>English (US)</span>
          <span>Spellcheck: On</span>
          <select
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value) as ZoomLevel)}
            className="bg-transparent outline-none"
          >
            <option value={50}>50%</option>
            <option value={75}>75%</option>
            <option value={100}>100%</option>
            <option value={125}>125%</option>
            <option value={150}>150%</option>
          </select>
        </div>
      </div>

      {/* Share modal */}
      {showShare && <ShareModal title={title} onClose={() => setShowShare(false)} />}
    </div>
  );
}