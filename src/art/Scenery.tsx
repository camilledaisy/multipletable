/** Chunky cloud used in skies. Drifts slowly unless motion is reduced. */
export function Cloud({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  return (
    <svg viewBox="0 0 80 36" className={`cloud ${className}`} style={{ animationDelay: `${delay}s` }} aria-hidden="true">
      <rect x="4" y="14" width="72" height="18" rx="9" fill="#fff" /><rect x="14" y="4" width="26" height="18" rx="8" fill="#fff" /><rect x="36" y="8" width="26" height="16" rx="8" fill="#fff" />
    </svg>
  )
}

export function Coin({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="7" fill="#ffc928" stroke="#a86b00" strokeWidth="2" /><rect x="7" y="7" width="10" height="10" rx="3" fill="#ffe27a" stroke="#a86b00" strokeWidth="1.5" />
    </svg>
  )
}

export function Star({ size = 24, on = true }: { size?: number; on?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <polygon points="12,2 15,9 22,9.5 16.5,14.5 18.5,22 12,18 5.5,22 7.5,14.5 2,9.5 9,9" fill={on ? '#ffc928' : '#d6dbe6'} stroke={on ? '#a86b00' : '#9aa3b5'} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

/** Low-poly floating island block used on home + map. */
export function Island({ ground = '#6bd66b', className = '' }: { ground?: string; className?: string }) {
  return (
    <svg viewBox="0 0 200 90" className={className} aria-hidden="true">
      <polygon points="10,30 190,30 160,84 100,88 50,84" fill="#a9703a" stroke="#1f2a44" strokeWidth="2.5" strokeLinejoin="round" />
      <polygon points="50,30 100,88 70,84" fill="#8a5a2e" opacity=".5" />
      <rect x="6" y="14" width="188" height="22" rx="8" fill={ground} stroke="#1f2a44" strokeWidth="2.5" />
      <rect x="14" y="16" width="172" height="7" rx="3" fill="#fff" opacity=".25" />
    </svg>
  )
}
