import { useState } from 'react'
import { useStore } from '../state/store.tsx'
import { Page } from '../ui/TopBar.tsx'
import { Button, Segmented } from '../ui/Controls.tsx'
import { Dialog } from '../ui/Dialog.tsx'
import { AccessibilityControls } from './Settings.tsx'
import { LEVELS } from '../data/levels.ts'
import { factKey, levelPairs } from '../engine/questions.ts'
import type { FactStat } from '../types.ts'

const NUMS = Array.from({ length: 12 }, (_, i) => i + 1)

type Status = 'none' | 'new' | 'support' | 'growing' | 'strong'
const STATUS: Record<Status, { sym: string; bg: string; label: string }> = {
  none: { sym: '', bg: '#f1f3f5', label: 'not practised yet' },
  new: { sym: '○', bg: '#d0ebff', label: 'just started' },
  support: { sym: '!', bg: '#ffd8a8', label: 'needs more support' },
  growing: { sym: '↗', bg: '#fff3bf', label: 'growing' },
  strong: { sym: '✔', bg: '#b2f2bb', label: 'confident' },
}

function status(f?: FactStat): Status {
  if (!f || !f.seen) return 'none'
  const r = f.firstTry / f.seen
  if (f.seen < 2) return r === 1 ? 'new' : 'support'
  if (f.streak >= 3 || (r >= 0.8 && f.seen >= 3)) return 'strong'
  return r < 0.5 ? 'support' : 'growing'
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="card p-4 sm:p-5 flex flex-col gap-4"><h2 className="text-2xl">{title}</h2>{children}</section>
}

export function Parent() {
  const { save, setParent, setSettings, reset } = useStore()
  const [confirm, setConfirm] = useState(false)
  const p = save.parent
  const facts = Object.entries(save.facts)
  const practiced = facts.length
  const attempts = facts.reduce((n, [, f]) => n + f.seen, 0)
  const independent = facts.reduce((n, [, f]) => n + f.firstTry, 0)
  const support = facts.filter(([, f]) => status(f) === 'support').sort((x, y) => x[1].firstTry / x[1].seen - y[1].firstTry / y[1].seen)
  const toggle = (t: number) => {
    const on = p.enabledTables.includes(t)
    if (on && p.enabledTables.length === 1) return // always keep at least one table
    setParent({ enabledTables: on ? p.enabledTables.filter((x) => x !== t) : [...p.enabledTables, t].sort((a, b) => a - b) })
  }
  const pretty = (k: string) => k.replace('x', ' × ')
  return (
    <Page title="Grown-ups">
      <div className="flex flex-col gap-4">
        <p className="card p-4 text-base font-semibold">🔒 Everything stays on this device. There are no accounts, no scores to compare, and no rankings. This page is for a parent or older sibling.</p>

        <Section title="📊 Progress">
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[['Facts practised', `${practiced}/78`], ['Questions answered', save.totals.correct], ['Quests finished', save.totals.quests], ['Answered on their own', attempts ? `${Math.round((independent / attempts) * 100)}%` : '–']].map(([k, v]) => (
              <div key={String(k)} className="rounded-2xl border-[3px] border-[var(--line)] bg-[var(--card2)] p-3"><dd className="text-3xl font-display">{v}</dd><dt className="text-sm">{k}</dt></div>
            ))}
          </dl>
          <div>
            <h3 className="text-xl mb-2">Times table map</h3>
            <p className="text-sm mb-2">6 × 7 and 7 × 6 are the same fact. Symbols and colours both show how it is going.</p>
            <div className="overflow-x-auto">
              <div className="grid gap-[3px] min-w-[26rem]" style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }} role="table" aria-label="Times table progress">
                <div />
                {NUMS.map((n) => <div key={n} className="text-center font-display" role="columnheader">{n}</div>)}
                {NUMS.map((r) => (
                  <div key={r} className="contents" role="row">
                    <div className="font-display text-center self-center" role="rowheader">{r}</div>
                    {NUMS.map((c) => {
                      const s = status(save.facts[factKey(r, c)])
                      return <div key={c} role="cell" aria-label={`${r} times ${c}: ${STATUS[s].label}`} title={`${r} × ${c}: ${STATUS[s].label}`} className="aspect-square grid place-items-center rounded-md border-2 border-[var(--line)]/40 text-sm font-extrabold" style={{ background: STATUS[s].bg }}>{STATUS[s].sym}</div>
                    })}
                  </div>
                ))}
              </div>
            </div>
            <ul className="mt-3 flex flex-wrap gap-2 text-sm">
              {(Object.keys(STATUS) as Status[]).map((k) => <li key={k} className="flex items-center gap-1"><span className="w-6 h-6 grid place-items-center rounded-md border-2 border-[var(--line)]/40 font-extrabold" style={{ background: STATUS[k].bg }}>{STATUS[k].sym}</span>{STATUS[k].label}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-xl mb-2">Needs more support</h3>
            {support.length ? <ul className="flex flex-wrap gap-2">{support.slice(0, 12).map(([k]) => <li key={k} className="rounded-xl bg-[#ffd8a8] border-2 border-[var(--line)] px-3 py-1 text-lg font-display">{pretty(k)}</li>)}</ul> : <p>Nothing yet. These facts will appear here as they come up.</p>}
            <p className="text-sm mt-2">The game already repeats these with different pictures. Tip: sit together and count the groups out loud.</p>
          </div>
          <div>
            <h3 className="text-xl mb-2">By level</h3>
            <ul className="flex flex-col gap-2">
              {LEVELS.map((l) => {
                const pairs = levelPairs(l, NUMS)
                const keys = [...new Set(pairs.map(([a, b]) => factKey(a, b)))]
                const seen = keys.filter((k) => save.facts[k]).length
                const sup = keys.filter((k) => status(save.facts[k]) === 'support').length
                return <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[var(--card2)] border-2 border-[var(--line)] px-3 py-2"><span className="text-lg font-display">Level {l.id}: {l.title}</span><span className="text-sm">{save.levels[l.id]?.done ?? 0} quests · {seen}/{keys.length} facts{sup ? ` · ${sup} need support` : ''}</span></li>
              })}
            </ul>
          </div>
        </Section>

        <Section title="🎮 Game settings">
          <div role="group" aria-label="Tables available">
            <h3 className="text-xl mb-1">Tables to practise</h3>
            <p className="text-sm mb-2">Levels only use the tables you leave on (a level with none of its tables on uses its own).</p>
            <div className="flex flex-wrap gap-2">
              {NUMS.map((t) => <Button key={t} aria-pressed={p.enabledTables.includes(t)} onClick={() => toggle(t)} className={`!min-w-16 !px-3 ${p.enabledTables.includes(t) ? 'btn-yellow' : 'btn-white'}`}>{p.enabledTables.includes(t) ? '✔ ' : ''}{t}</Button>)}
              <Button onClick={() => setParent({ enabledTables: [...NUMS] })} className="btn-blue">All</Button>
            </div>
          </div>
          <Segmented icon="🎚️" label="Difficulty (number of answers to pick from)" value={p.difficulty} onChange={(v) => setParent({ difficulty: v })} options={[{ v: 'gentle', text: 'Gentle · 2' }, { v: 'standard', text: 'Standard · 3' }, { v: 'challenge', text: 'Challenge · 4' }]} />
          <Segmented icon="🔢" label="Questions in each quest" value={p.questionsPerQuest} onChange={(v) => setParent({ questionsPerQuest: v })} options={[3, 5, 8].map((n) => ({ v: n, text: String(n) }))} />
          <Segmented icon="🗣️" label="Read to me (narration)" value={save.settings.narration ? 'on' : 'off'} onChange={(v) => setSettings({ narration: v === 'on' })} options={[{ v: 'on', text: 'On' }, { v: 'off', text: 'Off' }]} />
          <p className="text-sm">The game also adapts by itself: facts that were hard come back with new pictures, and after two tricky answers in a row it shows more pictures and fewer choices.</p>
        </Section>

        <Section title="♿ Accessibility"><AccessibilityControls /></Section>

        <Section title="🗂️ Progress data">
          <p>Saved only in this browser. Resetting erases coins, pets, decorations and practice history.</p>
          <Button onClick={() => setConfirm(true)} className="btn-orange self-start">Reset all progress…</Button>
        </Section>
      </div>
      {confirm && (
        <Dialog title="Reset all progress?" onClose={() => setConfirm(false)}>
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-3xl">Erase everything?</h2>
            <p>This removes all coins, pets, home items and progress. It cannot be undone.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button className="btn-lg" onClick={() => setConfirm(false)}>Keep my progress</Button>
              <Button className="btn-orange" onClick={() => { reset(); setConfirm(false) }}>Yes, erase</Button>
            </div>
          </div>
        </Dialog>
      )}
    </Page>
  )
}
