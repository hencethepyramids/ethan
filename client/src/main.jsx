import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import './favicon.js'
import { initSentry } from './sentry.js'

initSentry()

// createRoot (not hydrateRoot) on purpose: routes are prerendered for
// crawlers and no-JS visitors, and React simply replaces that markup on
// load - no hydration-mismatch risk in exchange for a negligible swap.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
)
