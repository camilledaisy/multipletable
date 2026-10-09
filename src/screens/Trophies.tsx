import { useStore } from '../state/store.tsx'
import { Page } from '../ui/TopBar.tsx'
import { ACHIEVEMENTS } from '../data/achievements.ts'

export function Trophies() {
  const { save } = useStore()
  const n = save.achievements.length
  return (
    <Page title="Trophies">
      <p className="text-center text-xl mb-4 font-display">{n} of {ACHIEVEMENTS.length} trophies. Trying counts as much as winning!</p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {ACHIEVEMENTS.map((a) => {
          const got = save.achievements.includes(a.id)
          return (
            <li key={a.id} className={`card p-4 flex items-center gap-4 ${got ? 'bg-[#fff6c8]' : 'opacity-70'}`}>
              <span className="text-5xl w-16 text-center" aria-hidden="true" style={{ filter: got ? undefined : 'grayscale(1)' }}>{a.icon}</span>
              <div><h2 className="text-xl">{a.name} {got && <span aria-label="unlocked">✔</span>}</h2><p className="text-base opacity-85">{a.desc}</p></div>
            </li>
          )
        })}
      </ul>
    </Page>
  )
}
