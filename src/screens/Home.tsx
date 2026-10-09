import { useStore } from '../state/store.tsx'
import { Page } from '../ui/TopBar.tsx'
import { Button } from '../ui/Controls.tsx'
import { Blocky } from '../art/Blocky.tsx'
import { PetSprite } from '../art/PetSprite.tsx'
import { Cloud, Island } from '../art/Scenery.tsx'
import { petById } from '../data/pets.ts'

export function Home() {
  const { save, go } = useStore()
  const pet = petById(save.activePet)
  const tiles = [
    { icon: '🐾', label: 'My Pets', s: { name: 'pets' } as const, c: 'btn-pink', n: `${save.pets.length}/5` },
    { icon: '🏠', label: 'My Home', s: { name: 'room' } as const, c: 'btn-orange' },
    { icon: '👕', label: 'Dress Up', s: { name: 'avatar' } as const, c: 'btn-purple' },
    { icon: '🏆', label: 'Trophies', s: { name: 'trophies' } as const, c: 'btn-yellow' },
  ]
  return (
    <Page title="Welcome!">
      <section className="relative overflow-hidden rounded-[2rem] border-[3px] border-[var(--line)] bg-[var(--card2)] px-4 pt-6 pb-4 text-center">
        <Cloud className="top-4 left-2" /><Cloud className="top-16 right-2 !w-24" delay={-6} />
        <h2 className="relative text-5xl sm:text-7xl font-display" style={{ color: '#fff', textShadow: '0 4px 0 #1f2a44, 0 -2px 0 #1f2a44, 3px 0 0 #1f2a44, -3px 0 0 #1f2a44, 0 8px 0 rgb(31 42 68 / .25)' }}>Blocky Buddies</h2>
        <p className="relative mt-2 text-xl sm:text-2xl font-display bg-white/80 inline-block px-4 py-1 rounded-2xl border-[3px] border-[var(--line)]">Multiplication Adventure</p>
        <div className="relative mx-auto mt-32 max-w-md">
          <Island className="w-full" />
          <div className="absolute inset-x-0 bottom-[62%] flex items-end justify-center gap-3">
            <Blocky look={save.avatar} size={112} className="bob" />
            {pet && <PetSprite pet={pet} size={84} />}
          </div>
        </div>
        <div className="relative mt-3"><Button onClick={() => go({ name: 'worlds' })} className="btn-xl !text-4xl w-full max-w-md" aria-label="Play">▶ PLAY</Button></div>
      </section>
      <nav aria-label="Main menu" className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {tiles.map((t) => (
          <Button key={t.label} onClick={() => go(t.s)} className={`${t.c} !flex-col !min-h-36 !text-2xl`}>
            <span className="text-5xl" aria-hidden="true">{t.icon}</span>{t.label}{'n' in t && <span className="text-base font-extrabold">{t.n}</span>}
          </Button>
        ))}
      </nav>
      <div className="mt-5 flex justify-center"><Button onClick={() => go({ name: 'parent' })} className="btn-white !min-h-14 text-lg">🔒 Grown-ups</Button></div>
    </Page>
  )
}
