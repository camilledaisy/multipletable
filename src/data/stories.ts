import type { Kind } from '../types.ts'

export interface Noun { id: string; s: string; p: string }
export interface Story { holder: Noun; item: Noun }

export const noun = (c: number, n: Noun) => `${c} ${c === 1 ? n.s : n.p}`

const N = (id: string, s: string, p = s + 's'): Noun => ({ id, s, p })

/** Stories per world. Each is a holder (pet, basket…) that has equal numbers of an item. */
export const STORIES: Record<string, Story[]> = {
  meadow: [
    { holder: N('pet', 'pet'), item: N('treat', 'treat') },
    { holder: N('basket', 'basket'), item: N('apple', 'apple') },
    { holder: N('pot', 'pot'), item: N('flower', 'flower') },
    { holder: N('nest', 'nest'), item: N('egg', 'egg') },
    { holder: N('bunny', 'bunny', 'bunnies'), item: N('carrot', 'carrot') },
  ],
}

export interface QuestionLike { kind: Kind; a: number; b: number; story: Story }

/** The one clear instruction for a question (also what gets read aloud). */
export function instruction(q: QuestionLike): string {
  const { a, b, story: { holder: h, item: i } } = q
  switch (q.kind) {
    case 'groups':
      return h.id === 'pet'
        ? `Help me feed my pets! I have ${noun(a, h)}, and each needs ${noun(b, i)}. How many ${i.p} do I need?`
        : `I have ${noun(a, h)} with ${noun(b, i)} in each. How many ${i.p} in all?`
    case 'repeated':
      return `Add up the groups: ${Array(a).fill(b).join(' + ')}. How many ${i.p} in all?`
    case 'array':
      return `Here are ${noun(a, { id: '', s: 'row', p: 'rows' })} with ${noun(b, i)} in each row. How many ${i.p} in all?`
    case 'build':
      return `Put ${noun(b, i)} in each ${h.s}. Tap a ${h.s} to fill it.`
    case 'choice':
      return `What is ${a} × ${b}?`
  }
}

export const buildDoneText = (q: QuestionLike) => `Great! ${q.a} groups of ${q.b}. How many ${q.story.item.p} in all?`
