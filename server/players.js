import fs from 'fs'

const DATA_PATH = new URL('./players.json', import.meta.url)

function loadPlayers() {
  try {
    if (!fs.existsSync(DATA_PATH)) return {}
    const raw = fs.readFileSync(DATA_PATH, 'utf8')
    if (!raw.trim()) return {}
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') return parsed
    return {}
  } catch {
    return {}
  }
}

function savePlayers(players) {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(players, null, 2), 'utf8')
  } catch {
    // ignore
  }
}

export function updatePlayerProgress({ playerId, name, clearedIds, currentStoryId, history }) {
  if (!playerId || !name) return
  const ids = Array.isArray(clearedIds) ? clearedIds.map(String) : []
  const clearedSet = new Set(ids)
  const normalizedClearedIds = Array.from(clearedSet).sort((a, b) => Number(a) - Number(b))

  const players = loadPlayers()
  const prev = players[playerId] || {}

  const clearedCount = normalizedClearedIds.length
  const maxClearedId = normalizedClearedIds
    .map((id) => Number(id))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => b - a)[0] || 0
  const nextStoryId = Math.min(Math.max(maxClearedId + 1, 1), 60)
  const explicitCurrent = Number(currentStoryId)
  const prevCurrent = Number(prev.currentStoryId)
  const resolvedCurrentStoryId = Number.isFinite(explicitCurrent) && explicitCurrent > 0
    ? explicitCurrent
    : Number.isFinite(prevCurrent) && prevCurrent > 0
      ? Math.max(prevCurrent, nextStoryId)
      : nextStoryId

  players[playerId] = {
    // 先继承旧数据，再覆盖最新值，避免旧值把新值覆盖回去
    ...prev,
    playerId,
    name,
    clearedIds: normalizedClearedIds,
    clearedCount,
    maxClearedId,
    currentStoryId: resolvedCurrentStoryId,
    history: Array.isArray(history) ? history : Array.isArray(prev.history) ? prev.history : [],
    updatedAt: new Date().toISOString(),
  }

  savePlayers(players)
}

export function getLeaderboard(limit = 20) {
  const players = loadPlayers()
  const list = Object.values(players)

  list.sort((a, b) => {
    if (b.clearedCount !== a.clearedCount) {
      return b.clearedCount - a.clearedCount
    }
    if (b.maxClearedId !== a.maxClearedId) {
      return b.maxClearedId - a.maxClearedId
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  return list.slice(0, limit)
}

export function getPlayerById(playerId) {
  const players = loadPlayers()
  return players[playerId] || null
}

