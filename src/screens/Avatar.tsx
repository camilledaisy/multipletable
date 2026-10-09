import type { ReactNode } from 'react'
import { useStore } from '../state/store.tsx'
import { Page } from '../ui/TopBar.tsx'
import { Button } from '../ui/Controls.tsx'
import { Blocky } from '../art/Blocky.tsx'
import { CLOTHES, FACES, HAIR_COLORS, HAIR_STYLES, HATS, SKINS } from '../data/avatar.ts'
import type { AvatarLook } from '../types.ts'

const FACE_LABEL = { smile: '🙂 Smile', grin: '😁 Grin', cool: '😎 Cool', starry: '🤩 Starry' }

function Row({ title, children }: { title: string; children: ReactNode }) {
  return <section aria-label={title}><h2 className="text-xl mb-2">{title}</h2><div className="flex flex-wrap gap-3">{children}</div></section>
}

export function AvatarEditor() {
  const { save, setAvatar, go } = useStore()
  const a = save.avatar
  const swatch = (key: 'skin' | 'hairColor' | 'shirt' | 'pants', list: string[], name: string) =>
    list.map((c, i) => <Button key={c} onClick={() => setAvatar({ [key]: c })} aria-pressed={a[key] === c} aria-label={`${name} colour ${i + 1}`} className="!min-w-16 !min-h-16 !p-0" style={{ background: c }}>{a[key] === c ? '✔' : ''}</Button>)
  const opt = <K extends 'hairStyle' | 'hat' | 'face'>(key: K, list: AvatarLook[K][], label?: (v: AvatarLook[K]) => string) =>
    list.map((v) => <Button key={v} onClick={() => setAvatar({ [key]: v })} aria-pressed={a[key] === v} className={`capitalize ${a[key] === v ? 'btn-yellow' : 'btn-white'}`}>{label ? label(v) : v === 'none' ? 'None' : v}</Button>)
  return (
    <Page title="Dress Up">
      <div className="grid gap-5 md:grid-cols-[auto_1fr] items-start">
        <div className="card p-4 flex justify-center md:sticky md:top-24 bg-[var(--card2)]"><Blocky look={a} size={190} className="bob" /></div>
        <div className="card p-4 flex flex-col gap-5">
          <Row title="Skin">{swatch('skin', SKINS, 'Skin')}</Row>
          <Row title="Hair style">{opt('hairStyle', HAIR_STYLES)}</Row>
          <Row title="Hair colour">{swatch('hairColor', HAIR_COLORS, 'Hair')}</Row>
          <Row title="Shirt">{swatch('shirt', CLOTHES, 'Shirt')}</Row>
          <Row title="Pants">{swatch('pants', CLOTHES, 'Pants')}</Row>
          <Row title="Hat">{opt('hat', HATS)}</Row>
          <Row title="Face">{opt('face', FACES, (f) => FACE_LABEL[f])}</Row>
          <Button onClick={() => go({ name: 'home' })} className="btn-lg self-center">✔ Done</Button>
        </div>
      </div>
    </Page>
  )
}
