import { useStore } from '../state/store.tsx'
import { Button } from './Controls.tsx'
import { Coin, Star } from '../art/Scenery.tsx'

/** Same bar, same places, on every screen: back/home on the left, coins in the middle, settings + pause on the right. */
export function TopBar({ title, onRepeat }: { title: string; onRepeat?: () => void }) {
  const { save, screen, back, openSettings, setPaused } = useStore()
  const home = screen.name === 'home'
  return (
    <header className="sticky top-0 z-30 px-3 pt-3 pb-2">
      <div className="card mx-auto max-w-5xl flex flex-wrap items-center gap-1.5 sm:gap-3 p-2">
        {!home ? <Button onClick={back} aria-label={screen.name === 'quest' || screen.name === 'world' || screen.name === 'worlds' ? 'Go back' : 'Go home'} className="btn-orange !px-3 !min-h-14">{screen.name === 'quest' || screen.name === 'world' || screen.name === 'worlds' ? <>⬅<span className="hidden sm:inline"> Back</span></> : <>🏠<span className="hidden sm:inline"> Home</span></>}</Button> : <div className="px-2 font-display text-lg sm:text-2xl">🧱<span className="hidden sm:inline"> Blocky Buddies</span></div>}
        <h1 className="flex-1 min-w-0 text-center text-xl sm:text-2xl truncate order-last sm:order-none basis-full sm:basis-auto text-lg">{title}</h1>
        <div className="flex items-center gap-1 font-display text-lg sm:text-xl flex-1 sm:flex-none justify-center" role="status" aria-label={`${save.coins} coins, ${save.stars} stars`}>
          <Coin /> <span>{save.coins}</span> <span className="ml-1"><Star /></span> <span>{save.stars}</span>
        </div>
        {onRepeat && <Button onClick={onRepeat} aria-label="Repeat instructions" className="btn-blue !px-3 !min-h-14">🔊<span className="hidden sm:inline"> Repeat</span></Button>}
        <Button onClick={openSettings} aria-label="Accessibility settings" className="btn-purple !px-3 !min-h-14">♿<span className="hidden sm:inline"> Settings</span></Button>
        <Button onClick={() => setPaused(true)} aria-label="Pause" className="btn-yellow !px-3 !min-h-14">⏸</Button>
      </div>
    </header>
  )
}

export function Page({ title, children, onRepeat }: { title: string; children: React.ReactNode; onRepeat?: () => void }) {
  return (
    <div className="min-h-dvh pb-10">
      <TopBar title={title} onRepeat={onRepeat} />
      <main className="mx-auto max-w-5xl px-3 pt-2">{children}</main>
    </div>
  )
}
