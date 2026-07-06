import { useEffect } from 'react'
import { SITE_URL } from './seo'

const upsertMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

// Keeps title/description/canonical/OG tags in sync on client-side navigation.
// (First paint of every route is already correct: the prerender script bakes
// the same tags, built from the same seo.js meta, into each route's HTML.)
export function useSeo(meta) {
  useEffect(() => {
    if (!meta) return
    document.title = meta.title
    upsertMeta('name', 'description', meta.description)
    upsertMeta('property', 'og:type', meta.ogType)
    upsertMeta('property', 'og:url', SITE_URL + meta.path)
    upsertMeta('property', 'og:title', meta.title)
    upsertMeta('property', 'og:description', meta.description)
    upsertMeta('name', 'twitter:title', meta.title)
    upsertMeta('name', 'twitter:description', meta.description)

    let canonical = document.head.querySelector('link[rel="canonical"]')
    let robots = document.head.querySelector('meta[name="robots"]')
    if (meta.noindex) {
      canonical?.remove()
      upsertMeta('name', 'robots', 'noindex')
    } else {
      robots?.remove()
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        document.head.appendChild(canonical)
      }
      canonical.setAttribute('href', SITE_URL + meta.path)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta && meta.path, meta && meta.title])
}
