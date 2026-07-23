import { useEffect } from 'react'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import StudioNav from '../components/StudioNav'
import StudioFooter from '../components/StudioFooter'
import Grain from '../components/Grain'
import { getProject, CASE_STUDIES } from '../data/projects'
import { useSeo } from '../useSeo'
import { projectMeta } from '../seo'
import styles from '../studio.module.css'
import '../studio.css'

const ease = [0.16, 1, 0.3, 1]

function Block({ block }) {
  if (block.type === 'h') return <h2 className={styles.articleH}>{block.text}</h2>
  if (block.type === 'quote') return <blockquote className={styles.articleQuote}>{block.text}</blockquote>
  return <p className={styles.articleP}>{block.text}</p>
}

export default function WorkDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const project = getProject(slug)
  useEffect(() => { window.scrollTo(0, 0) }, [slug])
  useSeo(project ? projectMeta(project) : null)

  // Only case studies (projects with a written `body`) have a detail page.
  // External and coming-soon entries have no article, so bounce them home.
  if (!project || !project.body) return <Navigate to="/" replace />

  const idx = CASE_STUDIES.findIndex((p) => p.slug === slug)
  const next = CASE_STUDIES[(idx + 1) % CASE_STUDIES.length]
  const backToWork = (e) => {
    e.preventDefault(); navigate('/')
    setTimeout(() => document.getElementById('work')?.scrollIntoView(), 80)
  }

  return (
    <motion.div className={`studio-root ${styles.root}`}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Grain />
      <StudioNav />

      <article className={styles.article}>
        <motion.div className={styles.articleHead}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
          <a href="/" onClick={backToWork} className={styles.backLink}>← Work</a>
          <div className={styles.articleMeta}>
            <span>{project.year}</span><span className={styles.metaDot}>·</span>
            <span>{project.cat}</span><span className={styles.metaDot}>·</span>
            <span>{project.role}</span>
          </div>
          <h1 className={styles.articleTitle}>{project.title}</h1>
          <p className={styles.projTagline}>{project.tagline}</p>
          <div className={styles.projStack}>
            {project.stack.map((s) => <span key={s} className={styles.postTag}>{s}</span>)}
          </div>
          {project.link && (
            <a className={styles.projLink} href={project.link} target="_blank" rel="noreferrer">
              {project.link.replace(/^https?:\/\//, '')} ↗
            </a>
          )}
        </motion.div>

        <motion.div className={styles.articleBody}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.7, ease }}>
          {project.body.map((b, i) => <Block key={i} block={b} />)}
        </motion.div>

        {next.slug !== project.slug && (
          <div className={styles.articleNav}>
            <span className={styles.articleNavLabel}>NEXT PROJECT</span>
            <Link to={`/work/${next.slug}`} className={styles.articleNext}>
              {next.title} <span>→</span>
            </Link>
          </div>
        )}
      </article>

      <StudioFooter />
    </motion.div>
  )
}
