import type { AvatarLook } from '../types.ts'

export const SKINS = ['#fde0c5', '#f1c27d', '#d9a066', '#c68642', '#8d5524', '#5c3a21']
export const HAIR_COLORS = ['#2b1d12', '#7a4a21', '#d9a441', '#e5532d', '#4b6bff', '#ff6fb5']
export const CLOTHES = ['#ef6a6a', '#ff9f43', '#ffd43b', '#51cf66', '#22b8cf', '#4d8dff', '#9775fa', '#ff6fb5']
export const HAIR_STYLES: AvatarLook['hairStyle'][] = ['short', 'spiky', 'long', 'none']
export const HATS: AvatarLook['hat'][] = ['none', 'cap', 'crown', 'beanie', 'party']
export const FACES: AvatarLook['face'][] = ['smile', 'grin', 'cool', 'starry']

export const DEFAULT_AVATAR: AvatarLook = {
  skin: SKINS[1], hairStyle: 'short', hairColor: HAIR_COLORS[1], shirt: CLOTHES[5], pants: CLOTHES[4], hat: 'none', face: 'smile',
}
