import type { ReactNode } from 'react'

export function Button({ children, className = '', ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" data-scan="" className={`btn ${className}`} {...p}>{children}</button>
}

export function Toggle({ label, icon, value, onChange, hint }: { label: string; icon: string; value: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <div className="flex items-center gap-3 justify-between">
      <div className="min-w-0"><div className="text-lg font-extrabold"><span aria-hidden="true">{icon} </span>{label}</div>{hint && <div className="text-sm opacity-75 font-semibold">{hint}</div>}</div>
      <Button role="switch" aria-checked={value} aria-label={label} onClick={() => onChange(!value)} className={`${value ? '' : 'btn-white'} min-w-28 shrink-0`}>{value ? '✔ On' : 'Off'}</Button>
    </div>
  )
}

export function Segmented<T extends string | number>({ label, icon, value, options, onChange }: { label: string; icon: string; value: T; options: { v: T; text: ReactNode }[]; onChange: (v: T) => void }) {
  return (
    <div role="group" aria-label={label}>
      <div className="text-lg font-extrabold mb-2"><span aria-hidden="true">{icon} </span>{label}</div>
      <div className="flex flex-wrap gap-3">
        {options.map((o) => (
          <Button key={String(o.v)} aria-pressed={o.v === value} onClick={() => onChange(o.v)} className={`flex-1 ${o.v === value ? 'btn-yellow' : 'btn-white'}`}>{o.text}</Button>
        ))}
      </div>
    </div>
  )
}

/** Big − / + stepper (no sliders: sliders need precise dragging). */
export function Stepper({ label, icon, value, max, onChange }: { label: string; icon: string; value: number; max: number; onChange: (v: number) => void }) {
  return (
    <div role="group" aria-label={label}>
      <div className="text-lg font-extrabold mb-2"><span aria-hidden="true">{icon} </span>{label}</div>
      <div className="flex items-center gap-3">
        <Button aria-label={`${label} down`} onClick={() => onChange(Math.max(0, value - 1))} disabled={value <= 0} className="btn-blue text-3xl">−</Button>
        <div className="flex-1 flex gap-1.5 justify-center" role="img" aria-label={`${value} out of ${max}`}>
          {Array.from({ length: max }, (_, i) => <div key={i} className="h-8 flex-1 rounded-md border-[3px] border-[var(--line)]" style={{ background: i < value ? '#4ade80' : '#fff' }} />)}
        </div>
        <Button aria-label={`${label} up`} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} className="btn-blue text-3xl">+</Button>
      </div>
    </div>
  )
}
