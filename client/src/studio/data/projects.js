// Project / case-study data. Mirrors the posts shape so it can later be served
// from the API the same way the blog is. `link` (optional) renders as an
// external "visit" link on the case-study page.

export const PROJECTS = [
  {
    slug: 'watchwall',
    n: '01',
    title: 'Watchwall',
    cat: 'Desktop',
    year: '2026',
    link: 'https://watchwall.app',
    tagline: 'Watch all your streams in one place - a desktop multi-stream viewer for Twitch.',
    role: 'Design & engineering',
    stack: ['Electron', 'Twitch API'],
    body: [
      { type: 'p', text: 'Watchwall puts up to 12 live Twitch streams in one auto-arranging grid - with per-stream volume, mute and solo, theater mode, pop-out windows for a second monitor, and built-in chat with 7TV, BetterTTV, and FrankerFaceZ emotes.' },
      { type: 'h', text: 'Built like a product' },
      { type: 'p', text: 'Saveable wall layouts, live channel search, and Twitch sign-in that carries your subscriptions and Turbo perks. Free to use, no account required, and private - nothing tracked.' },
      { type: 'h', text: 'Hardened, not just shipped' },
      { type: 'p', text: 'Electron has a deserved reputation for shipping fast and leaking surface area. Watchwall is built the other way: isolated processes, a locked-down IPC boundary, and careful resource management so a twelve-stream wall stays smooth without giving the renderer more power than it needs.' },
      { type: 'quote', text: 'A desktop app is a trust decision. The security work is the product, even when nobody sees it.' },
    ],
  },
]

export const getProject = (slug) => PROJECTS.find((p) => p.slug === slug)
