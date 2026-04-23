'use client';

import { Button } from '@/components/ui/button';
import { Editor } from '@tiptap/react';

export default function ToolbarButton({
  action,
  editor,
}: {
  action: any;
  editor: Editor | null;
}) {
  const active = action.isActive?.(editor);
  const disabled = action.canRun ? !action.canRun(editor) : !editor;

  return (
    <Button
      variant={active ? 'default' : 'ghost'}
      size="icon"
      disabled={disabled}
      onClick={() => action.run?.(editor)}
      title={action.label}
    >
      {action.icon}
    </Button>
  );
}