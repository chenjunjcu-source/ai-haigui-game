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

export function updatePlayerProgress({ playerId, name, clearedIds }) {
  if (!playerId || !name) return
  const ids = Array.isArray(clearedIds) ? clearedIds.map(String) : []
  const clearedSet = new Set(ids)

  const players = loadPlayers()
  const prev = players[playerId] || {}

  const clearedCount = clearedSet.size
  const maxClearedId = ids
    .map((id) => Number(id))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => b - a)[0] || 0

  players[playerId] = {
    playerId,
    name,
    clearedCount,
    maxClearedId,
    updatedAt: new Date().toISOString(),
    // 保留之前的信息（例如以后扩展）
    ...prev
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

