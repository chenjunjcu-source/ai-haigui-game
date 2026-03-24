import React from 'react'
import { loadPlayer } from '../lib/player'

type Entry = {
  playerId: string
  name: string
  clearedCount: number
  maxClearedId: number
  updatedAt: string
}

export default function Leaderboard() {
  const me = loadPlayer()
  const [entries, setEntries] = React.useState<Entry[]>([])

  React.useEffect(() => {
    let cancelled = false
    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        setEntries(Array.isArray(data.players) ? data.players : [])
      })
      .catch(() => {
        // 忽略错误，排行榜只是增强体验
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (!entries.length) {
    return (
      <div className="text-[10px] text-slate-500">
        暂无榜单数据，先去破解几起案件吧。
      </div>
    )
  }

  return (
    <div className="space-y-2 text-[11px]">
      <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
        侦探排行榜
      </div>
      <ul className="space-y-1.5">
        {entries.slice(0, 8).map((e, idx) => {
          const isMe = me && me.id === e.playerId
          return (
            <li
              key={e.playerId}
              className={[
                'flex items-center justify-between rounded-lg px-2 py-1.5',
                isMe
                  ? 'bg-cyan-500/10 ring-1 ring-cyan-400/50 text-cyan-50'
                  : 'bg-slate-900/60 ring-1 ring-slate-700/80 text-slate-200'
              ].join(' ')}
            >
              <div className="flex items-center gap-2">
                <span className="w-4 text-[10px] text-slate-400">#{idx + 1}</span>
                <span className="max-w-[120px] truncate">{e.name}</span>
              </div>
              <div className="text-[10px] text-slate-400">
                {e.clearedCount} 关 · 至少通到 {e.maxClearedId}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

