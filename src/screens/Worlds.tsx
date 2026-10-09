import { useStore } from '../state/store.tsx'
import { Page } from '../ui/TopBar.tsx'
import { Button } from '../ui/Controls.tsx'
import { WORLDS, worldById } from '../data/worlds.ts'
import { LEVELS } from '../data/levels.ts'
import { Blocky } from '../art/Blocky.tsx'
import { PetSprite } from '../art/PetSprite.tsx'
import { Cloud, Island, Star } from '../art/Scenery.tsx'
import { petById } from '../data/pets.ts'
import type { Level } from '../data/levels.ts'

export function Worlds() {
  const { go } = useStore()
  return (
    <Page title="Choose a World">
      <div className="grid gap-4 sm:grid-cols-2">
        {WORLDS.map((w) => (
          <Button key={w.id} disabled={!w.open} onClick={() => go({ name: 'world', id: w.id })} className={`!flex-col !items-stretch !gap-2 !p-4 text-left ${w.open ? 'btn-white sm:col-span-2' : 'btn-white'}`} aria-label={`${w.name}${w.open ? '' : ', coming soon'}`}>
            <div className="rounded-2xl border-[3px] border-[var(--line)] flex items-center justify-center text-6xl py-5" style={{ background: `linear-gradient(${w.sky}, ${w.ground})`, filter: w.open ? undefined : 'grayscale(.7)' }} aria-hidden="true">{w.open ? w.icon : '🔒'}</div>
            <div className="text-2xl sm:text-3xl">{w.name}</div>
            <div className="text-base font-bold normal-case opacity-80">{w.open ? w.blurb : `Coming soon: ${w.blurb}`}</div>
          </Button>
        ))}
      </div>
    </Page>
  )
}

const stars = (done: number) => (done >= 5 ? 3 : done >= 3 ? 2 : done >= 1 ? 1 : 0)

export function WorldMap({ id }: { id: string }) {
  const { save, go } = useStore()
  const w = worldById(id)
  const pet = petById(save.activePet)
  const next = LEVELS.find((l) => !save.levels[l.id]?.done) ?? LEVELS[LEVELS.length - 1]
  const tableChip = (l: Level) => (l.tables ? l.tables.map((t) => `×${t}`).join(' ') : l.intro ? 'Groups' : 'Mixed')
  return (
    <Page title={w.name}>
      <section className="relative overflow-hidden rounded-[2rem] border-[3px] border-[var(--line)] p-4" style={{ background: `linear-gradient(${w.sky}, #fff 75%)` }}>
        <Cloud className="top-2 left-4" /><Cloud className="top-10 right-6 !w-20" delay={-5} />
        <div className="relative mx-auto mt-20 max-w-sm">
          <Island className="w-full" ground={w.ground} />
          <div className="absolute inset-x-0 bottom-[62%] flex items-end justify-center gap-2">
            <Blocky look={save.avatar} size={84} className="bob" />{pet && <PetSprite pet={pet} size={64} />}
          </div>
        </div>
        <p className="relative text-center text-xl font-display">Pick any level. Go at your own pace!</p>
      </section>
      <ol className="mt-4 flex flex-col gap-4">
        {LEVELS.map((l, i) => {
          const done = save.levels[l.id]?.done ?? 0
          const isNext = l.id === next.id
          return (
            <li key={l.id} className={`flex ${i % 2 ? 'sm:justify-end' : ''}`}>
              <Button onClick={() => go({ name: 'quest', world: id, level: l.id })} className={`w-full sm:w-[85%] !justify-start !gap-4 !p-3 text-left ${isNext ? 'btn-yellow' : 'btn-white'}`} aria-label={`Level ${l.id}, ${l.title}. ${tableChip(l)}. ${done} quests done.${isNext ? ' Try this next.' : ''}`}>
                <span className="grid place-items-center w-16 h-16 shrink-0 rounded-2xl border-[3px] border-[var(--line)] bg-[#4ade80] text-4xl font-display">{l.id}</span>
                <span className="flex-1 min-w-0">
                  <span className="block text-2xl">{l.title}</span>
                  <span className="block text-base font-bold opacity-80">{l.blurb} · {tableChip(l)}</span>
                </span>
                <span className="flex flex-col items-end gap-1">
                  {isNext && <span className="text-sm bg-white border-2 border-[var(--line)] rounded-lg px-2 py-0.5">⭐ Try next</span>}
                  <span className="flex" aria-hidden="true">{[0, 1, 2].map((s) => <Star key={s} on={s < stars(done)} />)}</span>
                </span>
              </Button>
            </li>
          )
        })}
      </ol>
    </Page>
  )
}
