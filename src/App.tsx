import { StoreProvider, useStore } from './state/store.tsx'
import { Scanner } from './a11y/Scanner.tsx'
import { Dialog } from './ui/Dialog.tsx'
import { Button } from './ui/Controls.tsx'
import { Home } from './screens/Home.tsx'
import { Worlds, WorldMap } from './screens/Worlds.tsx'
import { Quest } from './screens/Quest.tsx'
import { Pets } from './screens/Pets.tsx'
import { Room } from './screens/Room.tsx'
import { AvatarEditor } from './screens/Avatar.tsx'
import { Trophies } from './screens/Trophies.tsx'
import { Parent } from './screens/Parent.tsx'
import { SettingsDialogBody } from './screens/Settings.tsx'

function Screen() {
  const { screen: s } = useStore()
  switch (s.name) {
    case 'home': return <Home />
    case 'worlds': return <Worlds />
    case 'world': return <WorldMap id={s.id} />
    case 'quest': return <Quest key={`${s.world}-${s.level}`} worldId={s.world} levelId={s.level} />
    case 'pets': return <Pets />
    case 'room': return <Room />
    case 'avatar': return <AvatarEditor />
    case 'trophies': return <Trophies />
    case 'parent': return <Parent />
  }
}

function Shell() {
  const { settingsOpen, closeSettings, paused, setPaused, toasts, dismissToast } = useStore()
  return (
    <>
      <Screen />
      {settingsOpen && <Dialog title="Settings" onClose={closeSettings} wide><SettingsDialogBody onClose={closeSettings} /></Dialog>}
      {paused && (
        <Dialog title="Paused" onClose={() => setPaused(false)}>
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-4xl">⏸ Paused</h2>
            <p className="text-xl">Take all the time you need. Your game is waiting.</p>
            <Button onClick={() => setPaused(false)} className="btn-xl !text-3xl">▶ Keep playing</Button>
          </div>
        </Dialog>
      )}
      <div className="fixed bottom-3 inset-x-3 z-[60] flex flex-col items-center gap-2 pointer-events-none" role="status" aria-live="polite">
        {toasts.map((t) => (
          <button key={t.id} type="button" onClick={() => dismissToast(t.id)} className="card pop pointer-events-auto flex items-center gap-3 px-4 py-3 text-lg bg-[#fff6c8]"><span className="text-3xl" aria-hidden="true">{t.icon}</span>{t.text}</button>
        ))}
      </div>
      <Scanner />
    </>
  )
}

export default function App() {
  return <StoreProvider><Shell /></StoreProvider>
}
