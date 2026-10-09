import type { AvatarLook } from '../types.ts'

export function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16)
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)))
  return `#${[n >> 16, (n >> 8) & 255, n & 255].map((c) => f(c).toString(16).padStart(2, '0')).join('')}`
}

const STROKE = '#1f2a44'

/** A blocky avatar: cube head, block body, arms and legs. All original SVG. */
export function Blocky({ look, size = 120, className = '' }: { look: AvatarLook; size?: number; className?: string }) {
  const { skin, hairColor: hc, shirt, pants } = look
  const sw = 2
  return (
    <svg viewBox="0 0 120 150" width={size} height={size * 1.25} className={className} role="img" aria-label="Your blocky character">
      {/* legs + shoes */}
      <rect x="40" y="100" width="19" height="38" rx="3" fill={pants} stroke={STROKE} strokeWidth={sw} />
      <rect x="61" y="100" width="19" height="38" rx="3" fill={shade(pants, -0.12)} stroke={STROKE} strokeWidth={sw} />
      <rect x="38" y="132" width="22" height="10" rx="3" fill="#3b3f58" />
      <rect x="60" y="132" width="22" height="10" rx="3" fill="#3b3f58" />
      {/* arms */}
      <rect x="22" y="60" width="16" height="40" rx="4" fill={skin} stroke={STROKE} strokeWidth={sw} />
      <rect x="82" y="60" width="16" height="40" rx="4" fill={shade(skin, -0.1)} stroke={STROKE} strokeWidth={sw} />
      {/* body */}
      <rect x="38" y="60" width="44" height="44" rx="5" fill={shirt} stroke={STROKE} strokeWidth={sw} />
      <rect x="38" y="60" width="44" height="9" rx="4" fill={shade(shirt, 0.3)} opacity=".7" />
      {/* head cube: right + top faces for a blocky 3D look */}
      <polygon points="86,22 96,12 96,50 86,60" fill={shade(skin, -0.18)} stroke={STROKE} strokeWidth={sw} strokeLinejoin="round" />
      <polygon points="34,22 44,12 96,12 86,22" fill={shade(skin, 0.2)} stroke={STROKE} strokeWidth={sw} strokeLinejoin="round" />
      <rect x="34" y="22" width="52" height="38" rx="4" fill={skin} stroke={STROKE} strokeWidth={sw} />
      {/* hair */}
      {look.hairStyle === 'short' && <rect x="34" y="22" width="52" height="11" rx="3" fill={hc} />}
      {look.hairStyle === 'spiky' && <g fill={hc}><rect x="34" y="22" width="52" height="8" /><polygon points="36,22 42,8 48,22" /><polygon points="50,22 58,5 66,22" /><polygon points="68,22 76,8 84,22" /></g>}
      {look.hairStyle === 'long' && <g fill={hc}><rect x="34" y="22" width="52" height="11" rx="3" /><rect x="30" y="24" width="8" height="40" rx="3" /><rect x="82" y="24" width="8" height="40" rx="3" /></g>}
      {/* face */}
      {look.face !== 'cool' && look.face !== 'starry' && <g fill="#1f2a44"><rect x="46" y="38" width="7" height="9" rx="2" /><rect x="67" y="38" width="7" height="9" rx="2" /></g>}
      {look.face === 'cool' && <g><rect x="42" y="37" width="36" height="10" rx="3" fill="#111" /><rect x="44" y="39" width="12" height="3" fill="#7bd" opacity=".7" /></g>}
      {look.face === 'starry' && <g fill="#ffc928" stroke="#c98a00" strokeWidth="1"><polygon points="50,35 52,40 57,40 53,43 55,48 50,45 45,48 47,43 43,40 48,40" /><polygon points="70,35 72,40 77,40 73,43 75,48 70,45 65,48 67,43 63,40 68,40" /></g>}
      {look.face === 'grin' ? <rect x="50" y="50" width="20" height="7" rx="3" fill="#fff" stroke="#1f2a44" strokeWidth="2" /> : <path d="M51 51 Q60 59 69 51" stroke="#1f2a44" strokeWidth="3" fill="none" strokeLinecap="round" />}
      <rect x="40" y="48" width="6" height="4" rx="2" fill="#ff8aa5" opacity=".55" />
      <rect x="74" y="48" width="6" height="4" rx="2" fill="#ff8aa5" opacity=".55" />
      {/* hats */}
      {look.hat === 'cap' && <g><rect x="33" y="14" width="54" height="12" rx="4" fill="#e03131" stroke={STROKE} strokeWidth={sw} /><rect x="40" y="24" width="52" height="5" rx="2" fill="#a61e1e" /></g>}
      {look.hat === 'crown' && <g fill="#ffc928" stroke="#c98a00" strokeWidth="2" strokeLinejoin="round"><polygon points="36,22 36,6 46,14 60,2 74,14 84,6 84,22" /></g>}
      {look.hat === 'beanie' && <g><rect x="33" y="12" width="54" height="14" rx="6" fill="#845ef7" stroke={STROKE} strokeWidth={sw} /><rect x="33" y="21" width="54" height="5" fill="#b197fc" /><circle cx="60" cy="9" r="6" fill="#fff" stroke={STROKE} strokeWidth={sw} /></g>}
      {look.hat === 'party' && <g><polygon points="44,22 60,-4 76,22" fill="#ff6fb5" stroke={STROKE} strokeWidth={sw} strokeLinejoin="round" /><circle cx="60" cy="-3" r="4" fill="#ffd43b" /><rect x="50" y="14" width="20" height="4" fill="#fff" opacity=".7" /></g>}
    </svg>
  )
}
