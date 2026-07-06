import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import StudioNav from '../components/StudioNav'
import StudioFooter from '../components/StudioFooter'
import Grain from '../components/Grain'
import Intro from '../components/Intro'
import Magnetic from '../components/Magnetic'
import ContactForm from '../components/ContactForm'
import Socials from '../components/Socials'
import { POSTS, fmtDate } from '../data/posts'
import { PROJECTS } from '../data/projects'
import { useDocumentTitle } from '../useDocumentTitle'
import styles from '../studio.module.css'
import '../studio.css'

const EMAIL = 'eellerstein@gmail.com'
const ease = [0.16, 1, 0.3, 1]

function CountUp({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf
    const start = performance.now(), dur = 1300
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur)
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to])
  return <span ref={ref}>{n}{suffix}</span>
}

function Reveal({ children, delay = 0, className }) {
  return (
    <motion.div className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease }}>
      {children}
    </motion.div>
  )
}

const STATS = [
  { to: 5, suffix: '+', label: 'Years building' },
  { to: 20, suffix: '+', label: 'Projects shipped' },
  { to: 3, suffix: '', label: 'Domains, one builder' },
  { to: 100, suffix: '%', label: 'Curiosity' },
]
const TECH = ['AZURE OPENAI', 'REACT', '.NET', 'TYPESCRIPT', 'COPILOT STUDIO', 'POSTGRESQL', 'PEN TESTING', 'NODE.JS', 'POWER PLATFORM']
const CYCLE = ['AI agents', 'web platforms', 'security tools', 'copilots']

function Hero() {
  const [wi, setWi] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setWi((w) => (w + 1) % CYCLE.length), 2200)
    return () => clearInterval(id)
  }, [])
  const lineUp = {
    hidden: { y: '110%' },
    show: (i) => ({ y: '0%', transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease } }),
  }
  return (
    <header className={styles.hero} id="top">
      <motion.div className={styles.kicker}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.6 }}>
        <span className={styles.kickerLine} /> AI · FULL-STACK · SECURITY
      </motion.div>

      <h1 className={styles.title}>
        <span className={styles.lineMask}>
          <motion.span className={styles.line} variants={lineUp} custom={0} initial="hidden" animate="show">BUILDER</motion.span>
        </span>
        <span className={styles.lineMask}>
          <motion.span className={styles.line} variants={lineUp} custom={1} initial="hidden" animate="show">OF&nbsp;<span className={styles.accentWord}>SYSTEMS</span></motion.span>
        </span>
      </h1>

      <motion.div className={styles.heroFoot}
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7, ease }}>
        <p className={styles.lead}>
          Ethan Ellerstein — an engineer who ships AI products, builds the
          full-stack around them, and secures what he makes.
        </p>
        <div className={styles.currently}>
          <span className={styles.curLabel}>CURRENTLY BUILDING</span>
          <span className={styles.curWord}>
            <AnimatePresence mode="wait">
              <motion.span key={wi}
                initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.35, ease }}>
                {CYCLE[wi]}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>
      </motion.div>

      <div className={styles.scrollHint}><span>SCROLL</span><span className={styles.scrollArrow}>↓</span></div>
    </header>
  )
}

function Marquee() {
  const row = [...TECH, ...TECH]
  return (
    <div className={styles.marquee}>
      <div className={styles.marqueeTrack}>
        {row.map((t, i) => (
          <span key={i} className={styles.marqueeItem}>{t}<span className={styles.marqueeDot}>✦</span></span>
        ))}
      </div>
    </div>
  )
}

function Work() {
  return (
    <section className={styles.work} id="work">
      <Reveal className={styles.secHead}>
        <span className={styles.secNum}>(01)</span>
        <h2 className={styles.secTitle}>SELECTED WORK</h2>
        <span className={styles.secMeta}>{PROJECTS.length} projects</span>
      </Reveal>

      <div className={styles.workList}>
        {PROJECTS.map((p, i) => (
          <motion.div key={p.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.05, ease }}>
            <Link to={`/work/${p.slug}`} className={styles.workRow}>
              <span className={styles.workNum}>{p.n}</span>
              <span className={styles.workTitle}>{p.title}</span>
              <span className={styles.workCat}>{p.cat}</span>
              <span className={styles.workYear}>’{p.year.slice(2)}</span>
              <span className={styles.workArrow}>↗</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className={styles.stats}>
      {STATS.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.08} className={styles.stat}>
          <span className={styles.statNum}><CountUp to={s.to} suffix={s.suffix} /></span>
          <span className={styles.statLabel}>{s.label}</span>
        </Reveal>
      ))}
    </section>
  )
}

const DISCIPLINES = [
  { k: 'AI', t: 'Agents & copilots', d: 'Azure OpenAI, RAG, tool-calling, and copilots that actually ship.' },
  { k: 'Full-stack', t: 'End-to-end products', d: 'React front-ends on C#/.NET services — built, shipped, maintained.' },
  { k: 'Security', t: 'Offense & defense', d: 'A pen-tester’s instincts baked into everything I build.' },
]

function About() {
  return (
    <section className={styles.about} id="about">
      <Reveal className={styles.secHead}>
        <span className={styles.secNum}>(02)</span>
        <h2 className={styles.secTitle}>ABOUT</h2>
      </Reveal>

      <Reveal className={styles.aboutStatement}>
        <p>
          I’m a builder who works across <em>AI</em>, <em>full-stack engineering</em>,
          and <em>security</em> — and I care most about the seams where they meet.
        </p>
      </Reveal>

      <div className={styles.disciplines}>
        {DISCIPLINES.map((x, i) => (
          <Reveal key={x.k} delay={i * 0.08} className={styles.discipline}>
            <span className={styles.discKey}>{String(i + 1).padStart(2, '0')} — {x.k}</span>
            <h3 className={styles.discTitle}>{x.t}</h3>
            <p className={styles.discDesc}>{x.d}</p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1} className={styles.aboutBio}>
        <p>
          I care equally about whether a button feels right to press and whether a
          system holds up under attack. Most days I’m building AI products on the
          Microsoft stack, engineering the full-stack around them, and
          pressure-testing the result. Range isn’t a lack of focus — it’s the focus.
        </p>
      </Reveal>
    </section>
  )
}

function Journal() {
  const latest = POSTS.slice(0, 3)
  return (
    <section className={styles.journal} id="journal">
      <Reveal className={styles.secHead}>
        <span className={styles.secNum}>(03)</span>
        <h2 className={styles.secTitle}>JOURNAL</h2>
        <Link to="/blog" className={styles.secLink}>View all →</Link>
      </Reveal>

      <div className={styles.postList}>
        {latest.map((p, i) => (
          <motion.div key={p.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.06, ease }}>
            <Link to={`/blog/${p.slug}`} className={styles.postRow}>
              <span className={styles.postDate}>{fmtDate(p.date)}</span>
              <span className={styles.postTitle}>{p.title}</span>
              <span className={styles.postTags}>
                {p.tags.map((t) => <span key={t} className={styles.postTag}>{t}</span>)}
              </span>
              <span className={styles.postRead}>{p.read}</span>
              <span className={styles.postArrow}>→</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className={styles.contact} id="contact">
      <Reveal className={styles.secHead}>
        <span className={styles.secNum}>(04)</span>
        <h2 className={styles.secTitle}>CONTACT</h2>
      </Reveal>
      <Reveal>
        <h3 className={styles.contactBig}>LET’S BUILD<br />SOMETHING.</h3>
      </Reveal>
      <Reveal delay={0.1} className={styles.contactGrid}>
        <div className={styles.contactLeft}>
          <p className={styles.contactNote}>
            Have a project, a role, or just a good problem? Drop me a line —
            I read everything.
          </p>
          <Magnetic strength={0.25}>
            <a className={styles.email} href={`mailto:${EMAIL}`}>{EMAIL} →</a>
          </Magnetic>
          <Socials />
        </div>
        <ContactForm />
      </Reveal>
    </section>
  )
}

export default function Landing() {
  useDocumentTitle()
  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => { document.documentElement.style.scrollBehavior = prev }
  }, [])
  return (
    <div className={`studio-root ${styles.root}`}>
      <Grain />
      <Intro />
      <StudioNav />
      <Hero />
      <Marquee />
      <Work />
      <Stats />
      <About />
      <Journal />
      <Contact />
      <StudioFooter />
    </div>
  )
}
