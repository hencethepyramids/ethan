import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import StudioNav from '../components/StudioNav'
import StudioFooter from '../components/StudioFooter'
import Grain from '../components/Grain'
import { getPost, POSTS, fmtDate } from '../data/posts'
import { apiPost } from '../data/api'
import { useSeo } from '../useSeo'
import { postMeta } from '../seo'
import styles from '../studio.module.css'
import '../studio.css'

const ease = [0.16, 1, 0.3, 1]

function Block({ block }) {
  if (block.type === 'h') return <h2 className={styles.articleH}>{block.text}</h2>
  if (block.type === 'quote') return <blockquote className={styles.articleQuote}>{block.text}</blockquote>
  return <p className={styles.articleP}>{block.text}</p>
}

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(() => getPost(slug))
  useEffect(() => {
    window.scrollTo(0, 0)
    apiPost(slug).then((p) => { if (p) setPost(p) }).catch(() => {})
  }, [slug])
  useSeo(post ? postMeta(post) : null)

  if (!post) return <Navigate to="/blog" replace />

  const idx = POSTS.findIndex((p) => p.slug === slug)
  const next = POSTS[(idx + 1) % POSTS.length]

  return (
    <motion.div className={`studio-root ${styles.root}`}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Grain />
      <StudioNav />

      <article className={styles.article}>
        <motion.div className={styles.articleHead}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
          <Link to="/blog" className={styles.backLink}>← Journal</Link>
          <div className={styles.articleMeta}>
            <span>{fmtDate(post.date)}</span>
            <span className={styles.metaDot}>·</span>
            <span>{post.read} read</span>
            <span className={styles.articleTags}>
              {post.tags.map((t) => <span key={t} className={styles.postTag}>{t}</span>)}
            </span>
          </div>
          <h1 className={styles.articleTitle}>{post.title}</h1>
        </motion.div>

        <motion.div className={styles.articleBody}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.7, ease }}>
          {post.body.map((b, i) => <Block key={i} block={b} />)}
        </motion.div>

        <div className={styles.articleNav}>
          <span className={styles.articleNavLabel}>NEXT</span>
          <Link to={`/blog/${next.slug}`} className={styles.articleNext}>
            {next.title} <span>→</span>
          </Link>
        </div>
      </article>

      <StudioFooter />
    </motion.div>
  )
}
