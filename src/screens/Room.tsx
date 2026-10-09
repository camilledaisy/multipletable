import { useState } from 'react'
import { useStore } from '../state/store.tsx'
import { Page } from '../ui/TopBar.tsx'
import { Button } from '../ui/Controls.tsx'
import { Dialog } from '../ui/Dialog.tsx'
import { CATEGORIES, SHOP, itemById } from '../data/shop.ts'
import type { ShopCategory, ShopItem } from '../data/shop.ts'
import { petById } from '../data/pets.ts'
import { ShopIcon } from '../art/ShopIcon.tsx'
import { Blocky } from '../art/Blocky.tsx'
import { PetSprite } from '../art/PetSprite.tsx'
import { Coin } from '../art/Scenery.tsx'
import { sfx } from '../a11y/audio.ts'

const preview = (it: ShopItem) => it.bg ? <div className="w-14 h-14 rounded-xl border-[3px] border-[var(--line)]" style={{ background: it.bg }} /> : <ShopIcon id={it.id} />

export function Room() {
  const { save, buyItem, setWallpaper, setSlot, swapSlots, toast } = useStore()
  const [cat, setCat] = useState<ShopCategory>('Furniture')
  const [sel, setSel] = useState<number | null>(null)
  const [ask, setAsk] = useState<ShopItem | null>(null)
  const pet = petById(save.activePet)
  const wall = itemById(save.wallpaper)?.bg
  const bedSlot = save.placed.findIndex((p) => p && itemById(p)?.cat === 'Pet beds')

  const tapSlot = (i: number) => {
    sfx.tap()
    if (sel === null) return save.placed[i] ? setSel(i) : undefined
    if (sel !== i) swapSlots(sel, i)
    setSel(null)
  }
  const tapItem = (it: ShopItem) => {
    sfx.tap()
    if (!save.items.includes(it.id)) return save.coins >= it.price ? setAsk(it) : toast('🪙', `${it.price - save.coins} more coins to go. Keep playing!`)
    if (it.cat === 'Wallpaper') return setWallpaper(it.id)
    const at = save.placed.indexOf(it.id)
    if (at >= 0) return setSlot(at, null)
    const free = save.placed.indexOf(null)
    if (free < 0) return toast('📦', 'Your room is full. Tap an item in the room, then “Put away”.')
    setSlot(free, it.id)
  }

  return (
    <Page title="My Home">
      <section className="rounded-[2rem] border-[3px] border-[var(--line)] overflow-hidden" style={{ background: wall }} aria-label="Your room">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-5">
          {save.placed.map((id, i) => (
            <Button key={i} onClick={() => tapSlot(i)} aria-pressed={sel === i} aria-label={id ? `${itemById(id)?.name}, spot ${i + 1}${sel === i ? ', selected' : ''}` : `Empty spot ${i + 1}`}
              className={`relative !min-h-28 sm:!min-h-36 !p-1 ${id ? 'btn-white !bg-white/60' : '!bg-white/30 !border-dashed !border-b-[3px]'}`}>
              {id ? <ShopIcon id={id} size={88} /> : <span className="text-4xl opacity-40" aria-hidden="true">＋</span>}
              {pet && bedSlot === i && <span className="absolute bottom-1 right-1"><PetSprite pet={pet} size={52} /></span>}
            </Button>
          ))}
        </div>
        <div className="flex items-end justify-around px-4 pt-2 pb-3" style={{ background: 'repeating-linear-gradient(90deg,#d9a066 0 40px,#c98f55 40px 80px)', borderTop: '4px solid #1f2a44' }}>
          <Blocky look={save.avatar} size={96} />
          {pet && bedSlot < 0 && <PetSprite pet={pet} size={80} />}
        </div>
      </section>

      {sel !== null ? (
        <div className="card mt-3 p-3 flex flex-wrap items-center justify-center gap-3 bg-[#fff6c8]" role="status">
          <span className="text-lg font-display">Tap another spot to move it here</span>
          <Button onClick={() => { setSlot(sel, null); setSel(null) }} className="btn-orange">📦 Put away</Button>
          <Button onClick={() => setSel(null)} className="btn-white">Cancel</Button>
        </div>
      ) : <p className="text-center mt-2 text-base opacity-80">Tap something in your room to move or put it away.</p>}

      <div role="group" aria-label="Shop categories" className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-2">
        {CATEGORIES.map((c) => <Button key={c.id} onClick={() => setCat(c.id)} aria-pressed={cat === c.id} className={`!flex-col !gap-0 !min-h-16 !px-2 !text-base ${cat === c.id ? 'btn-yellow' : 'btn-white'}`}><span aria-hidden="true">{c.icon}</span> {c.id}</Button>)}
      </div>
      <ul className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SHOP.filter((i) => i.cat === cat).map((it) => {
          const owned = save.items.includes(it.id)
          const on = it.cat === 'Wallpaper' ? save.wallpaper === it.id : save.placed.includes(it.id)
          const can = save.coins >= it.price
          return (
            <li key={it.id}>
              <Button onClick={() => tapItem(it)} aria-disabled={!owned && !can} className={`w-full ${!owned && !can ? 'opacity-60' : ''} !flex-col !gap-1 !p-3 ${on ? 'btn-yellow' : 'btn-white'}`} aria-label={`${it.name}. ${owned ? (on ? 'In your home. Tap to ' + (it.cat === 'Wallpaper' ? 'keep' : 'put away') : 'Yours. Tap to use') : `${it.price} coins`}`}>
                {preview(it)}
                <span className="text-lg">{it.name}</span>
                <span className="text-base flex items-center gap-1">{owned ? (on ? '✔ In my home' : 'Mine · tap to use') : <><Coin size={22} /> {it.price}</>}</span>
              </Button>
            </li>
          )
        })}
      </ul>
      {ask && (
        <Dialog title={`Buy ${ask.name}?`} onClose={() => setAsk(null)}>
          <div className="flex flex-col items-center gap-3 text-center">
            {preview(ask)}
            <h2 className="text-3xl">Buy {ask.name} for {ask.price} coins?</h2>
            <div className="flex gap-3 flex-wrap justify-center">
              <Button className="btn-lg" onClick={() => { buyItem(ask.id); sfx.coin(); setAsk(null) }}>✔ Yes!</Button>
              <Button className="btn-lg btn-white" onClick={() => setAsk(null)}>✖ Not now</Button>
            </div>
          </div>
        </Dialog>
      )}
    </Page>
  )
}
