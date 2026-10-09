// Run with `npm run check`: every question in every level must be mathematically sound.
import assert from 'node:assert/strict'
import { LEVELS } from '../src/data/levels.ts'
import { CHOICES, factKey, makeQuestion } from '../src/engine/questions.ts'
import { instruction } from '../src/data/stories.ts'

const all = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
for (const difficulty of ['gentle', 'standard', 'challenge'] as const) {
  for (const level of LEVELS) {
    const recent: string[] = []
    for (let i = 0; i < 400; i++) {
      const q = makeQuestion(level.id, { worldId: 'meadow', enabledTables: all, difficulty, facts: {}, recent, scaffold: i % 7 === 0 })
      recent.push(factKey(q.a, q.b)); recent.splice(0, recent.length - 4)
      assert.equal(q.answer, q.a * q.b)
      assert.ok(q.a >= 1 && q.b >= 1 && q.a <= 12 && q.b <= 12)
      assert.ok(q.choices.includes(q.answer))
      assert.equal(new Set(q.choices).size, q.choices.length, 'distinct choices')
      assert.ok(q.choices.every((c) => c > 0))
      assert.ok(q.choices.length <= CHOICES[difficulty] && q.choices.length >= 2)
      assert.deepEqual(q.choices, [...q.choices].sort((x, y) => x - y))
      if (q.kind === 'repeated') assert.equal(Array(q.a).fill(q.b).reduce((s, n) => s + n, 0), q.answer)
      assert.ok(instruction(q).length > 5)
    }
  }
}
// grown-up table filter: level 3 with only 3s enabled never asks 4s
for (let i = 0; i < 200; i++) {
  const q = makeQuestion(3, { worldId: 'meadow', enabledTables: [3], difficulty: 'standard', facts: {}, recent: [] })
  assert.ok(q.a === 3 || q.b === 3)
}
console.log('questions OK')
