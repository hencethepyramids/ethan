// Thin API client for the ASP.NET Core backend. Every read falls back to the
// bundled local data so the site stays fully functional even if the API is down.
import { POSTS, getPost } from './posts'

const BASE = '/api'

export async function apiPosts() {
  try {
    const r = await fetch(`${BASE}/posts`)
    if (!r.ok) throw new Error()
    return await r.json()
  } catch {
    // strip bodies to mirror the list endpoint's shape
    return POSTS.map(({ body, ...meta }) => meta)
  }
}

export async function apiPost(slug) {
  try {
    const r = await fetch(`${BASE}/posts/${slug}`)
    if (!r.ok) throw new Error()
    return await r.json()
  } catch {
    return getPost(slug) || null
  }
}

export async function apiContact(payload) {
  const r = await fetch(`${BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(data.error || 'Something went wrong. Try the email link instead.')
  return data
}
