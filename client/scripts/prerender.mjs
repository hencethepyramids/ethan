// Build-time prerender: renders every route to static HTML so search engines
// and AI crawlers (which mostly don't execute JavaScript) see full content.
// Also generates sitemap.xml and llms.txt from the same seo.js route data.
// Runs after `vite build` + `vite build --ssr` (see package.json "build").
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { resolve, join } from 'node:path'

const dist = resolve('dist')
const { render, routes, headHtml, SITE_URL, POSTS, PROJECTS } =
  await import('../dist-ssr/entry-server.js')

const template = readFileSync(join(dist, 'index.html'), 'utf8')
const today = new Date().toISOString().slice(0, 10)
const all = routes()

for (const { path, meta } of all) {
  const appHtml = render(path)
  const page = template
    .replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, `<!--seo-->\n${headHtml(meta)}\n    <!--/seo-->`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)

  const outFile =
    path === '/' ? join(dist, 'index.html')
    : path === '/404' ? join(dist, '404.html')
    : join(dist, ...path.split('/').filter(Boolean), 'index.html')
  mkdirSync(join(outFile, '..'), { recursive: true })
  writeFileSync(outFile, page)
  console.log(`prerendered ${path} -> ${outFile.slice(dist.length + 1)}`)
}

// sitemap.xml (indexable routes only)
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  all
    .filter(({ meta }) => !meta.noindex)
    .map(({ path, meta }) =>
      `  <url><loc>${SITE_URL}${path}</loc><lastmod>${meta.lastmod || today}</lastmod></url>`
    )
    .join('\n') +
  '\n</urlset>\n'
writeFileSync(join(dist, 'sitemap.xml'), sitemap)
console.log('wrote sitemap.xml')

// llms.txt - a plain-markdown site summary for LLM crawlers (llmstxt.org)
const llms = `# Ethan Ellerstein

> Software engineer working across AI, full-stack, and security. Ships AI
> products (Azure OpenAI, Copilot Studio), builds the React and C#/.NET
> systems around them, and pressure-tests the result. Based in Minnesota, US.

## Site

- [Home](${SITE_URL}/): who Ethan is, selected work, blog, and contact
- [Blog](${SITE_URL}/blog): writing on AI, engineering, security, and craft

## Selected work

${PROJECTS.map((p) => {
  const href = p.body ? `${SITE_URL}/work/${p.slug}` : p.external
  const extra = p.soon ? ' (coming soon)' : p.link ? ` Live at ${p.link}` : ''
  return href
    ? `- [${p.title}](${href}): ${p.tagline}${extra}`
    : `- ${p.title}${extra}: ${p.tagline}`
}).join('\n')}

## Blog posts

${POSTS.map((p) => `- [${p.title}](${p.url || `${SITE_URL}/blog/${p.slug}`}): ${p.excerpt}`).join('\n')}

## Profiles

- GitHub: https://github.com/hencethepyramids
- LinkedIn: https://www.linkedin.com/in/ethan-ellerstein-5b4610240/
- Watchwall: https://watchwall.app
`
writeFileSync(join(dist, 'llms.txt'), llms)
console.log('wrote llms.txt')

rmSync(resolve('dist-ssr'), { recursive: true, force: true })
