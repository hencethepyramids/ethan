import { Component } from 'react'
import { Sentry } from './sentry.js'

// Last-resort catch: any render error below this replaces a blank screen
// with a styled fallback. Deliberately self-contained (class component,
// inline styles, palette read from data-theme) so it cannot depend on
// anything that may itself be broken.
const PALETTE = {
  light: { bg: '#F4F3EF', ink: '#0B0B0B', dim: '#8C887E' },
  dark: { bg: '#0C0C0E', ink: '#F1F0EB', dim: '#7C7A72' },
}

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled render error:', error, info.componentStack)
    Sentry.captureException(error, { extra: { componentStack: info.componentStack } })
  }

  render() {
    if (!this.state.error) return this.props.children

    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    const c = PALETTE[theme]
    const mono = "'Space Mono', ui-monospace, monospace"

    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 18, padding: 24,
        background: c.bg, color: c.ink, textAlign: 'center',
      }}>
        <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '0.16em', color: c.dim }}>
          UNEXPECTED ERROR
        </span>
        <h1 style={{ fontFamily: "'Archivo', sans-serif", fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, margin: 0 }}>
          Something broke.
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 300, color: c.dim, maxWidth: 420, margin: 0 }}>
          The page hit an error it couldn't recover from. A reload usually fixes it -
          if it keeps happening, email me at{' '}
          <a href="mailto:eellerstein@gmail.com" style={{ color: 'inherit' }}>eellerstein@gmail.com</a>.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            fontFamily: mono, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase',
            background: c.ink, color: c.bg, border: 'none', padding: '14px 28px', cursor: 'pointer',
          }}
        >
          Reload →
        </button>
      </div>
    )
  }
}
