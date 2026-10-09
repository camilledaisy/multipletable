import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

/** Accessible modal: focus moves in, Tab stays inside, Escape closes (when allowed), focus returns after. */
export function Dialog({ title, children, onClose, wide = false }: { title: string; children: ReactNode; onClose?: () => void; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    const first = ref.current?.querySelector<HTMLElement>('button, [href], input')
    first?.focus()
    return () => prev?.focus?.()
  }, [])
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && onClose) return onClose()
    if (e.key !== 'Tab' || !ref.current) return
    const f = [...ref.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input')]
    if (!f.length) return
    const i = f.indexOf(document.activeElement as HTMLElement)
    if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus() }
    else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus() }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 overflow-y-auto" onKeyDown={onKey}>
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} data-modal="" className={`card pop w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} max-h-[94dvh] overflow-y-auto p-5 sm:p-7`}>
        {children}
      </div>
    </div>
  )
}
