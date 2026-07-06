import { useRef } from 'react'

export default function Magnetic({ children, className, strength = 0.3 }) {
  const ref = useRef(null)
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) * strength
    const y = (e.clientY - (r.top + r.height / 2)) * strength
    ref.current.style.transform = `translate(${x}px, ${y}px)`
  }
  const reset = () => { ref.current.style.transform = 'translate(0,0)' }
  return (
    <span ref={ref} className={className} onMouseMove={onMove} onMouseLeave={reset}
      style={{ display: 'inline-block', transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
      {children}
    </span>
  )
}
