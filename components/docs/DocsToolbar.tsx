'use client';

import React from 'react';
import DocsMenubar from '@/components/docs/DocsMenubar';
import ToolbarButton from './ToolbarButton';

import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Code,
  Link,
  Image as ImageIcon,
  Undo,
  Redo,
} from 'lucide-react';

import { Editor } from '@tiptap/react';

/* ----------------------------- */
/* TYPES */
/* ----------------------------- */

export type DocType = 'docs' | 'sheets' | 'slides' | string;

type Action = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  run?: (editor: Editor) => void;
  isActive?: (editor: Editor) => boolean;
  canRun?: (editor: Editor) => boolean;
};

/* ----------------------------- */
/* SAFE HELPERS */
/* ----------------------------- */

const safeRun = (editor: Editor | null, fn?: (e: Editor) => void) => {
  if (!editor || !fn) return;
  fn(editor);
};

const safeCan = (editor: Editor | null, fn?: (e: Editor) => boolean) => {
  if (!editor || !fn) return false;
  try {
    return fn(editor);
  } catch {
    return false;
  }
};

const safeActive = (editor: Editor | null, fn?: (e: Editor) => boolean) => {
  if (!editor || !fn) return false;
  try {
    return fn(editor);
  } catch {
    return false;
  }
};

/* ----------------------------- */
/* ACTIONS */
/* ----------------------------- */

const actions: Action[] = [
  {
    id: 'undo',
    label: 'Undo',
    icon: <Undo className="h-4 w-4" />,
    run: (e) => e.chain().focus().undo().run(),
    canRun: (e) => e.can().undo(),
  },
  {
    id: 'redo',
    label: 'Redo',
    icon: <Redo className="h-4 w-4" />,
    run: (e) => e.chain().focus().redo().run(),
    canRun: (e) => e.can().redo(),
  },
  {
    id: 'bold',
    label: 'Bold',
    icon: <Bold className="h-4 w-4" />,
    run: (e) => e.chain().focus().toggleBold().run(),
    isActive: (e) => e.isActive('bold'),
  },
  {
    id: 'italic',
    label: 'Italic',
    icon: <Italic className="h-4 w-4" />,
    run: (e) => e.chain().focus().toggleItalic().run(),
    isActive: (e) => e.isActive('italic'),
  },
  {
    id: 'strike',
    label: 'Strikethrough',
    icon: <Strikethrough className="h-4 w-4" />,
    run: (e) => e.chain().focus().toggleStrike().run(),
    isActive: (e) => e.isActive('strike'),
  },
  {
    id: 'bullet',
    label: 'Bullet List',
    icon: <List className="h-4 w-4" />,
    run: (e) => e.chain().focus().toggleBulletList().run(),
    isActive: (e) => e.isActive('bulletList'),
  },
  {
    id: 'ordered',
    label: 'Ordered List',
    icon: <ListOrdered className="h-4 w-4" />,
    run: (e) => e.chain().focus().toggleOrderedList().run(),
    isActive: (e) => e.isActive('orderedList'),
  },
  {
    id: 'code',
    label: 'Code Block',
    icon: <Code className="h-4 w-4" />,
    run: (e) => e.chain().focus().toggleCodeBlock().run(),
  },
  {
    id: 'link',
    label: 'Link',
    icon: <Link className="h-4 w-4" />,
    run: (e) => {
      const url = window.prompt('Enter URL');
      if (url) e.chain().focus().setLink({ href: url }).run();
    },
  },
  {
    id: 'image',
    label: 'Image',
    icon: <ImageIcon className="h-4 w-4" />,
    run: (e) => {
      const url = window.prompt('Image URL');
      if (url) e.chain().focus().setImage({ src: url }).run();
    },
  },
];

/* ----------------------------- */
/* COMPONENT */
/* ----------------------------- */

export default function DocsToolbar({
  editor,
  title,
  setTitle,
  type = 'docs',
}: {
  editor: Editor | null;
  title: string;
  setTitle: (v: string) => void;
  type?: DocType;
}) {
  return (
    <div className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-sm font-medium bg-transparent outline-none border-b border-transparent focus:border-border"
          placeholder="Untitled Document"
        />
        <div className="text-xs text-muted-foreground">
          {type.toUpperCase()}
        </div>
      </div>

      {/* MENUBAR (PUT THIS BACK) */}
      <DocsMenubar editor={editor} />

      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-t">
        {actions.map((action) => (
          <ToolbarButton key={action.id} action={action} editor={editor} />
        ))}
      </div>
    </div>
  );
}