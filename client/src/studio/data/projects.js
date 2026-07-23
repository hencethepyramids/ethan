// Project / case-study data. Mirrors the posts shape so it can later be served
// from the API the same way the blog is. `link` (optional) renders as an
// external "visit" link on the case-study page.
//
// A project is a full case study when it has a `body`. The other two shapes
// show up in the Selected Work list but have no `/work/:slug` page:
//   - `external`: the row links straight out to another site (new tab).
//   - `soon`: the row is a non-clickable "coming soon" placeholder.

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
  {
    slug: 'optimum-delivery-service',
    n: '02',
    title: 'Optimum Delivery Service',
    cat: 'Web',
    year: '2025',
    external: 'https://optimumdeliveryservicellc.com',
    tagline: 'Website for a family-run courier and delivery business.',
  },
  {
    slug: 'lawlens',
    n: '03',
    title: 'Law Lens',
    cat: 'AI',
    year: '2026',
    soon: true,
    tagline: 'Turns complex legal and bureaucratic language into plain, actionable English.',
  },
]

export const getProject = (slug) => PROJECTS.find((p) => p.slug === slug)

// Only projects with a written case study get a `/work/:slug` page. External
// and coming-soon entries appear in the list but have no detail route.
export const CASE_STUDIES = PROJECTS.filter((p) => p.body)
