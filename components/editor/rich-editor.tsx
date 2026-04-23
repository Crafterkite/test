'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import CharacterCount from '@tiptap/extension-character-count';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { SlashCommand } from './extensions/slash-command';
import { slashItems } from './slash-items';
import { cn } from '@/lib/utils';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, ListChecks, Quote, Code, Code2,
  Heading1, Heading2, Heading3, Minus, Undo, Redo,
  Highlighter, Link, Type, ChevronDown,
  MoreHorizontal, Eye, EyeOff, Maximize2, Minimize2,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
  className?: string;
}

// ─── ToolbarButton ────────────────────────────────────────────────────────────

function ToolbarBtn({ onClick, active, disabled, title, children, className }: ToolbarButtonProps) {
  return (
    <button
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-all duration-100',
        'hover:bg-accent hover:text-foreground',
        'disabled:pointer-events-none disabled:opacity-30',
        active && 'bg-accent text-foreground',
        className,
      )}
    >
      {children}
    </button>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

function Divider() {
  return <div className="h-5 w-px bg-border flex-shrink-0" />;
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

function Toolbar({ editor }: { editor: any }) {
  const [headingOpen, setHeadingOpen] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (headingRef.current && !headingRef.current.contains(e.target as Node))
        setHeadingOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!editor) return null;

  const activeHeading = [1, 2, 3].find(l => editor.isActive('heading', { level: l }));
  const headingLabel = activeHeading ? `H${activeHeading}` : 'Text';

  return (
    <div className="sticky top-0 z-30 flex flex-wrap items-center gap-0.5 border-b border-border bg-card/95 px-3 py-2 backdrop-blur-md">

      {/* Heading picker */}
      <div ref={headingRef} className="relative">
        <button
          onMouseDown={e => { e.preventDefault(); setHeadingOpen(v => !v); }}
          className="flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[12px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <Type className="h-3.5 w-3.5" />
          <span className="min-w-[32px]">{headingLabel}</span>
          <ChevronDown className={cn('h-3 w-3 transition-transform', headingOpen && 'rotate-180')} />
        </button>
        {headingOpen && (
          <div className="absolute left-0 top-full mt-1 z-50 w-40 rounded-xl border border-border bg-card shadow-xl py-1 overflow-hidden">
            {[
              { label: 'Paragraph', action: () => editor.chain().focus().setParagraph().run(), active: editor.isActive('paragraph') },
              { label: 'Heading 1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
              { label: 'Heading 2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
              { label: 'Heading 3', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
            ].map(item => (
              <button
                key={item.label}
                onMouseDown={e => { e.preventDefault(); item.action(); setHeadingOpen(false); }}
                className={cn(
                  'flex w-full items-center px-3 py-2 text-[13px] transition-colors hover:bg-accent',
                  item.active ? 'text-primary font-semibold' : 'text-foreground',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <Divider />

      {/* Inline formatting */}
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold (⌘B)">
        <Bold className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (⌘I)">
        <Italic className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline (⌘U)">
        <UnderlineIcon className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
        <Strikethrough className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Highlight">
        <Highlighter className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code">
        <Code className="h-3.5 w-3.5" />
      </ToolbarBtn>

      <Divider />

      {/* Alignment */}
      <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align left">
        <AlignLeft className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align center">
        <AlignCenter className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align right">
        <AlignRight className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="Justify">
        <AlignJustify className="h-3.5 w-3.5" />
      </ToolbarBtn>

      <Divider />

      {/* Lists & structure */}
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
        <List className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
        <ListOrdered className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive('taskList')} title="Task list">
        <ListChecks className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote">
        <Quote className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block">
        <Code2 className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
        <Minus className="h-3.5 w-3.5" />
      </ToolbarBtn>

      <Divider />

      {/* History */}
      <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (⌘Z)">
        <Undo className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (⌘⇧Z)">
        <Redo className="h-3.5 w-3.5" />
      </ToolbarBtn>
    </div>
  );
}

// ─── Bubble menu (selection toolbar) ─────────────────────────────────────────

function SelectionBubble({ editor }: { editor: any }) {
  if (!editor) return null;
  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 150, placement: 'top' }}
      className="flex items-center gap-0.5 rounded-xl border border-border bg-card/95 px-1.5 py-1.5 shadow-xl backdrop-blur-md"
    >
      {[
        { icon: Bold,            action: () => editor.chain().focus().toggleBold().run(),      active: editor.isActive('bold'),      title: 'Bold'      },
        { icon: Italic,          action: () => editor.chain().focus().toggleItalic().run(),    active: editor.isActive('italic'),    title: 'Italic'    },
        { icon: UnderlineIcon,   action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline'), title: 'Underline' },
        { icon: Strikethrough,   action: () => editor.chain().focus().toggleStrike().run(),    active: editor.isActive('strike'),    title: 'Strike'    },
        { icon: Highlighter,     action: () => editor.chain().focus().toggleHighlight().run(), active: editor.isActive('highlight'), title: 'Highlight' },
        { icon: Code,            action: () => editor.chain().focus().toggleCode().run(),      active: editor.isActive('code'),      title: 'Code'      },
      ].map(({ icon: Icon, action, active, title }) => (
        <button
          key={title}
          onMouseDown={e => { e.preventDefault(); action(); }}
          title={title}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
            active && 'bg-accent text-foreground'
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </BubbleMenu>
  );
}

// ─── Status bar ───────────────────────────────────────────────────────────────

function StatusBar({ editor, readOnly, onToggleReadOnly, onToggleFocus, focusMode }: {
  editor: any;
  readOnly: boolean;
  onToggleReadOnly: () => void;
  onToggleFocus: () => void;
  focusMode: boolean;
}) {
  if (!editor) return null;
  const words = editor.storage.characterCount?.words() ?? 0;
  const chars = editor.storage.characterCount?.characters() ?? 0;

  return (
    <div className="sticky bottom-0 z-30 flex flex-shrink-0 items-center justify-between border-t border-border bg-card/95 px-4 py-2 backdrop-blur-md">
      <div className="flex items-center gap-4 text-[11.5px] text-muted-foreground">
        <span><span className="font-semibold text-foreground">{words}</span> words</span>
        <span><span className="font-semibold text-foreground">{chars}</span> characters</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleReadOnly}
          title={readOnly ? 'Switch to editing' : 'Preview mode'}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          {readOnly ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          {readOnly ? 'Preview' : 'Editing'}
        </button>
        <button
          onClick={onToggleFocus}
          title={focusMode ? 'Exit focus mode' : 'Focus mode'}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          {focusMode ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          {focusMode ? 'Exit Focus' : 'Focus'}
        </button>
      </div>
    </div>
  );
}

// ─── Main Editor ──────────────────────────────────────────────────────────────

export default function RichEditor() {
  const [readOnly, setReadOnly]     = useState(false);
  const [focusMode, setFocusMode]   = useState(false);
  const [isMounted, setIsMounted]   = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

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
        placeholder: 'Type "/" for commands, or start writing...',
        emptyEditorClass: [
          'before:content-[attr(data-placeholder)]',
          'before:text-muted-foreground/50',
          'before:float-left',
          'before:h-0',
          'before:pointer-events-none',
          'before:text-base',
        ].join(' '),
      }),
      SlashCommand.configure({
        suggestion: {
          items: ({ query }: any) =>
            slashItems.filter(item =>
              item.title.toLowerCase().includes(query.toLowerCase())
            ),
          render: () => {
            let container: HTMLDivElement | null = null;
            let selectedIndex = 0;

            const getItems = () =>
              Array.from(container?.querySelectorAll<HTMLElement>('[data-slash-item]') ?? []);

            const highlight = () => {
              getItems().forEach((el, i) => {
                el.classList.toggle('bg-accent', i === selectedIndex);
                el.classList.toggle('text-foreground', i === selectedIndex);
              });
            };

            return {
              onStart(props: any) {
                container = document.createElement('div');
                container.className = [
                  'fixed z-[9999] min-w-[220px] rounded-xl border border-border',
                  'bg-card/95 backdrop-blur-md shadow-2xl py-1.5 overflow-hidden',
                ].join(' ');
                document.body.appendChild(container);
                selectedIndex = 0;
                renderItems(props);
              },

              onUpdate(props: any) {
                selectedIndex = 0;
                renderItems(props);
              },

              onKeyDown(props: any) {
                const items = getItems();
                if (props.event.key === 'ArrowDown') {
                  selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                  highlight(); return true;
                }
                if (props.event.key === 'ArrowUp') {
                  selectedIndex = Math.max(selectedIndex - 1, 0);
                  highlight(); return true;
                }
                if (props.event.key === 'Enter') {
                  items[selectedIndex]?.click(); return true;
                }
                if (props.event.key === 'Escape') {
                  container?.remove(); container = null; return true;
                }
                return false;
              },

              onExit() {
                container?.remove(); container = null;
              },
            };

            function renderItems(props: any) {
              if (!container) return;
              container.innerHTML = '';

              if (props.items.length === 0) {
                const empty = document.createElement('p');
                empty.className = 'px-3 py-2 text-[12px] text-muted-foreground';
                empty.textContent = 'No commands found';
                container.appendChild(empty);
              } else {
                // Group label
                const label = document.createElement('p');
                label.className = 'px-3 pt-1 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground';
                label.textContent = 'Commands';
                container.appendChild(label);

                props.items.forEach((item: any, i: number) => {
                  const el = document.createElement('div');
                  el.setAttribute('data-slash-item', '');
                  el.className = [
                    'flex items-center gap-2.5 mx-1 px-2.5 py-2 rounded-lg',
                    'cursor-pointer text-[13px] text-muted-foreground transition-colors',
                    i === selectedIndex ? 'bg-accent text-foreground' : '',
                  ].join(' ');

                  const iconWrap = document.createElement('span');
                  iconWrap.className = 'flex h-6 w-6 items-center justify-center rounded-md bg-muted text-muted-foreground text-[11px] flex-shrink-0';
                  iconWrap.textContent = item.icon ?? '◆';

                  const text = document.createElement('span');
                  text.textContent = item.title;

                  el.appendChild(iconWrap);
                  el.appendChild(text);

                  el.onmouseenter = () => { selectedIndex = i; highlight(); };
                  el.onclick = () => { item.command(props.editor); container?.remove(); container = null; };

                  container.appendChild(el);
                });
              }

              // Position
              const { from } = props.range;
              const coords = props.editor.view.coordsAtPos(from);
              const containerEl = container as HTMLDivElement;

              // Clamp to viewport
              const menuHeight = Math.min(props.items.length * 40 + 40, 320);
              const spaceBelow = window.innerHeight - coords.bottom;
              const top = spaceBelow > menuHeight
                ? coords.bottom + 6
                : coords.top - menuHeight - 6;

              containerEl.style.left = `${Math.min(coords.left, window.innerWidth - 240)}px`;
              containerEl.style.top  = `${top}px`;
            }
          },
        },
      }),
    ],
    content: '',
    immediatelyRender: false,
    editable: !readOnly,
    editorProps: {
      attributes: {
        class: [
          'prose prose-invert max-w-none focus:outline-none',
          'text-[15px] leading-[1.75] text-foreground/90',
          // Headings
          'prose-h1:text-2xl prose-h1:font-bold prose-h1:tracking-tight prose-h1:text-foreground prose-h1:mb-4 prose-h1:mt-8',
          'prose-h2:text-xl prose-h2:font-semibold prose-h2:tracking-tight prose-h2:text-foreground prose-h2:mb-3 prose-h2:mt-6',
          'prose-h3:text-lg prose-h3:font-semibold prose-h3:text-foreground prose-h3:mb-2 prose-h3:mt-5',
          // Paragraphs
          'prose-p:text-foreground/85 prose-p:leading-[1.75] prose-p:mb-3',
          // Lists
          'prose-ul:text-foreground/85 prose-ol:text-foreground/85',
          'prose-li:mb-1',
          // Blockquote
          'prose-blockquote:border-l-2 prose-blockquote:border-primary/40 prose-blockquote:pl-4 prose-blockquote:text-muted-foreground prose-blockquote:italic',
          // Code
          'prose-code:rounded-md prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[13px] prose-code:font-mono prose-code:text-foreground prose-code:border prose-code:border-border',
          'prose-pre:rounded-xl prose-pre:bg-muted/60 prose-pre:border prose-pre:border-border prose-pre:text-[13px]',
          // HR
          'prose-hr:border-border',
          // Strong / em
          'prose-strong:text-foreground prose-strong:font-semibold',
          'prose-em:text-foreground/80',
        ].join(' '),
      },
    },
  });

  // Sync editable state
  useEffect(() => {
    if (editor) editor.setEditable(!readOnly);
  }, [editor, readOnly]);

  // Focus mode: close on Escape
  useEffect(() => {
    if (!focusMode) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setFocusMode(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [focusMode]);

  if (!isMounted || !editor) return null;

  return (
    <>
      {/* ── Focus mode overlay ── */}
      {focusMode && (
        <div
          className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm"
          onClick={() => setFocusMode(false)}
        />
      )}

      {/* ── Editor shell ── */}
     <div
  className={cn(
    'flex flex-col h-full rounded-xl border border-border bg-card',
          focusMode
            ? 'fixed inset-8 z-50 shadow-2xl'
            : 'w-full min-h-[520px]',
        )}
      >
        {/* Toolbar */}
        {!readOnly && <Toolbar editor={editor} />}

        {/* Read-only banner */}
        {readOnly && (
          <div className="flex items-center justify-between border-b border-border bg-amber-500/5 px-4 py-2.5">
            <div className="flex items-center gap-2 text-[12.5px] text-amber-400">
              <Eye className="h-3.5 w-3.5" />
              <span className="font-medium">Preview mode — document is read-only</span>
            </div>
            <button
              onClick={() => setReadOnly(false)}
              className="rounded-md px-2.5 py-1 text-[12px] font-medium text-amber-400 hover:bg-amber-500/10 transition-colors"
            >
              Edit
            </button>
          </div>
        )}

        {/* Bubble menu */}
        <SelectionBubble editor={editor} />

      {/* Editor content */}
<div
  className="flex-1 overflow-y-auto cursor-text flex justify-center bg-muted/20"
  onClick={() => { if (!readOnly) editor.commands.focus(); }}
>
  <div
    className={cn(
      'w-full my-10 flex justify-center transition-all',
      focusMode ? 'max-w-[900px]' : 'max-w-[1100px]' // wider default
    )}
  >
    {/* Paper */}
    <div
      className={cn(
        'w-full bg-card border border-border shadow-xl rounded-lg',
        'min-h-[1100px] px-20 py-16' // true "document" feel
      )}
    >
      <EditorContent editor={editor} />
    </div>
  </div>
</div>

{/* Status bar */}
<div className="sticky bottom-0 z-10">
  <StatusBar
    editor={editor}
    readOnly={readOnly}
    onToggleReadOnly={() => setReadOnly(v => !v)}
    onToggleFocus={() => setFocusMode(v => !v)}
    focusMode={focusMode}
  />
</div>

      </div> 
    </>       
  );
}