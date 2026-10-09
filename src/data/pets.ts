export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary'

export interface Pet {
  id: string
  name: string
  kind: string
  rarity: Rarity
  price: number
  desc: string
  look: { body: string; accent: string; ears: 'long' | 'floppy' | 'pointy' | 'horns' | 'flame'; wings?: boolean; beak?: boolean }
}

export const RARITY_STYLE: Record<Rarity, { color: string; icon: string }> = {
  Common: { color: '#6b7a90', icon: '●' },
  Uncommon: { color: '#2f9e44', icon: '◆' },
  Rare: { color: '#1c7ed6', icon: '★' },
  Epic: { color: '#9c36b5', icon: '✦' },
  Legendary: { color: '#e08a00', icon: '♛' },
}

// Add a pet: just push another entry here.
export const PETS: Pet[] = [
  { id: 'clover', name: 'Clover', kind: 'Bunny', rarity: 'Common', price: 20, desc: 'Loves carrots and big hops.', look: { body: '#8be04e', accent: '#ffb3c7', ears: 'long' } },
  { id: 'bolt', name: 'Bolt', kind: 'Puppy', rarity: 'Uncommon', price: 40, desc: 'Always wags, never tires.', look: { body: '#4d8dff', accent: '#2b5fd1', ears: 'floppy' } },
  { id: 'pebble', name: 'Pebble', kind: 'Kitten', rarity: 'Rare', price: 80, desc: 'Cozy, quiet and very clever.', look: { body: '#aab2bf', accent: '#ffb3c7', ears: 'pointy' } },
  { id: 'ember', name: 'Ember', kind: 'Baby Dragon', rarity: 'Epic', price: 130, desc: 'Tiny wings, giant heart.', look: { body: '#9b5de5', accent: '#f5e6ff', ears: 'horns', wings: true } },
  { id: 'sunny', name: 'Sunny', kind: 'Golden Phoenix Chick', rarity: 'Legendary', price: 200, desc: 'Glows like the morning sun.', look: { body: '#ffc928', accent: '#ff7a1a', ears: 'flame', wings: true, beak: true } },
]

export const petById = (id: string | null) => PETS.find((p) => p.id === id) ?? null
