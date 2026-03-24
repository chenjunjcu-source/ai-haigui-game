const ID_KEY = 'haigui_player_id_v1'
const NAME_KEY = 'haigui_player_name_v1'

export type PlayerIdentity = {
  id: string
  name: string
}

function makeId() {
  const c = globalThis.crypto as unknown as { randomUUID?: () => string } | undefined
  if (c?.randomUUID) return c.randomUUID()
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export function loadPlayer(): PlayerIdentity | null {
  if (typeof window === 'undefined') return null
  const id = window.localStorage.getItem(ID_KEY)
  const name = window.localStorage.getItem(NAME_KEY)
  if (!id || !name) return null
  return { id, name }
}

export function savePlayerName(name: string): PlayerIdentity {
  const trimmed = name.trim() || '无名侦探'
  let id = typeof window !== 'undefined' ? window.localStorage.getItem(ID_KEY) : null
  if (!id) id = makeId()

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(ID_KEY, id)
    window.localStorage.setItem(NAME_KEY, trimmed)
  }

  return { id, name: trimmed }
}

