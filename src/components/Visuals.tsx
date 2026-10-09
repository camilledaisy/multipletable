import { useEffect, useState } from 'react'
import type { Story } from '../data/stories.ts'
import { noun } from '../data/stories.ts'
import { HolderIcon, ItemIcon } from '../art/Items.tsx'
import { Button } from '../ui/Controls.tsx'
import { useStore } from '../state/store.tsx'

const itemSize = (total: number) => (total <= 12 ? 30 : total <= 30 ? 24 : total <= 64 ? 18 : 14)
const cols = (b: number) => (b <= 4 ? b : b <= 6 ? 3 : b <= 8 ? 4 : b <= 10 ? 5 : 6)

interface GroupsProps {
  a: number
  b: number
  story: Story
  /** highlight the first `step` groups and dim the rest (counting together) */
  step?: number
  /** small "4" label under each group (hint) */
  counts?: boolean
  /** build mode: which groups are filled; tapping an empty one calls onFill */
  filled?: boolean[]
  onFill?: (i: number) => void
}

/** `a` equal groups of `b` items. */
export function GroupsView({ a, b, story, step, counts, filled, onFill }: GroupsProps) {
  const sz = itemSize(a * b)
  const hs = Math.max(30, sz + 12)
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3" role="img" aria-label={`${noun(a, story.holder)} with ${noun(b, story.item)} in each`}>
      {Array.from({ length: a }, (_, g) => {
        const on = step === undefined ? undefined : g < step
        const empty = filled && !filled[g]
        const inner = (
          <>
            <HolderIcon id={story.holder.id} size={hs} i={g} />
            {empty ? (
              <div className="grid place-items-center text-sm font-extrabold opacity-70" style={{ minHeight: sz * Math.ceil(b / cols(b)), minWidth: sz * cols(b) }}>Tap!</div>
            ) : (
              <div className="dotgrid" style={{ gridTemplateColumns: `repeat(${cols(b)}, ${sz}px)` }}>
                {Array.from({ length: b }, (_, k) => <ItemIcon key={k} id={story.item.id} size={sz} />)}
              </div>
            )}
            {counts && !empty && <span className="font-display text-lg leading-none">{b}</span>}
          </>
        )
        const cls = `grp ${on === false ? 'dim' : ''} ${on ? 'on' : ''}`
        return onFill && empty ? (
          <Button key={g} onClick={() => onFill(g)} aria-label={`Fill ${story.holder.s} ${g + 1} of ${a}`} className={`${cls} btn-white !flex-col !gap-1 !p-2 !min-h-0`}>{inner}</Button>
        ) : (
          <div key={g} className={cls}>{inner}</div>
        )
      })}
    </div>
  )
}

/** `a` rows × `b` columns, optionally highlighting the first `step` rows. */
export function ArrayView({ a, b, story, step }: { a: number; b: number; story: Story; step?: number }) {
  const m = Math.max(a, b)
  const sz = m <= 5 ? 36 : m <= 8 ? 30 : m <= 10 ? 26 : 22
  return (
    <div className="inline-grid gap-1 p-2 card" style={{ gridTemplateColumns: `repeat(${b}, ${sz}px)` }} role="img" aria-label={`${a} rows of ${b}`}>
      {Array.from({ length: a * b }, (_, i) => {
        const row = Math.floor(i / b)
        return <div key={i} className="grid place-items-center rounded-md" style={{ background: step !== undefined && row < step ? '#fff0a8' : 'transparent', opacity: step !== undefined && row >= step ? 0.35 : 1 }}><ItemIcon id={story.item.id} size={sz - 4} /></div>
      })}
    </div>
  )
}

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`

/** Step-through explanation. Every step is a tap: no timers, no rushing. */
export function CountTogether({ a, b, story, array, onDone, doneLabel = 'Now I will answer' }: { a: number; b: number; story: Story; array?: boolean; onDone: () => void; doneLabel?: string }) {
  const { say } = useStore()
  const [step, setStep] = useState(0)
  const running = Array.from({ length: step }, (_, i) => b * (i + 1)).join(', ')
  const text =
    step === 0
      ? "Let's count together! Tap Next."
      : step < a
        ? `${plural(step, array ? 'row' : 'group')}: ${running}`
        : `${a} × ${b} = ${a * b}. That is ${noun(a * b, story.item)} in all!`
  useEffect(() => { say(step === 0 ? "Let's count together!" : text) }, [step]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <section className="card p-4 sm:p-5 flex flex-col items-center gap-4 bg-[var(--card2)]" aria-label="Counting together">
      {array ? <ArrayView a={a} b={b} story={story} step={step} /> : <GroupsView a={a} b={b} story={story} step={step} counts />}
      <p className="text-2xl sm:text-3xl font-display text-center" aria-live="polite">{text}</p>
      {step < a ? <Button onClick={() => setStep(step + 1)} className="btn-lg btn-yellow">Next ➜</Button> : <Button onClick={onDone} className="btn-lg">{doneLabel}</Button>}
    </section>
  )
}
