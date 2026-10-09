// Optional text-to-speech narration. Uses the browser's built-in voices; never the microphone.
export const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

let rate = 1
export const setSpeechRate = (r: number) => { rate = r }

export function speak(text: string) {
  if (!canSpeak) return
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text.replace(/×/g, ' times ').replace(/\+/g, ' plus ').replace(/=/g, ' equals '))
  u.rate = rate
  u.pitch = 1.1
  speechSynthesis.speak(u)
}

export const stopSpeaking = () => { if (canSpeak) speechSynthesis.cancel() }
