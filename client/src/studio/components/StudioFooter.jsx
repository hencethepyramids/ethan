import styles from '../studio.module.css'

export default function StudioFooter() {
  const toTop = (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  return (
    <footer className={styles.footer}>
      <span>© 2026 Ethan Ellerstein</span>
      <a href="#top" onClick={toTop} className={styles.toTop}>BACK TO TOP ↑</a>
      <span>MINNESOTA</span>
    </footer>
  )
}
