import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './studio/theme'
import Landing from './studio/pages/Landing'
import WorkDetail from './studio/pages/WorkDetail'
import BlogIndex from './studio/pages/BlogIndex'
import BlogPost from './studio/pages/BlogPost'
import NotFound from './studio/pages/NotFound'

// Router-agnostic app shell: main.jsx wraps it in BrowserRouter for the
// client, entry-server.jsx wraps it in StaticRouter for prerendering.
export default function App() {
  return (
    <ThemeProvider>
      {/* Animations run for everyone by owner decision (2026-07-15) -
          see the reduced-motion note in studio.css. */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/work/:slug" element={<WorkDetail />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  )
}
