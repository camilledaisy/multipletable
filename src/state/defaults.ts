import type { Save } from '../types.ts'
import { DEFAULT_AVATAR } from '../data/avatar.ts'

const prefersReduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

export const makeDefaults = (): Save => ({
  v: 1,
  coins: 0,
  stars: 0,
  avatar: { ...DEFAULT_AVATAR },
  pets: [],
  activePet: null,
  items: ['w-sunny'],
  placed: Array(6).fill(null),
  wallpaper: 'w-sunny',
  levels: {},
  facts: {},
  achievements: [],
  totals: { correct: 0, brave: 0, quests: 0, earned: 0 },
  settings: {
    narration: false, volume: 3, muted: false, reducedMotion: prefersReduced(), motion: 'normal',
    highContrast: false, textSize: 'normal', pace: 'normal', scanning: false,
  },
  parent: { enabledTables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], difficulty: 'standard', questionsPerQuest: 5 },
})
