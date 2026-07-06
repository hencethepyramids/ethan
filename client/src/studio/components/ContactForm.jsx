import { useState } from 'react'
import { apiContact } from '../data/api'
import styles from '../studio.module.css'

const EMPTY = { name: '', email: '', message: '' }

export default function ContactForm() {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending'); setError('')
    try {
      await apiContact(form)
      setStatus('sent'); setForm(EMPTY)
    } catch (err) {
      setStatus('error'); setError(err.message || 'Something went wrong.')
    }
  }

  if (status === 'sent') {
    return (
      <div className={styles.formDone}>
        <span className={styles.formDoneMark}>✓</span>
        <p className={styles.formDoneText}>Message sent. I’ll be in touch soon.</p>
        <button className={styles.formReset} onClick={() => setStatus('idle')}>Send another →</button>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.formRow}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Name</label>
          <input className={styles.input} type="text" value={form.name}
            onChange={set('name')} placeholder="Your name" required />
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Email</label>
          <input className={styles.input} type="email" value={form.email}
            onChange={set('email')} placeholder="you@email.com" required />
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>Message</label>
        <textarea className={styles.textarea} value={form.message}
          onChange={set('message')} placeholder="What are you building?" rows={4} required />
      </div>

      {status === 'error' && <p className={styles.formError}>{error}</p>}

      <button className={styles.submit} type="submit" disabled={status === 'sending'}>
        <span className={styles.submitLabel}>{status === 'sending' ? 'Sending…' : 'Send message'}</span>
        <span className={styles.submitArrow}>→</span>
      </button>
    </form>
  )
}
