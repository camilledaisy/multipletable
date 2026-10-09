import type { Save } from '../types.ts'

export interface Achievement { id: string; name: string; icon: string; desc: string; test: (s: Save) => boolean }

const factsPracticed = (s: Save) => Object.keys(s.facts).length
const levelsDone = (s: Save) => Object.values(s.levels).filter((l) => l.done > 0).length

// Effort-based on purpose: persistence and exploring count as much as being right.
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-answer', name: 'First Step', icon: '👣', desc: 'Answer your first question', test: (s) => s.totals.correct >= 1 },
  { id: 'brave', name: 'Brave Tries', icon: '💪', desc: 'Keep trying until you get it', test: (s) => s.totals.brave >= 1 },
  { id: 'brave-5', name: 'Never Give Up', icon: '🦸', desc: 'Keep trying 5 times', test: (s) => s.totals.brave >= 5 },
  { id: 'first-quest', name: 'Quest Hero', icon: '🏅', desc: 'Finish a quest', test: (s) => s.totals.quests >= 1 },
  { id: 'quests-5', name: 'Adventurer', icon: '🧭', desc: 'Finish 5 quests', test: (s) => s.totals.quests >= 5 },
  { id: 'correct-25', name: 'Math Explorer', icon: '🔭', desc: 'Answer 25 questions', test: (s) => s.totals.correct >= 25 },
  { id: 'facts-10', name: 'Fact Finder', icon: '🔎', desc: 'Practice 10 different facts', test: (s) => factsPracticed(s) >= 10 },
  { id: 'levels-3', name: 'Path Walker', icon: '🥾', desc: 'Finish 3 different levels', test: (s) => levelsDone(s) >= 3 },
  { id: 'first-pet', name: 'New Friend', icon: '🐾', desc: 'Get your first pet', test: (s) => s.pets.length >= 1 },
  { id: 'pets-all', name: 'Pet Collector', icon: '🏆', desc: 'Collect every pet', test: (s) => s.pets.length >= 5 },
  { id: 'decorator', name: 'Home Designer', icon: '🏠', desc: 'Put 3 things in your home', test: (s) => s.placed.filter(Boolean).length >= 3 },
  { id: 'rich', name: 'Coin Collector', icon: '🪙', desc: 'Earn 100 coins', test: (s) => s.totals.earned >= 100 },
]
