import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import StudioNav from '../components/StudioNav'
import StudioFooter from '../components/StudioFooter'
import Grain from '../components/Grain'
import PostLink from '../components/PostLink'
import { POSTS, fmtDate } from '../data/posts'
import { apiPosts } from '../data/api'
import { useSeo } from '../useSeo'
import { blogIndexMeta } from '../seo'
import styles from '../studio.module.css'
import '../studio.css'

const ease = [0.16, 1, 0.3, 1]

export default function BlogIndex() {
  useSeo(blogIndexMeta())
  const [posts, setPosts] = useState(POSTS)
  useEffect(() => {
    window.scrollTo(0, 0)
    apiPosts().then((p) => { if (Array.isArray(p) && p.length) setPosts(p) }).catch(() => {})
  }, [])
  return (
    <motion.div className={`studio-root ${styles.root}`}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Grain />
      <StudioNav />

      <section className={styles.blogHero}>
        <motion.div className={styles.kicker}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.6 }}>
          <span className={styles.kickerLine} /> WRITING · NOTES · IDEAS
        </motion.div>
        <motion.h1 className={styles.blogTitle}
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
          JOURNAL
        </motion.h1>
        <motion.p className={styles.blogSub}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7, ease }}>
          Thinking out loud about AI, engineering, security, and the craft of
          building things that last.
        </motion.p>
      </section>

      <section className={styles.blogList}>
        {posts.map((p, i) => (
          <motion.div key={p.slug}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.05, ease }}>
            <PostLink post={p} className={styles.blogRow}>
              <div className={styles.blogRowTop}>
                <span className={styles.blogRowDate}>{fmtDate(p.date)}</span>
                <span className={styles.blogRowRead}>{p.read ? `${p.read} read` : p.source}</span>
              </div>
              <h2 className={styles.blogRowTitle}>{p.title}</h2>
              <p className={styles.blogRowExcerpt}>{p.excerpt}</p>
              <div className={styles.blogRowFoot}>
                <span className={styles.postTags}>
                  {p.tags.map((t) => <span key={t} className={styles.postTag}>{t}</span>)}
                </span>
                <span className={styles.blogRowLink}>{p.url ? `Read on ${p.source} ↗` : 'Read article →'}</span>
              </div>
            </PostLink>
          </motion.div>
        ))}
      </section>

      <StudioFooter />
    </motion.div>
  )
}
