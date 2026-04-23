import { useMemo } from 'react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

export function useCollab(documentId: string, token?: string) {
  const ydoc = useMemo(() => new Y.Doc(), [])

  const provider = useMemo(() => {
    return new WebsocketProvider(
      'ws://localhost:1234',
      documentId,
      ydoc,
      {
        params: { token },
      }
    )
  }, [documentId])

  return { ydoc, provider }
}