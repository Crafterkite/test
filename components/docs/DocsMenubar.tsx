'use client';

import React from 'react';
import { Editor } from '@tiptap/react';

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

/* ---------------------------------- */
/* SAFE HELPER (you were missing this) */
/* ---------------------------------- */
const safeRun = (editor: Editor | null, fn?: (e: Editor) => void) => {
  if (!editor || !fn) return;
  fn(editor);
};

/* ---------------------------------- */
/* MENUBAR COMPONENT */
/* ---------------------------------- */
export default function DocsMenubar({
  editor,
}: {
  editor: Editor | null;
}) {
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