'use client';

import React from 'react';
import { Editor } from '@tiptap/react';

export default function DocsStatusBar({
  editor,
}: {
  editor: Editor | null;
}) {
  if (!editor) return null;

  const text = editor.getText();

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;

  // basic page estimate (you can improve later)
  const wordsPerPage = 500;
  const pages = Math.max(1, Math.ceil(words / wordsPerPage));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background px-4 py-2 text-xs flex items-center justify-between">
      
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4 text-muted-foreground">
        <span>{words} words</span>
        <span>{characters} characters</span>
        <span>{pages} page{pages > 1 ? 's' : ''}</span>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 text-muted-foreground">
        <span>English (US)</span>
        <span>Spellcheck: On</span>
        <span>100%</span>
      </div>

    </div>
  );
}