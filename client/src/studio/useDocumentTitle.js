import { useEffect } from 'react'

const BASE = 'Ethan Ellerstein'

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : `${BASE} — AI · Full-stack · Security`
  }, [title])
}
