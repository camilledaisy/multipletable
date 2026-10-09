import { useStore } from '../state/store.tsx'
import { Segmented, Stepper, Toggle } from '../ui/Controls.tsx'
import { sfx } from '../a11y/audio.ts'
import { speak } from '../a11y/speech.ts'

/** Every accessibility control in one place. Shown from the ♿ button on every screen, and inside the Grown-ups area. */
export function AccessibilityControls() {
  const { save, setSettings } = useStore()
  const s = save.settings
  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-4" aria-label="Sound and reading">
        <Toggle icon="🗣️" label="Read to me" hint="Reads instructions out loud. No microphone is ever used." value={s.narration} onChange={(v) => { setSettings({ narration: v }); if (v) speak('I will read to you.') }} />
        <Toggle icon="🔇" label="Mute all sounds" value={s.muted} onChange={(v) => setSettings({ muted: v })} />
        <Stepper icon="🔊" label="Volume" value={s.volume} max={5} onChange={(v) => { setSettings({ volume: v }); setTimeout(sfx.right, 50) }} />
      </section>
      <section className="flex flex-col gap-4" aria-label="Movement and looks">
        <Toggle icon="🧘" label="Reduced motion" hint="Turns all movement off. The game never flashes." value={s.reducedMotion} onChange={(v) => setSettings({ reducedMotion: v })} />
        <Segmented icon="🌀" label="Animation size" value={s.motion} onChange={(v) => setSettings({ motion: v })} options={[{ v: 'gentle', text: 'Tiny' }, { v: 'normal', text: 'Normal' }, { v: 'lively', text: 'Big' }]} />
        <Toggle icon="🌓" label="High contrast" value={s.highContrast} onChange={(v) => setSettings({ highContrast: v })} />
        <Segmented icon="🔤" label="Text size" value={s.textSize} onChange={(v) => setSettings({ textSize: v })} options={[{ v: 'normal', text: 'Normal' }, { v: 'large', text: 'Large' }, { v: 'xl', text: 'Extra large' }]} />
      </section>
      <section className="flex flex-col gap-4" aria-label="Controls">
        <Segmented icon="🐢" label="Speed" value={s.pace} onChange={(v) => setSettings({ pace: v })} options={[{ v: 'relaxed', text: '🐢 Slow' }, { v: 'normal', text: 'Normal' }, { v: 'quick', text: '🐇 Quick' }]} />
        <p className="text-sm -mt-2 opacity-80">Speed changes the voice, how long a tap is protected from accidental repeats, and how fast switch scanning moves.</p>
        <Toggle icon="🔘" label="Switch scanning" hint="A highlight moves along the buttons. Press Space or Enter (or your switch) to choose the highlighted one." value={s.scanning} onChange={(v) => setSettings({ scanning: v })} />
      </section>
    </div>
  )
}

export function SettingsDialogBody({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-3xl text-center">♿ Settings</h2>
      <AccessibilityControls />
      <button type="button" data-scan="" onClick={onClose} className="btn btn-lg self-center">✔ Done</button>
    </div>
  )
}
