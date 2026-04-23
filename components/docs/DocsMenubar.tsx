'use client';

import React from 'react';
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

export default function DocsMenubar({ editor }: { editor: Editor | null }) {
  return (
    <Menubar className="border-none bg-transparent px-2 h-10">
      {/* keep your existing menu content exactly as-is */}
    </Menubar>
  );
}