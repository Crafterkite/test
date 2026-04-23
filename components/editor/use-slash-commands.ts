'use client';

import { useState } from 'react';

export type SlashCommand = {
  label: string;
  description: string;
  action: (editor: any) => void;
};

export const SLASH_COMMANDS: SlashCommand[] = [
  {
    label: 'Heading 1',
    description: 'Large section heading',
    action: (editor) => editor.format('h1'),
  },
  {
    label: 'Heading 2',
    description: 'Medium section heading',
    action: (editor) => editor.format('h2'),
  },
  {
    label: 'Bullet List',
    description: 'Create a simple list',
    action: (editor) => editor.format('ul'),
  },
  {
    label: 'Numbered List',
    description: 'Create an ordered list',
    action: (editor) => editor.format('ol'),
  },
  {
    label: 'Divider',
    description: 'Insert a horizontal divider',
    action: (editor) => editor.insertDivider(),
  },
];

export function useSlashCommands() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const filtered = SLASH_COMMANDS.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent, editor: any) => {
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndex(i => (i + 1) % filtered.length);
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndex(i => (i - 1 + filtered.length) % filtered.length);
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      filtered[index]?.action(editor);
      setOpen(false);
      setQuery('');
    }

    if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const handleInput = () => {
    const selection = window.getSelection();
    if (!selection?.anchorNode) return;

    const text = selection.anchorNode.textContent || '';
    const slashIndex = text.lastIndexOf('/');

    if (slashIndex !== -1) {
      const q = text.slice(slashIndex + 1);
      setQuery(q);
      setOpen(true);

      const rect = selection.getRangeAt(0).getBoundingClientRect();
      setPosition({ x: rect.left, y: rect.bottom });
    } else {
      setOpen(false);
    }
  };

  return {
    open,
    query,
    index,
    position,
    filtered,
    handleKeyDown,
    handleInput,
    close: () => setOpen(false),
  };
}