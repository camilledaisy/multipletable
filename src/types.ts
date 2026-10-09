export type Pace = 'relaxed' | 'normal' | 'quick'
export type Difficulty = 'gentle' | 'standard' | 'challenge'
export type Kind = 'groups' | 'repeated' | 'array' | 'build' | 'choice'

export interface Settings {
  narration: boolean
  volume: number // 0..5
  muted: boolean
  reducedMotion: boolean
  motion: 'gentle' | 'normal' | 'lively'
  highContrast: boolean
  textSize: 'normal' | 'large' | 'xl'
  pace: Pace
  scanning: boolean
}

export interface ParentSettings {
  enabledTables: number[]
  difficulty: Difficulty
  questionsPerQuest: number
}

export interface AvatarLook {
  skin: string
  hairStyle: 'short' | 'spiky' | 'long' | 'none'
  hairColor: string
  shirt: string
  pants: string
  hat: 'none' | 'cap' | 'crown' | 'beanie' | 'party'
  face: 'smile' | 'grin' | 'cool' | 'starry'
}

/** One multiplication fact, keyed `min x max` (6x7 and 7x6 are the same fact). */
export interface FactStat {
  seen: number
  firstTry: number
  helped: number
  streak: number
  last: number
}

export interface Save {
  v: 1
  coins: number
  stars: number
  avatar: AvatarLook
  pets: string[]
  activePet: string | null
  items: string[]
  placed: (string | null)[]
  wallpaper: string
  levels: Record<number, { done: number; lessonSeen: boolean }>
  facts: Record<string, FactStat>
  achievements: string[]
  totals: { correct: number; brave: number; quests: number; earned: number }
  settings: Settings
  parent: ParentSettings
}
