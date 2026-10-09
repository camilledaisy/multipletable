import { useState } from 'react'
import { useStore } from '../state/store.tsx'
import { Page } from '../ui/TopBar.tsx'
import { Button } from '../ui/Controls.tsx'
import { Dialog } from '../ui/Dialog.tsx'
import { PETS, RARITY_STYLE } from '../data/pets.ts'
import type { Pet } from '../data/pets.ts'
import { PetSprite } from '../art/PetSprite.tsx'
import { Coin } from '../art/Scenery.tsx'
import { sfx } from '../a11y/audio.ts'

export function Pets() {
  const { save, buyPet, setActivePet } = useStore()
  const [ask, setAsk] = useState<Pet | null>(null)
  return (
    <Page title="My Pets">
      <p className="text-center text-xl mb-4 font-display">Pets are yours forever. Collect them all! ({save.pets.length}/{PETS.length})</p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PETS.map((p) => {
          const has = save.pets.includes(p.id)
          const r = RARITY_STYLE[p.rarity]
          const can = save.coins >= p.price
          return (
            <li key={p.id} className="card p-4 flex flex-col items-center gap-2 text-center">
              <PetSprite pet={p} size={130} locked={!has} />
              <h2 className="text-2xl">{has ? p.name : '???'}</h2>
              <span className="px-3 py-0.5 rounded-lg border-[3px] border-[var(--line)] bg-white text-base" style={{ color: r.color }}><span aria-hidden="true">{r.icon} </span>{p.rarity}</span>
              <p className="text-base opacity-85 min-h-12">{has ? `${p.kind}. ${p.desc}` : `A ${p.rarity.toLowerCase()} friend is waiting for you.`}</p>
              {has ? (
                <Button onClick={() => setActivePet(p.id)} aria-pressed={save.activePet === p.id} className={save.activePet === p.id ? 'btn-yellow' : 'btn-white'}>{save.activePet === p.id ? '⭐ With me' : 'Take along'}</Button>
              ) : (
                <>
                  <Button onClick={() => setAsk(p)} disabled={!can} className="btn-blue"><Coin size={26} /> {p.price} Unlock</Button>
                  {!can && <p className="text-sm font-bold">{p.price - save.coins} more coins to go. Keep playing!</p>}
                </>
              )}
            </li>
          )
        })}
      </ul>
      {ask && (
        <Dialog title={`Unlock ${ask.name}?`} onClose={() => setAsk(null)}>
          <div className="flex flex-col items-center gap-3 text-center">
            <PetSprite pet={ask} size={120} />
            <h2 className="text-3xl">Unlock {ask.name} for {ask.price} coins?</h2>
            <div className="flex gap-3 flex-wrap justify-center">
              <Button className="btn-lg" onClick={() => { buyPet(ask.id); sfx.unlock(); setAsk(null) }}>✔ Yes!</Button>
              <Button className="btn-lg btn-white" onClick={() => setAsk(null)}>✖ Not now</Button>
            </div>
          </div>
        </Dialog>
      )}
    </Page>
  )
}
