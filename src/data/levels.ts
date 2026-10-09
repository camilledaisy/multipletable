import type { Kind } from '../types.ts'

export interface Level {
  id: number
  title: string
  blurb: string
  /** Tables this level practises. null = whatever the grown-up enabled. Level 1 is concept-only. */
  tables: number[] | null
  others: [number, number]
  kinds: Kind[]
  /** Level 1 only: small groups, tables don't apply. */
  intro?: boolean
}

export const LEVELS: Level[] = [
  { id: 1, title: 'Equal Groups', blurb: 'Same number in every group', tables: null, others: [1, 4], kinds: ['groups', 'build'], intro: true },
  { id: 2, title: '1s, 2s, 5s & 10s', blurb: 'Easy friends', tables: [1, 2, 5, 10], others: [1, 10], kinds: ['groups', 'repeated', 'array'] },
  { id: 3, title: '3s & 4s', blurb: 'Count by 3 and 4', tables: [3, 4], others: [1, 10], kinds: ['groups', 'repeated', 'array', 'choice'] },
  { id: 4, title: '6s & 7s', blurb: 'Getting bigger', tables: [6, 7], others: [1, 10], kinds: ['groups', 'repeated', 'array', 'choice'] },
  { id: 5, title: '8s & 9s', blurb: 'Big numbers', tables: [8, 9], others: [1, 10], kinds: ['groups', 'array', 'repeated', 'choice'] },
  { id: 6, title: '11s & 12s', blurb: 'The biggest groups', tables: [11, 12], others: [1, 12], kinds: ['groups', 'array', 'choice'] },
  { id: 7, title: 'Mix It Up', blurb: 'All your tables together', tables: null, others: [1, 12], kinds: ['groups', 'repeated', 'array', 'build', 'choice'] },
]

export const levelById = (id: number) => LEVELS.find((l) => l.id === id) ?? LEVELS[0]
