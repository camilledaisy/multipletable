import { shade } from './Blocky.tsx'

const S = '#1f2a44'
const PET_COLORS = ['#8be04e', '#4d8dff', '#aab2bf', '#ffb36b']

/** Small collectible things inside quests (treats, apples…). */
export function ItemIcon({ id, size = 28 }: { id: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      {id === 'treat' && <g stroke={S} strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="4" fill="#e9a35a" /><rect x="8" y="9" width="3" height="3" fill="#6b3f1d" stroke="none" /><rect x="14" y="12" width="3" height="3" fill="#6b3f1d" stroke="none" /></g>}
      {id === 'apple' && <g stroke={S} strokeWidth="1.5"><rect x="4" y="7" width="16" height="14" rx="5" fill="#f25c54" /><rect x="11" y="2" width="2.5" height="6" fill="#6b3f1d" stroke="none" /><rect x="13" y="3" width="6" height="3.5" rx="1.5" fill="#51cf66" stroke="none" /></g>}
      {id === 'flower' && <g stroke={S} strokeWidth="1.2"><rect x="11" y="13" width="2.5" height="9" fill="#37b24d" stroke="none" /><rect x="9" y="3" width="6" height="6" fill="#ff8ad1" /><rect x="4" y="8" width="6" height="6" fill="#ff8ad1" /><rect x="14" y="8" width="6" height="6" fill="#ff8ad1" /><rect x="9" y="12" width="6" height="2" fill="#ff8ad1" stroke="none" /><rect x="9" y="8" width="6" height="6" fill="#ffd43b" /></g>}
      {id === 'egg' && <g stroke={S} strokeWidth="1.5"><rect x="5" y="3" width="14" height="18" rx="7" fill="#fff4d6" /><rect x="9" y="9" width="2.5" height="2.5" fill="#e0b46a" stroke="none" /><rect x="13" y="13" width="2.5" height="2.5" fill="#e0b46a" stroke="none" /></g>}
      {id === 'carrot' && <g stroke={S} strokeWidth="1.5" strokeLinejoin="round"><polygon points="5,8 19,8 12,22" fill="#ff922b" /><rect x="8" y="2" width="3" height="6" fill="#51cf66" stroke="none" /><rect x="13" y="3" width="3" height="5" fill="#40c057" stroke="none" /></g>}
    </svg>
  )
}

/** The things that hold equal groups (pets, baskets, pots, nests, bunnies). */
export function HolderIcon({ id, size = 40, i = 0 }: { id: string; size?: number; i?: number }) {
  const c = PET_COLORS[i % PET_COLORS.length]
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
      {(id === 'pet' || id === 'bunny') && (
        <g stroke={S} strokeWidth="2" strokeLinejoin="round">
          {id === 'bunny' && <><rect x="9" y="2" width="6" height="13" rx="3" fill="#8be04e" /><rect x="25" y="2" width="6" height="13" rx="3" fill="#8be04e" /></>}
          {id === 'pet' && i % 3 === 1 && <><rect x="3" y="12" width="7" height="14" rx="3" fill={shade(c, -0.25)} /><rect x="30" y="12" width="7" height="14" rx="3" fill={shade(c, -0.25)} /></>}
          {id === 'pet' && i % 3 === 2 && <><polygon points="8,14 9,3 17,12" fill={c} /><polygon points="32,14 31,3 23,12" fill={c} /></>}
          <rect x="7" y="12" width="26" height="24" rx="4" fill={id === 'bunny' ? '#8be04e' : c} />
          <rect x="13" y="20" width="4" height="6" fill={S} stroke="none" /><rect x="23" y="20" width="4" height="6" fill={S} stroke="none" />
          <path d="M16 30 Q20 34 24 30" fill="none" strokeLinecap="round" />
        </g>
      )}
      {id === 'basket' && <g stroke={S} strokeWidth="2" strokeLinejoin="round"><path d="M10 18 Q20 2 30 18" fill="none" /><rect x="4" y="18" width="32" height="18" rx="4" fill="#d9a066" /><rect x="4" y="24" width="32" height="3" fill="#b07a40" stroke="none" /></g>}
      {id === 'pot' && <g stroke={S} strokeWidth="2" strokeLinejoin="round"><polygon points="6,14 34,14 30,37 10,37" fill="#e07a4f" /><rect x="4" y="10" width="32" height="7" rx="2" fill="#f0916a" /></g>}
      {id === 'nest' && <g stroke={S} strokeWidth="2" strokeLinejoin="round"><rect x="3" y="18" width="34" height="18" rx="8" fill="#b9854a" /><rect x="8" y="22" width="24" height="3" fill="#8a5d2b" stroke="none" /><rect x="8" y="29" width="24" height="3" fill="#8a5d2b" stroke="none" /></g>}
    </svg>
  )
}
