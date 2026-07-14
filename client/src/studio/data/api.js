// Thin API client. Posts read from the ASP.NET Core backend when it's
// running, falling back to the bundled local data - the site stays fully
// functional even if the API is down, which is the normal case in
// production (Hostinger serves the static build only; there's no server).
// Contact submissions go straight to Web3Forms - a hosted form backend -
// since a static host can't run the .NET API to receive them.
import { POSTS, getPost } from './posts'

const BASE = '/api'
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY

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
  if (!WEB3FORMS_ACCESS_KEY) {
    throw new Error('Contact form is not configured. Set VITE_WEB3FORMS_ACCESS_KEY - see README.')
  }
  // Omit the honeypot unless a bot actually filled it, mirroring how HTML
  // forms submit checkboxes (unchecked = absent).
  const { botcheck, ...fields } = payload
  const r = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `New message from ${payload.name} via ethanellerstein.com`,
      ...fields,
      ...(botcheck ? { botcheck } : {}),
    }),
  })
  const data = await r.json().catch(() => ({}))
  if (!r.ok || !data.success) throw new Error(data.message || 'Something went wrong. Try the email link instead.')
  return data
}
