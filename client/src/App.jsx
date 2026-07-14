import { Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
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
      {/* reducedMotion="user" stills Motion's transform animations when the
          OS asks for reduced motion; CSS loops are stilled in studio.css. */}
      <MotionConfig reducedMotion="user">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/work/:slug" element={<WorkDetail />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MotionConfig>
    </ThemeProvider>
  )
}
