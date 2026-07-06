import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './studio/theme'
import Landing from './studio/pages/Landing'
import WorkDetail from './studio/pages/WorkDetail'
import BlogIndex from './studio/pages/BlogIndex'
import BlogPost from './studio/pages/BlogPost'
import NotFound from './studio/pages/NotFound'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/work/:slug" element={<WorkDetail />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
