// Gentle WebAudio tones. Nothing harsh, nothing negative, nothing flashing.
let ctx: AudioContext | null = null
let level = 0.6 // 0..1

export function setAudio(volume: number, muted: boolean) {
  level = muted ? 0 : (volume / 5) * 0.6
}

function tone(freq: number, start: number, dur: number, vol = 0.25) {
  if (level <= 0) return
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    const t = ctx.currentTime + start
    o.type = 'sine'
    o.frequency.value = freq
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(vol * level, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g).connect(ctx.destination)
    o.start(t)
    o.stop(t + dur + 0.05)
  } catch { /* audio is optional */ }
}

export const sfx = {
  tap: () => tone(520, 0, 0.1, 0.15),
  right: () => [523, 659, 784].forEach((f, i) => tone(f, i * 0.12, 0.3)),
  /** wrong answer: a soft, warm "let's look together" — never a buzzer */
  gentle: () => { tone(392, 0, 0.35, 0.15); tone(440, 0.18, 0.4, 0.15) },
  coin: () => { tone(880, 0, 0.12, 0.18); tone(1175, 0.1, 0.25, 0.18) },
  unlock: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.14, 0.4)),
}
