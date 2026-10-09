import type { Pet } from '../data/pets.ts'
import { shade } from './Blocky.tsx'

const S = '#1f2a44'

/** Blocky pet drawn from its `look` data. Idle bob + blink come from CSS (.pet-idle, .pet-blink). */
export function PetSprite({ pet, size = 96, idle = true, locked = false }: { pet: Pet; size?: number; idle?: boolean; locked?: boolean }) {
  const { body, accent, ears, wings, beak } = pet.look
  const delay = `${(pet.id.length % 5) * -0.7}s`
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={idle && !locked ? 'pet-idle' : ''} style={{ animationDelay: delay, filter: locked ? 'brightness(0) opacity(.28)' : undefined }} role="img" aria-label={locked ? 'Locked pet' : `${pet.name} the ${pet.kind}`}>
      <ellipse cx="46" cy="92" rx="30" ry="5" fill="#000" opacity=".12" />
      {wings && <g className="pet-wing"><polygon points="20,50 2,38 6,68 20,70" fill={shade(body, -0.1)} stroke={S} strokeWidth="2" strokeLinejoin="round" /><polygon points="76,50 94,38 90,68 76,70" fill={shade(body, -0.1)} stroke={S} strokeWidth="2" strokeLinejoin="round" /></g>}
      {ears === 'long' && <g stroke={S} strokeWidth="2"><rect x="26" y="4" width="11" height="32" rx="4" fill={body} /><rect x="29" y="9" width="5" height="22" rx="2" fill={accent} stroke="none" /><rect x="52" y="4" width="11" height="32" rx="4" fill={body} /><rect x="55" y="9" width="5" height="22" rx="2" fill={accent} stroke="none" /></g>}
      {ears === 'pointy' && <g stroke={S} strokeWidth="2" strokeLinejoin="round"><polygon points="22,36 24,14 40,34" fill={body} /><polygon points="26,33 27,21 35,32" fill={accent} stroke="none" /><polygon points="68,36 66,14 50,34" fill={body} /><polygon points="64,33 63,21 55,32" fill={accent} stroke="none" /></g>}
      {ears === 'floppy' && <g stroke={S} strokeWidth="2"><rect x="10" y="34" width="14" height="30" rx="5" fill={accent} /><rect x="68" y="34" width="14" height="30" rx="5" fill={accent} /></g>}
      {ears === 'horns' && <g stroke={S} strokeWidth="2" strokeLinejoin="round"><polygon points="24,36 20,12 36,32" fill={accent} /><polygon points="66,36 70,12 54,32" fill={accent} /></g>}
      {ears === 'flame' && <g stroke={S} strokeWidth="2" strokeLinejoin="round"><polygon points="36,34 40,12 46,26 52,6 58,26 64,14 62,34" fill={accent} /><polygon points="44,34 47,22 52,16 56,34" fill="#ffe27a" stroke="none" /></g>}
      {/* cube head */}
      <polygon points="72,34 84,22 84,70 72,82" fill={shade(body, -0.2)} stroke={S} strokeWidth="2" strokeLinejoin="round" />
      <polygon points="20,34 32,22 84,22 72,34" fill={shade(body, 0.25)} stroke={S} strokeWidth="2" strokeLinejoin="round" />
      <rect x="20" y="34" width="52" height="48" rx="5" fill={body} stroke={S} strokeWidth="2" />
      <g className="pet-blink" fill={S}><rect x="30" y="48" width="7" height="10" rx="2" /><rect x="55" y="48" width="7" height="10" rx="2" /></g>
      <rect x="32" y="50" width="2.5" height="3" fill="#fff" /><rect x="57" y="50" width="2.5" height="3" fill="#fff" />
      <rect x="23" y="62" width="8" height="5" rx="2" fill="#ff8aa5" opacity=".6" /><rect x="61" y="62" width="8" height="5" rx="2" fill="#ff8aa5" opacity=".6" />
      {beak ? <polygon points="40,60 52,60 46,70" fill="#ff8a1a" stroke={S} strokeWidth="1.5" strokeLinejoin="round" /> : <path d="M41 64 Q46 70 51 64" stroke={S} strokeWidth="2.5" fill="none" strokeLinecap="round" />}
    </svg>
  )
}
