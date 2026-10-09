import { useEffect } from 'react'
import { useStore, SCAN_MS } from '../state/store.tsx'

const SEL = '[data-scan]:not([disabled])'
const CLS = 'scan-on'

/**
 * Single-switch scanning. A highlight steps through every [data-scan] control (inside the open dialog, if any).
 * Press the switch (Space or Enter) to activate the highlighted one. No timing pressure: it just keeps looping.
 */
export function Scanner() {
  const { save, paused, say } = useStore()
  const { scanning, pace, narration } = save.settings

  useEffect(() => {
    if (!scanning || paused) return
    let cur: HTMLElement | null = null
    const list = () => {
      const dialogs = document.querySelectorAll('[data-modal]')
      const root: ParentNode = dialogs.length ? dialogs[dialogs.length - 1] : document
      return [...root.querySelectorAll<HTMLElement>(SEL)].filter((e) => e.offsetParent !== null)
    }
    const mark = (el: HTMLElement | null) => {
      cur?.classList.remove(CLS)
      cur = el
      if (!el) return
      el.classList.add(CLS)
      el.scrollIntoView({ block: 'nearest', behavior: document.documentElement.dataset.motion === 'off' ? 'auto' : 'smooth' })
      if (narration) say(el.getAttribute('aria-label') ?? el.textContent ?? '')
    }
    const step = () => {
      const items = list()
      if (!items.length) return mark(null)
      const i = cur ? items.indexOf(cur) : -1
      mark(items[(i + 1) % items.length])
    }
    step()
    const timer = setInterval(step, SCAN_MS[pace])
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== ' ' && e.key !== 'Enter') return
      if (!cur || !document.contains(cur)) return
      e.preventDefault()
      e.stopPropagation()
      if (!e.repeat) cur.click()
    }
    const onUp = (e: KeyboardEvent) => { if (e.key === ' ' && cur) e.preventDefault() }
    window.addEventListener('keydown', onKey, true)
    window.addEventListener('keyup', onUp, true)
    return () => {
      window.removeEventListener('keyup', onUp, true)
      clearInterval(timer)
      window.removeEventListener('keydown', onKey, true)
      cur?.classList.remove(CLS)
    }
  }, [scanning, paused, pace, narration, say])

  return null
}
