import { useEffect, useState } from 'react'
import { STORIES, noun } from '../data/stories.ts'
import { levelById } from '../data/levels.ts'
import { ArrayView, GroupsView } from '../components/Visuals.tsx'
import { Button } from '../ui/Controls.tsx'
import { useStore } from '../state/store.tsx'

const EXAMPLE: Record<number, [number, number]> = { 1: [3, 2], 2: [2, 5], 3: [3, 4], 4: [3, 6], 5: [3, 8], 6: [2, 11], 7: [3, 4] }

/** "See it first": a short picture lesson before a level. Skippable, replayable from the map. */
export function Lesson({ levelId, onClose, repeatRef }: { levelId: number; onClose: () => void; repeatRef: React.MutableRefObject<() => void> }) {
  const { say } = useStore()
  const level = levelById(levelId)
  const [a, b] = EXAMPLE[levelId] ?? [3, 4]
  const story = STORIES.meadow[0]
  const [page, setPage] = useState(0)
  const sum = Array(a).fill(b).join(' + ')
  const pages = [
    { title: 'Equal groups', text: `${noun(a, story.holder)}, with ${noun(b, story.item)} in each. Every group is the same!`, view: <GroupsView a={a} b={b} story={story} /> },
    { title: 'Add the groups', text: `${sum} = ${a * b}`, view: <GroupsView a={a} b={b} story={story} counts /> },
    { title: 'Rows', text: `${a} rows of ${b} is ${a * b}`, view: <ArrayView a={a} b={b} story={story} /> },
    { title: 'Multiplication!', text: `${a} × ${b} = ${a * b}. “×” means “groups of”.`, view: <div className="text-6xl sm:text-8xl font-display card px-8 py-4">{a} × {b} = {a * b}</div> },
  ]
  const p = pages[page]
  repeatRef.current = () => say(`${p.title}. ${p.text}`, true)
  useEffect(() => { say(`${p.title}. ${p.text}`) }, [page]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="card p-4 sm:p-6 flex flex-col items-center gap-5 text-center">
      <div className="text-sm font-extrabold opacity-70">Level {level.id}: {level.title} · Picture {page + 1} of {pages.length}</div>
      <h2 className="text-3xl sm:text-4xl">{p.title}</h2>
      <div className="min-h-40 flex items-center justify-center w-full">{p.view}</div>
      <p className="text-2xl font-display" aria-live="polite">{p.text}</p>
      <div className="flex flex-wrap justify-center gap-3">
        {page > 0 && <Button onClick={() => setPage(page - 1)} className="btn-white">⬅ Back</Button>}
        {page < pages.length - 1 ? <Button onClick={() => setPage(page + 1)} className="btn-lg btn-yellow">Next ➜</Button> : <Button onClick={onClose} className="btn-lg">Let’s play! ▶</Button>}
        {page < pages.length - 1 && <Button onClick={onClose} className="btn-white">Skip</Button>}
      </div>
    </div>
  )
}
