import type { Difficulty, FactStat, Kind } from '../types.ts'
import { levelById } from '../data/levels.ts'
import type { Level } from '../data/levels.ts'
import { STORIES } from '../data/stories.ts'
import type { Story } from '../data/stories.ts'

export interface Question {
  id: string
  kind: Kind
  a: number // number of groups / rows
  b: number // size of each group / columns
  answer: number
  choices: number[]
  story: Story
}

export interface Opts {
  worldId: string
  enabledTables: number[]
  difficulty: Difficulty
  facts: Record<string, FactStat>
  /** fact keys asked recently (avoid immediate repeats) */
  recent: string[]
  lastKind?: Kind
  /** player is having a tough time: pick visual kinds, fewer choices */
  scaffold?: boolean
  /** force this pair (follow-up on a missed fact) with a different kind/story */
  pair?: [number, number]
  avoidKind?: Kind
  avoidStory?: Story
  rng?: () => number
}

export const factKey = (a: number, b: number) => `${Math.min(a, b)}x${Math.max(a, b)}`
export const CHOICES: Record<Difficulty, number> = { gentle: 2, standard: 3, challenge: 4 }

export function levelPairs(level: Level, enabled: number[]): [number, number][] {
  const out: [number, number][] = []
  if (level.intro) {
    for (let a = 1; a <= 5; a++) for (let b = 1; b <= level.others[1]; b++) out.push([a, b])
    return out
  }
  let tables = level.tables ?? enabled
  if (level.tables) {
    const ok = level.tables.filter((t) => enabled.includes(t))
    tables = ok.length ? ok : level.tables // never lock the child out of a level
  } else if (!tables.length) tables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  for (const t of tables) for (let o = level.others[0]; o <= level.others[1]; o++) out.push([t, o])
  return out
}

/** Unseen facts and facts that needed help come up more; mastered ones fade back. */
export function weight(f?: FactStat): number {
  if (!f || !f.seen) return 2
  const w = 1 + 3 * (1 - f.firstTry / f.seen)
  return f.streak >= 3 ? w * 0.4 : w
}

const pick = <T>(xs: T[], rng: () => number) => xs[Math.floor(rng() * xs.length)]

function weighted<T>(xs: T[], w: (x: T) => number, rng: () => number): T {
  const total = xs.reduce((s, x) => s + w(x), 0)
  let r = rng() * total
  for (const x of xs) if ((r -= w(x)) < 0) return x
  return xs[xs.length - 1]
}

function feasible(kind: Kind, a: number, b: number): boolean {
  if (kind === 'repeated') return a <= 8
  if (kind === 'build') return a <= 6 && b <= 6
  return true
}

export function makeChoices(a: number, b: number, count: number, rng: () => number): number[] {
  const ans = a * b
  const near = [a * (b + 1), a * (b - 1), (a + 1) * b, (a - 1) * b, a + b, ans + 1, ans - 1, ans + 2, ans - 2, ans + 10, ans - 10]
  const cands = [...new Set(near)].filter((n) => n > 0 && n !== ans)
  const out = new Set<number>()
  while (out.size < count - 1 && cands.length) out.add(cands.splice(Math.floor(rng() * cands.length), 1)[0])
  for (let k = 1; out.size < count - 1; k++) if (ans + k !== ans) out.add(ans + k)
  // sorted so the layout is always predictable (like 7, 12, 15)
  return [ans, ...out].sort((x, y) => x - y)
}

export function makeQuestion(levelId: number, o: Opts): Question {
  const rng = o.rng ?? Math.random
  const level = levelById(levelId)
  let t: number, other: number
  if (o.pair) [t, other] = o.pair
  else {
    let pool = levelPairs(level, o.enabledTables)
    const fresh = pool.filter(([x, y]) => !o.recent.includes(factKey(x, y)))
    if (fresh.length) pool = fresh
    ;[t, other] = weighted(pool, ([x, y]) => weight(o.facts[factKey(x, y)]), rng)
  }
  let [a, b] = rng() < 0.5 ? [t, other] : [other, t]
  if (a > 8 && b < a) [a, b] = [b, a] // keep group counts readable
  let kinds = level.kinds.filter((k) => feasible(k, a, b) && k !== o.avoidKind)
  if (o.scaffold) kinds = kinds.filter((k) => k !== 'choice')
  if (!kinds.length) kinds = ['groups']
  const nonRepeat = kinds.filter((k) => k !== o.lastKind)
  const kind = pick(nonRepeat.length ? nonRepeat : kinds, rng)
  const stories = STORIES[o.worldId] ?? STORIES.meadow
  const others = stories.filter((s) => s !== o.avoidStory)
  const story = pick(others.length ? others : stories, rng)
  const count = o.scaffold ? Math.min(2, CHOICES[o.difficulty]) : CHOICES[o.difficulty]
  return { id: `${a}x${b}-${kind}-${Math.floor(rng() * 1e9)}`, kind, a, b, answer: a * b, choices: makeChoices(a, b, count, rng), story }
}
