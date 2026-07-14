import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from '../studio.module.css'

// One-time intro curtain: counts 0→100, then lifts to reveal the page.
export default function Intro() {
  // On the server (prerender) treat the intro as done so the static HTML
  // that crawlers and no-JS visitors see is never hidden behind the curtain.
  // Reduced-motion users skip the forced count-up + curtain lift entirely.
  const [done, setDone] = useState(
    () => typeof window === 'undefined'
      || sessionStorage.getItem('studioIntro') === '1'
      || matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const [count, setCount] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (done) return
    let raf
    const start = performance.now(), dur = 1500
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur)
      setCount(Math.round(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setLeaving(true)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [done])

  if (done) return null

  return (
    <motion.div
      className={styles.intro}
      initial={{ y: 0 }}
      animate={{ y: leaving ? '-100%' : 0 }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (leaving) { sessionStorage.setItem('studioIntro', '1'); setDone(true) }
      }}
    >
      <span className={styles.introName}>ETHAN ELLERSTEIN</span>
      <div className={styles.introBar}>
        <span className={styles.introMeta}>LOADING PORTFOLIO</span>
        <span className={styles.introCount}>{String(count).padStart(3, '0')}</span>
      </div>
      <motion.span
        className={styles.introProgress}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: count / 100 }}
        transition={{ ease: 'linear' }}
      />
    </motion.div>
  )
}
