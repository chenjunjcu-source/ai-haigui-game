const STORAGE_KEY = 'haigui_progress_v1'

export type ProgressState = {
  clearedIds: string[]
}

function loadRaw(): ProgressState {
  if (typeof window === 'undefined') return { clearedIds: [] }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { clearedIds: [] }
    const parsed = JSON.parse(raw) as ProgressState
    if (!Array.isArray(parsed.clearedIds)) return { clearedIds: [] }
    return { clearedIds: parsed.clearedIds.map(String) }
  } catch {
    return { clearedIds: [] }
  }
}

function save(state: ProgressState) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

export function getProgress(): ProgressState {
  return loadRaw()
}

export function isCleared(id: string): boolean {
  return loadRaw().clearedIds.includes(id)
}

export function markCleared(id: string) {
  const current = loadRaw()
  if (current.clearedIds.includes(id)) return
  const next = { clearedIds: [...current.clearedIds, id] }
  save(next)
}

