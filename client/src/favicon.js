// Tab-state favicon: black star (white contour) while the tab is focused,
// white star (black contour) when it's in the background. Runs client-side
// only (imported from main.jsx); the HTML link's default matches the
// focused state for crawlers and the pre-JS moment.
const FOCUSED = '/favicon-light.png?v=6'
const BACKGROUND = '/favicon-dark.png?v=6'

const link = document.querySelector('link[rel="icon"]')

function update() {
  const href = document.visibilityState === 'visible' ? FOCUSED : BACKGROUND
  if (link && link.href !== location.origin + href) link.href = href
}

document.addEventListener('visibilitychange', update)
update()
