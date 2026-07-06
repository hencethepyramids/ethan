import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import StudioNav from '../components/StudioNav'
import StudioFooter from '../components/StudioFooter'
import Grain from '../components/Grain'
import { useSeo } from '../useSeo'
import { notFoundMeta } from '../seo'
import styles from '../studio.module.css'
import '../studio.css'

const ease = [0.16, 1, 0.3, 1]

export default function NotFound() {
  useSeo(notFoundMeta())
  return (
    <div className={`studio-root ${styles.root}`}>
      <Grain />
      <StudioNav />
      <section className={styles.notFound}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
          <div className={styles.kicker}><span className={styles.kickerLine} /> ERROR - 404</div>
          <h1 className={styles.notFoundCode}>LOST</h1>
          <p className={styles.notFoundText}>
            This page wandered off. Let’s get you back to something that exists.
          </p>
          <Link to="/" className={styles.notFoundLink}>← Back home</Link>
        </motion.div>
      </section>
      <StudioFooter />
    </div>
  )
}
