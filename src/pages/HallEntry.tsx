import React from 'react'
import Home from './Home'
import Gate from './Gate'
import { loadPlayer } from '../lib/player'
import { getProgress } from '../lib/progress'

export default function HallEntry() {
  const player = React.useMemo(() => loadPlayer(), [])

  React.useEffect(() => {
    if (!player) return

    const p = getProgress()
    fetch('/api/player/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerId: player.id,
        name: player.name,
        clearedIds: p.clearedIds
      })
    }).catch(() => {
      // 排行榜同步失败不影响游戏本体
    })
  }, [player])

  if (!player) {
    return <Gate />
  }
  return <Home />
}

