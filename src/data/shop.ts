export type ShopCategory = 'Wallpaper' | 'Furniture' | 'Plants' | 'Pet beds' | 'Fun'

export interface ShopItem { id: string; name: string; cat: ShopCategory; price: number; bg?: string }

export const CATEGORIES: { id: ShopCategory; icon: string }[] = [
  { id: 'Wallpaper', icon: '🎨' }, { id: 'Furniture', icon: '🛋️' }, { id: 'Plants', icon: '🪴' }, { id: 'Pet beds', icon: '🐾' }, { id: 'Fun', icon: '🎈' },
]

// Wallpapers are CSS backgrounds; everything else is drawn in art/ShopIcon.tsx by id.
export const SHOP: ShopItem[] = [
  { id: 'w-sunny', name: 'Sunny Walls', cat: 'Wallpaper', price: 0, bg: '#ffe9a8' },
  { id: 'w-sky', name: 'Sky Blue', cat: 'Wallpaper', price: 40, bg: 'radial-gradient(circle at 20% 30%, #fff 0 8%, transparent 9%), radial-gradient(circle at 70% 55%, #fff 0 10%, transparent 11%), #a9ddff' },
  { id: 'w-mint', name: 'Mint Stripes', cat: 'Wallpaper', price: 40, bg: 'repeating-linear-gradient(90deg, #c8f5dd 0 28px, #a6ecc6 28px 56px)' },
  { id: 'w-pink', name: 'Candy Pink', cat: 'Wallpaper', price: 40, bg: 'repeating-linear-gradient(45deg, #ffd3e8 0 22px, #ffc0de 22px 44px)' },
  { id: 'w-star', name: 'Starry Night', cat: 'Wallpaper', price: 70, bg: 'radial-gradient(circle at 15% 25%, #ffe680 0 2%, transparent 2.5%), radial-gradient(circle at 60% 20%, #ffe680 0 2%, transparent 2.5%), radial-gradient(circle at 85% 60%, #ffe680 0 2%, transparent 2.5%), radial-gradient(circle at 35% 65%, #ffe680 0 2%, transparent 2.5%), #2d3a7c' },
  { id: 'sofa', name: 'Cozy Sofa', cat: 'Furniture', price: 35 },
  { id: 'table', name: 'Wood Table', cat: 'Furniture', price: 25 },
  { id: 'shelf', name: 'Book Shelf', cat: 'Furniture', price: 40 },
  { id: 'lamp', name: 'Block Lamp', cat: 'Furniture', price: 20 },
  { id: 'cactus', name: 'Happy Cactus', cat: 'Plants', price: 15 },
  { id: 'flowerpot', name: 'Flower Pot', cat: 'Plants', price: 20 },
  { id: 'tree', name: 'Little Tree', cat: 'Plants', price: 30 },
  { id: 'bed-round', name: 'Round Pet Bed', cat: 'Pet beds', price: 25 },
  { id: 'bed-cushion', name: 'Soft Cushion', cat: 'Pet beds', price: 30 },
  { id: 'balloon', name: 'Balloons', cat: 'Fun', price: 15 },
  { id: 'rug', name: 'Rainbow Rug', cat: 'Fun', price: 30 },
  { id: 'trophy', name: 'Gold Trophy', cat: 'Fun', price: 45 },
  { id: 'poster', name: 'Cool Poster', cat: 'Fun', price: 20 },
]

export const itemById = (id: string) => SHOP.find((i) => i.id === id)
