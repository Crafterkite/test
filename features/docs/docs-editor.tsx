'use client'

import EditorCore from '../editor/editor-core'

export default function DocsEditor({
  documentId,
}: {
  documentId: string
}) {
  return (
    <div className="p-6">
      <EditorCore documentId={documentId} />
    </div>
  )
}