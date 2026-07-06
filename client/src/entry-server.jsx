import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'

// Used only by scripts/prerender.mjs at build time.
export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  )
}

export { routes, headHtml, SITE_URL } from './studio/seo'
export { POSTS } from './studio/data/posts'
export { PROJECTS } from './studio/data/projects'
