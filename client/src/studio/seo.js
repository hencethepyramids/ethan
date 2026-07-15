// Single source of truth for SEO/GEO: site constants, per-route meta, and
// JSON-LD. Consumed by the useSeo hook (client-side updates), the prerender
// script (static heads + sitemap + llms.txt), and entry-server.jsx.
import { POSTS } from './data/posts'
import { PROJECTS } from './data/projects'

// Production origin. Change here (and rebuild) if the domain differs.
export const SITE_URL = 'https://ethanellerstein.com'
export const SITE_NAME = 'Ethan Ellerstein'
export const DEFAULT_TITLE = 'Ethan Ellerstein - AI · Full-stack · Security'
export const DEFAULT_DESCRIPTION =
  'Ethan Ellerstein is a software engineer who ships AI products, builds the full-stack around them, and secures what he makes. Range is the point.'
export const OG_IMAGE = `${SITE_URL}/og.png`

const GITHUB = 'https://github.com/hencethepyramids'
const LINKEDIN = 'https://www.linkedin.com/in/ethan-ellerstein-5b4610240/'

const person = {
  '@type': 'Person',
  name: SITE_NAME,
  url: SITE_URL,
  jobTitle: 'Software Engineer',
  address: { '@type': 'PostalAddress', addressRegion: 'MN', addressCountry: 'US' },
  sameAs: [GITHUB, LINKEDIN, 'https://watchwall.app'],
  knowsAbout: [
    'AI engineering', 'AI agents', 'Azure OpenAI', 'Copilot Studio',
    'Full-stack development', 'React', 'C#', '.NET',
    'Application security', 'Penetration testing',
  ],
}

const ld = (data) => ({ '@context': 'https://schema.org', ...data })

export const landingMeta = () => ({
  path: '/',
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  ogType: 'website',
  jsonld: [ld(person), ld({ '@type': 'WebSite', name: SITE_NAME, url: SITE_URL })],
})

export const blogIndexMeta = () => ({
  path: '/blog',
  title: `Blog - ${SITE_NAME}`,
  description:
    'Thinking out loud about AI, engineering, security, and the craft of building things that last.',
  ogType: 'website',
  jsonld: [ld({
    '@type': 'Blog',
    name: `${SITE_NAME} - Blog`,
    url: `${SITE_URL}/blog`,
    author: person,
    blogPost: POSTS.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: p.url || `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.date,
    })),
  })],
})

export const postMeta = (post) => ({
  path: `/blog/${post.slug}`,
  title: `${post.title} - ${SITE_NAME}`,
  description: post.excerpt,
  ogType: 'article',
  lastmod: post.date,
  jsonld: [ld({
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: `${SITE_URL}/blog/${post.slug}`,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.date,
    dateModified: post.date,
    keywords: post.tags.join(', '),
    inLanguage: 'en',
    author: person,
  })],
})

export const projectMeta = (project) => ({
  path: `/work/${project.slug}`,
  title: `${project.title} - ${SITE_NAME}`,
  description: project.tagline,
  ogType: 'website',
  jsonld: project.link
    ? [ld({
        '@type': 'SoftwareApplication',
        name: project.title,
        url: project.link,
        description: project.tagline,
        operatingSystem: 'Windows',
        applicationCategory: 'MultimediaApplication',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        author: person,
      })]
    : [],
})

export const notFoundMeta = () => ({
  path: '/404',
  title: `Page not found - ${SITE_NAME}`,
  description: 'This page does not exist.',
  ogType: 'website',
  noindex: true,
  jsonld: [],
})

// Every prerenderable route, used by the prerender script and sitemap.
// External posts live on another site - they get no local route.
export const routes = () => [
  { path: '/', meta: landingMeta() },
  { path: '/blog', meta: blogIndexMeta() },
  ...POSTS.filter((p) => !p.url).map((p) => ({ path: `/blog/${p.slug}`, meta: postMeta(p) })),
  ...PROJECTS.map((p) => ({ path: `/work/${p.slug}`, meta: projectMeta(p) })),
  { path: '/404', meta: notFoundMeta() },
]

const esc = (s) =>
  String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

// Full <head> tag block for a route; the prerender script swaps this into the
// <!--seo--> ... <!--/seo--> region of index.html.
export function headHtml(meta) {
  const url = SITE_URL + (meta.path === '/404' ? '' : meta.path)
  const lines = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<meta name="author" content="${esc(SITE_NAME)}" />`,
  ]
  if (meta.noindex) lines.push('<meta name="robots" content="noindex" />')
  else lines.push(`<link rel="canonical" href="${url}" />`)
  lines.push(
    `<meta property="og:type" content="${meta.ogType}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(DEFAULT_TITLE)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
  )
  for (const block of meta.jsonld || []) {
    lines.push(
      `<script type="application/ld+json">${JSON.stringify(block).replaceAll('<', '\\u003c')}</script>`
    )
  }
  return lines.map((l) => '    ' + l).join('\n')
}
