'use client';

import DocsMenubar from './DocsMenubar';
import ToolbarButton from './ToolbarButton';

import React from 'react';
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

import { Button } from '@/components/ui/button';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarCheckboxItem,
} from '@/components/ui/menubar';

import { Editor } from '@tiptap/react';

/* -------------------------------------------------- */
/* PLUGIN SYSTEM */
/* -------------------------------------------------- */

type Action = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  run?: (editor: Editor) => void;
  isActive?: (editor: Editor) => boolean;
  canRun?: (editor: Editor) => boolean;
  menu?: 'file' | 'edit' | 'view' | 'insert' | 'format' | 'tools' | 'help';
};

type Plugin = {
  id: string;
  supports: DocType[];
  actions: Action[];
};

/* -------------------------------------------------- */
/* SAFE HELPERS */
/* -------------------------------------------------- */

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

/* -------------------------------------------------- */
/* CORE PLUGINS */
/* -------------------------------------------------- */

const corePlugins: Plugin[] = [
  {
    id: 'history',
    supports: ['docs'],
    actions: [
      {
        id: 'undo',
        label: 'Undo',
        icon: <Undo className="h-4 w-4" />,
        run: (e) => e.chain().focus().undo().run(),
        canRun: (e) => e.can().undo(),
        menu: 'edit',
      },
      {
        id: 'redo',
        label: 'Redo',
        icon: <Redo className="h-4 w-4" />,
        run: (e) => e.chain().focus().redo().run(),
        canRun: (e) => e.can().redo(),
        menu: 'edit',
      },
    ],
  },
  {
    id: 'formatting',
    supports: ['docs'],
    actions: [
      {
        id: 'bold',
        label: 'Bold',
        icon: <Bold className="h-4 w-4" />,
        run: (e) => e.chain().focus().toggleBold().run(),
        isActive: (e) => e.isActive('bold'),
        menu: 'format',
      },
      {
        id: 'italic',
        label: 'Italic',
        icon: <Italic className="h-4 w-4" />,
        run: (e) => e.chain().focus().toggleItalic().run(),
        isActive: (e) => e.isActive('italic'),
        menu: 'format',
      },
      {
        id: 'strike',
        label: 'Strikethrough',
        icon: <Strikethrough className="h-4 w-4" />,
        run: (e) => e.chain().focus().toggleStrike().run(),
        isActive: (e) => e.isActive('strike'),
        menu: 'format',
      },
    ],
  },
  {
    id: 'lists',
    supports: ['docs'],
    actions: [
      {
        id: 'bullet',
        label: 'Bullet List',
        icon: <List className="h-4 w-4" />,
        run: (e) => e.chain().focus().toggleBulletList().run(),
        isActive: (e) => e.isActive('bulletList'),
        menu: 'format',
      },
      {
        id: 'ordered',
        label: 'Ordered List',
        icon: <ListOrdered className="h-4 w-4" />,
        run: (e) => e.chain().focus().toggleOrderedList().run(),
        isActive: (e) => e.isActive('orderedList'),
        menu: 'format',
      },
    ],
  },
  {
    id: 'insert',
    supports: ['docs'],
    actions: [
      {
        id: 'code',
        label: 'Code Block',
        icon: <Code className="h-4 w-4" />,
        run: (e) => e.chain().focus().toggleCodeBlock().run(),
        menu: 'insert',
      },
      {
        id: 'link',
        label: 'Link',
        icon: <Link className="h-4 w-4" />,
        run: (e) => {
          const url = window.prompt('Enter URL');
          if (url) e.chain().focus().setLink({ href: url }).run();
        },
        menu: 'insert',
      },
      {
        id: 'image',
        label: 'Image',
        icon: <ImageIcon className="h-4 w-4" />,
        run: (e) => {
          const url = window.prompt('Image URL');
          if (url) e.chain().focus().setImage({ src: url }).run();
        },
        menu: 'insert',
      },
    ],
  },
];

/* -------------------------------------------------- */
/* PLUGIN RESOLVER */
/* -------------------------------------------------- */

function getActions(type: DocType): Action[] {
  return corePlugins
    .filter((p) => p.supports.includes(type))
    .flatMap((p) => p.actions);
}

/* -------------------------------------------------- */
/* MENUBAR BUILDER */
/* -------------------------------------------------- */

function DocsMenubar({ editor }: { editor: Editor | null }) {
  // Added the missing `return` statement below.
  return (
    <Menubar className="border-none bg-transparent px-2 h-10">
      {/* File */}
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Document</MenubarItem>
          <MenubarItem>Open...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Save</MenubarItem>
          <MenubarItem>Save As...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Import...</MenubarItem>
          <MenubarItem>Export as PDF</MenubarItem>
          <MenubarItem>Export as DOCX</MenubarItem>
          <MenubarItem>Export as Markdown</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem className="text-destructive">Close</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Edit */}
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => safeRun(editor, e => e.chain().focus().undo().run())}>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => safeRun(editor, e => e.chain().focus().redo().run())}>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => safeRun(editor, e => e.chain().focus().selectAll().run())}>
            Select All <MenubarShortcut>⌘A</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Find...</MenubarItem>
          <MenubarItem>Replace...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* View */}
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked>Show Toolbar</MenubarCheckboxItem>
          <MenubarCheckboxItem>Show Sidebar</MenubarCheckboxItem>
          <MenubarCheckboxItem>Show Status Bar</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem>Zoom In</MenubarItem>
          <MenubarItem>Zoom Out</MenubarItem>
          <MenubarItem>Reset Zoom</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Full Screen</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Insert */}
      <MenubarMenu>
        <MenubarTrigger>Insert</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Image...</MenubarItem>
          <MenubarItem>Table</MenubarItem>
          <MenubarItem>Link...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Code Block</MenubarItem>
          <MenubarItem>Horizontal Rule</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Template</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Creative Brief</MenubarItem>
              <MenubarItem>Brand Guidelines</MenubarItem>
              <MenubarItem>Client Contract</MenubarItem>
              <MenubarItem>Project Timeline</MenubarItem>
              <MenubarItem>Meeting Notes</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>

      {/* Format */}
      <MenubarMenu>
        <MenubarTrigger>Format</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => safeRun(editor, e => e.chain().focus().toggleBold().run())}>
            Bold <MenubarShortcut>⌘B</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => safeRun(editor, e => e.chain().focus().toggleItalic().run())}>
            Italic <MenubarShortcut>⌘I</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>Underline</MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => safeRun(editor, e => e.chain().focus().toggleBulletList().run())}>
            Bullet List
          </MenubarItem>
          <MenubarItem onClick={() => safeRun(editor, e => e.chain().focus().toggleOrderedList().run())}>
            Numbered List
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Align Left</MenubarItem>
          <MenubarItem>Align Center</MenubarItem>
          <MenubarItem>Align Right</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Clear Formatting</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Tools */}
      <MenubarMenu>
        <MenubarTrigger>Tools</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Word Count</MenubarItem>
          <MenubarItem>Spelling & Grammar</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Insert Signature</MenubarItem>
          <MenubarItem>Manage Signatures</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Export Options...</MenubarItem>
          <MenubarItem>Version History</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Help */}
      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Crafterkite Help Center</MenubarItem>
          <MenubarItem>Keyboard Shortcuts</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>About Crafterkite Docs</MenubarItem>
          <MenubarItem>Release Notes</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

/* -------------------------------------------------- */
/* MAIN TOOLBAR */
/* -------------------------------------------------- */

export default function DocsToolbar({
  editor,
  title,
  setTitle,
  type = 'docs',
}) {
  const actions = getActions(type);

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

      {/* MENUBAR */}
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