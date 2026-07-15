// Tab-state favicon: dark tile + white star while the tab is focused,
// light tile + black star when it's in the background. Runs client-side
// only (imported from main.jsx); the HTML link's default is the dark tile
// so crawlers and the pre-JS moment show the brand mark.
const FOCUSED = '/favicon-dark.png?v=6'
const BACKGROUND = '/favicon-light.png?v=6'

const link = document.querySelector('link[rel="icon"]')

function update() {
  const href = document.visibilityState === 'visible' ? FOCUSED : BACKGROUND
  if (link && link.href !== location.origin + href) link.href = href
}

document.addEventListener('visibilitychange', update)
update()
