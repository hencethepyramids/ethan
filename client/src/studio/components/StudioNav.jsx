import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { useTheme } from '../theme'
import styles from '../studio.module.css'

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
)
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

export default function StudioNav() {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const loc = useLocation()
  const onLanding = loc.pathname === '/'
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  const { theme, toggle } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // While the mobile menu is open: lock page scroll and close on Escape.
  useEffect(() => {
    if (!menuOpen) return
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const go = (id) => (e) => {
    e.preventDefault()
    setMenuOpen(false)
    if (onLanding) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => document.getElementById(id)?.scrollIntoView(), 80)
    }
  }

  return (
    <>
    <motion.div className={styles.scrollProgress} style={{ scaleX: progress }} />
    <nav className={`${styles.nav} ${scrolled || !onLanding ? styles.navOn : ''}`}>
      <a href="/" onClick={go('top')} className={styles.brand}>
        ETHAN ELLERSTEIN
      </a>
      <div className={styles.navlinks}>
        <a href="#work" onClick={go('work')} className={styles.navlink}>Work</a>
        <a href="#about" onClick={go('about')} className={styles.navlink}>About</a>
        <Link to="/blog" className={`${styles.navlink} ${loc.pathname.startsWith('/blog') ? styles.navlinkOn : ''}`}>Blog</Link>
        <a href="#contact" onClick={go('contact')} className={styles.navlink}>Contact</a>
      </div>
      <div className={styles.navRight}>
        <button className={styles.themeToggle} onClick={toggle}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        <button className={styles.menuBtn} onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu" aria-expanded={menuOpen}>
          {menuOpen ? 'CLOSE' : 'MENU'}
        </button>
      </div>
    </nav>

    <AnimatePresence>
      {menuOpen && (
        <motion.div className={styles.mobileMenu}
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
          <button className={styles.menuClose} onClick={() => setMenuOpen(false)} aria-label="Close menu">✕</button>
          {[
            <a key="work" href="#work" onClick={go('work')} className={styles.mobileLink}>Work</a>,
            <a key="about" href="#about" onClick={go('about')} className={styles.mobileLink}>About</a>,
            <Link key="blog" to="/blog" onClick={() => setMenuOpen(false)} className={styles.mobileLink}>Blog</Link>,
            <a key="contact" href="#contact" onClick={go('contact')} className={styles.mobileLink}>Contact</a>,
          ].map((link, i) => (
            <motion.div key={link.key}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              {link}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}
