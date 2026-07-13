import { Link } from 'react-router-dom'

// Native posts route internally to /blog/{slug}; external posts (published
// on another site) link straight out in a new tab.
export default function PostLink({ post, className, children }) {
  if (post.url) {
    return (
      <a href={post.url} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link to={`/blog/${post.slug}`} className={className}>
      {children}
    </Link>
  )
}
