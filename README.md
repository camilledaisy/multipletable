# Blocky Buddies: Multiplication Adventure

A Roblox-inspired, fully accessible multiplication game (React + TypeScript + Tailwind). All progress is saved locally in the browser; no accounts, no tracking.

    npm install
    npm run dev      # play
    npm run build    # typecheck + production build
    npm run check    # verifies every generated question is mathematically correct

## Accessibility
No speech/mic, no timers, no dragging, no rapid clicking (taps are guarded against accidental repeats), keyboard (Tab/Enter/Space), touch, optional single-switch scanning, optional text-to-speech, volume/mute, reduced motion + animation size, no flashing, high contrast, text size, pause anywhere. Settings (♿) are on every screen; the Grown-ups page has the full set plus progress and controls.

## Extending
- New world: add to `src/data/worlds.ts` (`open: true`) and stories in `src/data/stories.ts`.
- New pet: push to `src/data/pets.ts`. New shop item: `src/data/shop.ts` (+ icon in `src/art/ShopIcon.tsx`).
- New activity type: add a `Kind` in `src/types.ts`, then `engine/questions.ts`, `data/stories.ts` (instruction) and `screens/Quest.tsx` (visual).
- Levels / curriculum: `src/data/levels.ts`. Adaptive logic: `weight()` in `engine/questions.ts`.
