export interface World {
  id: string
  name: string
  blurb: string
  icon: string
  sky: string
  ground: string
  /** Only open worlds have stories + a level map. Add a world: new entry + stories in data/stories.ts. */
  open: boolean
  npc: { name: string; shirt: string; hat: 'none' | 'cap' | 'crown' | 'beanie' | 'party'; skin: string }
}

export const WORLDS: World[] = [
  { id: 'meadow', name: 'Blocky Meadow', blurb: 'Green hills and friendly animals', icon: '🌼', sky: '#9fe0ff', ground: '#6bd66b', open: true, npc: { name: 'Farmer Fern', shirt: '#ef6a6a', hat: 'cap', skin: '#f1c27d' } },
  { id: 'candy', name: 'Candy Kingdom', blurb: 'Help the sweet shopkeepers', icon: '🍭', sky: '#ffd1ec', ground: '#ff9ad5', open: false, npc: { name: 'Sir Sprinkles', shirt: '#ff7ac8', hat: 'crown', skin: '#e0ac69' } },
  { id: 'ocean', name: 'Ocean Adventure', blurb: 'Fill an aquarium with sea friends', icon: '🐠', sky: '#7fd8ff', ground: '#2f9bd6', open: false, npc: { name: 'Captain Coral', shirt: '#2fb6c9', hat: 'beanie', skin: '#c68642' } },
  { id: 'space', name: 'Space Station', blurb: 'Repair robots and collect stars', icon: '🚀', sky: '#3a3f8f', ground: '#8b93d6', open: false, npc: { name: 'Pilot Nova', shirt: '#9b6bff', hat: 'cap', skin: '#f1c27d' } },
  { id: 'dragon', name: 'Dragon Island', blurb: 'Hatch eggs and meet baby dragons', icon: '🐉', sky: '#ffcf8f', ground: '#e8844a', open: false, npc: { name: 'Ember the Keeper', shirt: '#f08a24', hat: 'party', skin: '#8d5524' } },
]

export const worldById = (id: string) => WORLDS.find((w) => w.id === id) ?? WORLDS[0]
