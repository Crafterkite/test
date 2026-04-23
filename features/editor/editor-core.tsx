'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useCollab } from './use-collab'
import { ySyncPlugin, yCursorPlugin, yUndoPlugin } from 'y-prosemirror'

export default function EditorCore({
  documentId,
}: {
  documentId: string
}) {
  const { ydoc, provider } = useCollab(documentId)

  const yXmlFragment = ydoc.getXmlFragment('content')

 const editor = useEditor({
  extensions: [StarterKit],

  onCreate({ editor }) {
    editor.registerPlugin(ySyncPlugin(yXmlFragment))
    editor.registerPlugin(yCursorPlugin(provider.awareness))
    editor.registerPlugin(yUndoPlugin())
  },

  editorProps: {
    attributes: {
      class: 'prose prose-sm max-w-none focus:outline-none',
    },
  },

  immediatelyRender: false,
})

  if (!editor) return null

  return (
    <div className="prose prose-sm max-w-none">
      <EditorContent editor={editor} />
    </div>
  )
}