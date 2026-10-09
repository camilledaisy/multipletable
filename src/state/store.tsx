import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { AvatarLook, ParentSettings, Save, Settings } from '../types.ts'
import { makeDefaults } from './defaults.ts'
import { ACHIEVEMENTS } from '../data/achievements.ts'
import { itemById } from '../data/shop.ts'
import { petById } from '../data/pets.ts'
import { factKey } from '../engine/questions.ts'
import { setAudio, sfx } from '../a11y/audio.ts'
import { setSpeechRate, speak, stopSpeaking } from '../a11y/speech.ts'

export type Screen =
  | { name: 'home' } | { name: 'worlds' } | { name: 'world'; id: string }
  | { name: 'quest'; world: string; level: number }
  | { name: 'pets' } | { name: 'room' } | { name: 'avatar' } | { name: 'trophies' } | { name: 'parent' }

export interface Toast { id: number; icon: string; text: string }

const KEY = 'blocky-buddies-v1'

function load(): Save {
  const d = makeDefaults()
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return d
    const s = JSON.parse(raw) as Partial<Save>
    return {
      ...d, ...s,
      avatar: { ...d.avatar, ...s.avatar },
      settings: { ...d.settings, ...s.settings },
      parent: { ...d.parent, ...s.parent },
      totals: { ...d.totals, ...s.totals },
      placed: Array.from({ length: 6 }, (_, i) => s.placed?.[i] ?? null),
    }
  } catch { return d }
}

const PAUSE_GUARD = { relaxed: 900, normal: 600, quick: 300 }
export const SCAN_MS = { relaxed: 2800, normal: 1800, quick: 1100 }

function useStoreValue() {
  const [save, setSave] = useState<Save>(load)
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [paused, setPaused] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastId = useRef(0)

  // autosave locally (no account, nothing leaves the device)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(save)) } catch { /* private mode */ } }, [save])

  // apply accessibility settings to the page
  const { settings: st } = save
  useEffect(() => {
    const r = document.documentElement
    r.dataset.contrast = st.highContrast ? 'high' : 'normal'
    r.dataset.text = st.textSize
    r.dataset.motion = st.reducedMotion ? 'off' : st.motion
    r.style.setProperty('--amp', String(st.reducedMotion ? 0 : { gentle: 0.5, normal: 1, lively: 1.6 }[st.motion]))
    setAudio(st.volume, st.muted)
    setSpeechRate({ relaxed: 0.8, normal: 1, quick: 1.15 }[st.pace])
  }, [st])
  useEffect(() => { if (!st.narration || paused) stopSpeaking() }, [st.narration, paused])

  const toast = useCallback((icon: string, text: string) => {
    const id = ++toastId.current
    setToasts((t) => [...t, { id, icon, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 6000)
  }, [])

  // achievements: unlock + small coin gift
  useEffect(() => {
    const gained = ACHIEVEMENTS.filter((a) => !save.achievements.includes(a.id) && a.test(save))
    if (!gained.length) return
    setSave((s) => ({ ...s, achievements: [...s.achievements, ...gained.map((g) => g.id)], coins: s.coins + 10 * gained.length }))
    gained.forEach((g) => toast(g.icon, `${g.name}! +10 coins`))
    sfx.unlock()
  }, [save, toast])

  const update = useCallback((fn: (s: Save) => Save) => setSave(fn), [])

  const actions = useMemo(() => ({
    go: (s: Screen) => { setScreen(s); window.scrollTo(0, 0) },
    back: () => setScreen((s) => {
      window.scrollTo(0, 0)
      if (s.name === 'quest') return { name: 'world', id: s.world }
      if (s.name === 'world') return { name: 'worlds' }
      return { name: 'home' }
    }),
    openSettings: () => setSettingsOpen(true),
    closeSettings: () => setSettingsOpen(false),
    setPaused,
    toast,
    dismissToast: (id: number) => setToasts((t) => t.filter((x) => x.id !== id)),
    setSettings: (p: Partial<Settings>) => update((s) => ({ ...s, settings: { ...s.settings, ...p } })),
    setParent: (p: Partial<ParentSettings>) => update((s) => ({ ...s, parent: { ...s.parent, ...p } })),
    setAvatar: (p: Partial<AvatarLook>) => update((s) => ({ ...s, avatar: { ...s.avatar, ...p } })),
    /** Correct answers always earn coins. Help and retries never cost anything; retrying earns a star. */
    recordAnswer: (a: number, b: number, independent: boolean, tried: boolean, coins: number) => update((s) => {
      const k = factKey(a, b)
      const f = s.facts[k] ?? { seen: 0, firstTry: 0, helped: 0, streak: 0, last: 0 }
      return {
        ...s,
        coins: s.coins + coins,
        facts: { ...s.facts, [k]: { seen: f.seen + 1, firstTry: f.firstTry + (independent ? 1 : 0), helped: f.helped + (independent ? 0 : 1), streak: independent ? f.streak + 1 : 0, last: Date.now() } },
        totals: { ...s.totals, correct: s.totals.correct + 1, brave: s.totals.brave + (tried ? 1 : 0), earned: s.totals.earned + coins },
        stars: s.stars + (tried ? 1 : 0),
      }
    }),
    completeQuest: (level: number, bonus: number, gift: string | null) => update((s) => {
      const cur = s.levels[level] ?? { done: 0, lessonSeen: true }
      return {
        ...s,
        coins: s.coins + bonus,
        stars: s.stars + 1,
        levels: { ...s.levels, [level]: { ...cur, done: cur.done + 1 } },
        totals: { ...s.totals, quests: s.totals.quests + 1, earned: s.totals.earned + bonus },
        pets: gift && !s.pets.includes(gift) ? [...s.pets, gift] : s.pets,
        activePet: gift && !s.activePet ? gift : s.activePet,
      }
    }),
    markLessonSeen: (level: number) => update((s) => ({ ...s, levels: { ...s.levels, [level]: { done: s.levels[level]?.done ?? 0, lessonSeen: true } } })),
    buyPet: (id: string) => update((s) => {
      const p = petById(id)
      if (!p || s.pets.includes(id) || s.coins < p.price) return s
      return { ...s, coins: s.coins - p.price, pets: [...s.pets, id], activePet: s.activePet ?? id }
    }),
    setActivePet: (id: string) => update((s) => ({ ...s, activePet: id })),
    buyItem: (id: string) => update((s) => {
      const it = itemById(id)
      if (!it || s.items.includes(id) || s.coins < it.price) return s
      const slot = s.placed.indexOf(null)
      return {
        ...s, coins: s.coins - it.price, items: [...s.items, id],
        wallpaper: it.cat === 'Wallpaper' ? id : s.wallpaper,
        placed: it.cat !== 'Wallpaper' && slot >= 0 ? s.placed.map((p, i) => (i === slot ? id : p)) : s.placed,
      }
    }),
    setWallpaper: (id: string) => update((s) => ({ ...s, wallpaper: id })),
    /** Move/swap between spots, or put a new item in a spot (null item = clear). */
    setSlot: (slot: number, id: string | null) => update((s) => ({ ...s, placed: s.placed.map((p, i) => (i === slot ? id : p)) })),
    swapSlots: (x: number, y: number) => update((s) => {
      const placed = [...s.placed]
      ;[placed[x], placed[y]] = [placed[y], placed[x]]
      return { ...s, placed }
    }),
    reset: () => { setSave(makeDefaults()); setScreen({ name: 'home' }) },
  }), [toast, update])

  const guardMs = PAUSE_GUARD[st.pace]
  const say = useCallback((text: string, force = false) => { if (force || st.narration) speak(text) }, [st.narration])

  return { save, screen, settingsOpen, paused, toasts, guardMs, say, ...actions }
}

export type Store = ReturnType<typeof useStoreValue>
const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const v = useStoreValue()
  return <Ctx.Provider value={v}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const v = useContext(Ctx)
  if (!v) throw new Error('StoreProvider missing')
  return v
}
