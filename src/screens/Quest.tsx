import { useEffect, useRef, useState } from 'react'
import type { Kind } from '../types.ts'
import { useStore } from '../state/store.tsx'
import { levelById } from '../data/levels.ts'
import { worldById } from '../data/worlds.ts'
import { petById } from '../data/pets.ts'
import { buildDoneText, instruction, noun } from '../data/stories.ts'
import type { Story } from '../data/stories.ts'
import { factKey, makeQuestion } from '../engine/questions.ts'
import type { Question } from '../engine/questions.ts'
import { sfx } from '../a11y/audio.ts'
import { Page } from '../ui/TopBar.tsx'
import { Button } from '../ui/Controls.tsx'
import { Blocky } from '../art/Blocky.tsx'
import { PetSprite } from '../art/PetSprite.tsx'
import { Coin, Star } from '../art/Scenery.tsx'
import { ArrayView, CountTogether, GroupsView } from '../components/Visuals.tsx'
import { Lesson } from './Lesson.tsx'

const COIN_PER_ANSWER = 5
const COIN_BONUS = 10
const CHEER = ['Yes! Great job!', 'You did it!', 'Super!', 'Awesome!', 'Nice thinking!']
const BRAVE = ['You kept trying. That is how we grow!', 'Brave try! You got it!', 'Great teamwork!']
const CHOICE_COLORS = ['btn-blue', 'btn-pink', 'btn-yellow', 'btn-purple']

export function Quest({ worldId, levelId }: { worldId: string; levelId: number }) {
  const { save, markLessonSeen } = useStore()
  const [lesson, setLesson] = useState(!save.levels[levelId]?.lessonSeen)
  const [round, setRound] = useState(0)
  const repeatRef = useRef<() => void>(() => {})
  const level = levelById(levelId)
  const close = () => { markLessonSeen(levelId); setLesson(false) }
  return (
    <Page title={`Level ${level.id}: ${level.title}`} onRepeat={() => repeatRef.current()}>
      {lesson ? <Lesson levelId={levelId} onClose={close} repeatRef={repeatRef} /> : <Round key={round} repeatRef={repeatRef} worldId={worldId} levelId={levelId} again={() => setRound(round + 1)} showLesson={() => setLesson(true)} />}
    </Page>
  )
}

interface FollowUp { pair: [number, number]; kind: Kind; story: Story; due: number }

function Round({ worldId, levelId, again, showLesson, repeatRef }: { worldId: string; levelId: number; again: () => void; showLesson: () => void; repeatRef: React.MutableRefObject<() => void> }) {
  const st = useStore()
  const { save, say, guardMs, recordAnswer, completeQuest, go } = st
  const world = worldById(worldId)
  const total = save.parent.questionsPerQuest
  const history = useRef<{ independent: boolean }[]>([])
  const recent = useRef<string[]>([])
  const followUp = useRef<FollowUp | null>(null)
  const lastTap = useRef(0)

  const make = (i: number, prev?: Question): Question => {
    const h = history.current.slice(-2)
    const fu = followUp.current && i >= followUp.current.due ? followUp.current : null
    if (fu) followUp.current = null
    const q = makeQuestion(levelId, {
      worldId, enabledTables: save.parent.enabledTables, difficulty: save.parent.difficulty, facts: save.facts, recent: recent.current,
      lastKind: prev?.kind, scaffold: h.length === 2 && h.every((x) => !x.independent),
      pair: fu?.pair, avoidKind: fu?.kind, avoidStory: fu?.story,
    })
    recent.current = [...recent.current, factKey(q.a, q.b)].slice(-4)
    return q
  }

  const [idx, setIdx] = useState(0)
  const [first] = useState<Question>(() => make(0))
  const [q, setQ] = useState<Question>(first)
  const [phase, setPhase] = useState<'ask' | 'right' | 'done'>('ask')
  const [tried, setTried] = useState<number[]>([])
  const [hint, setHint] = useState(0) // 0 none, 1 picture labels, 2 counting
  const [filled, setFilled] = useState<boolean[]>(first.kind === 'build' ? Array(first.a).fill(false) : [])
  const [earned, setEarned] = useState(0)
  const [gift, setGift] = useState<string | null>(null)
  const [said, setSaid] = useState(0)

  const built = q.kind !== 'build' || (filled.length === q.a && filled.every(Boolean))
  const text = q.kind === 'build' && built ? buildDoneText(q) : instruction(q)
  useEffect(() => { say(instruction(first)) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const startQuestion = (nq: Question, i: number) => {
    setQ(nq); setIdx(i); setTried([]); setHint(0); setFilled(nq.kind === 'build' ? Array(nq.a).fill(false) : []); setPhase('ask')
    setSaid((s) => s + 1)
    setTimeout(() => say(instruction(nq)), 0)
  }

  const choose = (n: number) => {
    if (phase !== 'ask') return
    const now = Date.now()
    if (now - lastTap.current < guardMs) return // no accidental double taps
    lastTap.current = now
    if (n === q.answer) {
      const independent = tried.length === 0 && hint === 0
      history.current.push({ independent })
      recordAnswer(q.a, q.b, independent, tried.length > 0, COIN_PER_ANSWER)
      if (!independent) followUp.current = { pair: [q.a, q.b], kind: q.kind, story: q.story, due: Math.min(idx + 2, total - 1) }
      setEarned((e) => e + COIN_PER_ANSWER)
      setPhase('right')
      sfx.right(); setTimeout(sfx.coin, 450)
      const msg = tried.length ? BRAVE[idx % BRAVE.length] : CHEER[idx % CHEER.length]
      say(`${msg} ${q.a} times ${q.b} is ${q.answer}.`)
    } else {
      setTried((t) => (t.includes(n) ? t : [...t, n]))
      setHint(2)
      sfx.gentle()
      say("Let's count together!")
    }
  }

  const next = () => {
    if (idx + 1 < total) return startQuestion(make(idx + 1, q), idx + 1)
    const g = save.pets.length === 0 ? 'clover' : null
    completeQuest(levelId, COIN_BONUS, g)
    setGift(g)
    setEarned((e) => e + COIN_BONUS)
    setPhase('done')
    sfx.unlock()
    say(`Quest complete! You earned ${earned + COIN_BONUS} coins.`)
  }

  const helpLabel = hint === 0 ? '💡 Show me a hint' : hint === 1 ? '👀 Count with me' : '🙈 Hide help'
  const help = () => setHint((h) => (h === 0 ? 1 : h === 1 ? 2 : 0))
  const pet = petById(save.activePet)
  repeatRef.current = () => say(text, true)

  if (phase === 'done') {
    const gp = petById(gift)
    return (
      <div className="card pop p-5 sm:p-8 flex flex-col items-center gap-4 text-center" role="status">
        <h2 className="text-4xl sm:text-5xl">🎉 Quest complete!</h2>
        <p className="text-xl">You worked hard and kept going. That is what matters.</p>
        <div className="flex items-center gap-6 text-3xl font-display"><span className="flex items-center gap-2"><Coin size={40} /> +{earned}</span><span className="flex items-center gap-2"><Star size={40} /> +1</span></div>
        {gp && <div className="flex flex-col items-center gap-1"><PetSprite pet={gp} size={120} /><p className="text-2xl font-display">You made a new friend: {gp.name}!</p></div>}
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          <Button onClick={again} className="btn-lg">▶ Play again</Button>
          <Button onClick={() => go({ name: 'world', id: worldId })} className="btn-lg btn-blue">🗺️ Back to the map</Button>
          {gp && <Button onClick={() => go({ name: 'pets' })} className="btn-lg btn-pink">🐾 See my pets</Button>}
        </div>
      </div>
    )
  }

  const equation = q.kind === 'repeated' ? `${Array(q.a).fill(q.b).join(' + ')} = ?` : q.kind === 'choice' ? `${q.a} × ${q.b} = ?` : null
  const answerShown = phase === 'right'
  const showPicture = q.kind !== 'choice' || hint >= 1
  const visual = hint === 2 && phase === 'ask' && built ? (
    <CountTogether a={q.a} b={q.b} story={q.story} array={q.kind === 'array'} onDone={() => setHint(0)} />
  ) : (
    <div className="flex flex-col items-center gap-3">
      {equation && <div className="text-4xl sm:text-6xl font-display card px-6 py-3">{answerShown ? equation.replace('?', String(q.answer)) : equation}</div>}
      {showPicture && (q.kind === 'array' ? <ArrayView a={q.a} b={q.b} story={q.story} /> : (
        <GroupsView a={q.a} b={q.b} story={q.story} counts={hint >= 1 || answerShown} filled={q.kind === 'build' && phase === 'ask' ? filled : undefined} onFill={q.kind === 'build' ? (i) => { sfx.tap(); setFilled((f) => f.map((v, k) => (k === i ? true : v))) } : undefined} />
      ))}
    </div>
  )

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2" role="img" aria-label={`Question ${idx + 1} of ${total}`}>
          {Array.from({ length: total }, (_, i) => <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg border-[3px] border-[var(--line)] grid place-items-center text-xs" style={{ background: i < idx || (i === idx && phase === 'right') ? '#4ade80' : i === idx ? '#ffd43b' : '#fff' }}>{i < idx || (i === idx && phase === 'right') ? '✓' : ''}</div>)}
        </div>
        <button type="button" className="underline text-sm sm:text-base font-extrabold p-2" data-scan="" onClick={showLesson}>👀 Show me how</button>
      </div>

      <div className="flex items-end gap-3">
        <Blocky look={{ skin: world.npc.skin, hairStyle: 'short', hairColor: '#4a2f1a', shirt: world.npc.shirt, pants: '#3b4a7a', hat: world.npc.hat, face: 'grin' }} size={84} className="shrink-0 wiggle" />
        <div className="card relative flex-1 p-4 sm:p-5 bg-[var(--card2)]">
          <div className="text-sm font-extrabold opacity-70 mb-1">{world.npc.name}</div>
          <p key={said} className="text-xl sm:text-3xl font-display leading-snug" aria-live="polite">{text}</p>
        </div>
      </div>

      {visual}

      {phase === 'ask' && built && (
        <div role="group" aria-label="Answers" className={`grid gap-3 sm:gap-5 ${q.choices.length === 2 ? 'grid-cols-2' : q.choices.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
          {q.choices.map((c, i) => (
            <Button key={c} onClick={() => choose(c)} aria-label={`${c}${tried.includes(c) ? ', try another' : ''}`} className={`btn-xl ${CHOICE_COLORS[i % 4]} ${tried.includes(c) ? 'opacity-50' : ''}`}>{c}</Button>
          ))}
        </div>
      )}
      {phase === 'ask' && tried.length > 0 && hint !== 2 && <p className="text-center text-xl font-display" role="status">💛 Almost! Try another answer. There is no rush.</p>}
      {phase === 'ask' && built && hint !== 2 && <div className="flex justify-center"><Button onClick={help} className="btn-white">{helpLabel}</Button></div>}

      {phase === 'right' && (
        <div className="card pop p-5 flex flex-col items-center gap-3 text-center bg-[#e7ffe9]" role="status">
          <div className="relative text-4xl sm:text-5xl font-display">
            {tried.length ? BRAVE[idx % BRAVE.length] : CHEER[idx % CHEER.length]}
            <span className="coin-float absolute -top-6 right-0 text-2xl flex items-center gap-1"><Coin /> +{COIN_PER_ANSWER}</span>
          </div>
          <p className="text-2xl">{noun(q.a, q.story.holder)} × {noun(q.b, q.story.item)} = <b>{noun(q.answer, q.story.item)}</b></p>
          {pet && <PetSprite pet={pet} size={84} />}
          <Button onClick={next} className="btn-lg">{idx + 1 < total ? 'Next ➜' : 'Finish ★'}</Button>
        </div>
      )}
    </div>
  )
}
